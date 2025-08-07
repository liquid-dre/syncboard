"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/sync-clerk-users.ts
var prisma_1 = require("@/lib/prisma");
var server_1 = require("@clerk/nextjs/server");
function syncClerkUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var usersResponse, users, _i, users_1, user, existing;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, server_1.clerkClient)()];
                case 1: return [4 /*yield*/, (_b.sent()).users.getUserList()];
                case 2:
                    usersResponse = _b.sent();
                    users = usersResponse.data;
                    _i = 0, users_1 = users;
                    _b.label = 3;
                case 3:
                    if (!(_i < users_1.length)) return [3 /*break*/, 8];
                    user = users_1[_i];
                    return [4 /*yield*/, prisma_1.db.user.findUnique({
                            where: { clerkUserId: user.id },
                        })];
                case 4:
                    existing = _b.sent();
                    if (!!existing) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma_1.db.user.create({
                            data: {
                                clerkUserId: user.id,
                                email: user.emailAddresses[0].emailAddress,
                                name: (_a = user.firstName) !== null && _a !== void 0 ? _a : "Unnamed",
                                imageUrl: user.imageUrl,
                            },
                        })];
                case 5:
                    _b.sent();
                    console.log("\u2705 Created user: ".concat(user.emailAddresses[0].emailAddress));
                    return [3 /*break*/, 7];
                case 6:
                    console.log("\uD83D\uDFE1 User already exists: ".concat(user.emailAddresses[0].emailAddress));
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log("🔁 Sync complete.");
                    return [2 /*return*/];
            }
        });
    });
}
syncClerkUsers().catch(function (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
});
