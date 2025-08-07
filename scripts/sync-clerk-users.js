// scripts/sync-clerk-users.ts
import { db } from "../lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

async function syncClerkUsers() {
	const usersResponse = await (await clerkClient()).users.getUserList();
	const users = usersResponse.data;

	for (const user of users) {
		const existing = await db.user.findUnique({
			where: { clerkUserId: user.id },
		});

		if (!existing) {
			await db.user.create({
				data: {
					clerkUserId: user.id,
					email: user.emailAddresses[0].emailAddress,
					name: user.firstName ?? "Unnamed",
					imageUrl: user.imageUrl,
				},
			});
			console.log(`✅ Created user: ${user.emailAddresses[0].emailAddress}`);
		} else {
			console.log(
				`🟡 User already exists: ${user.emailAddresses[0].emailAddress}`
			);
		}
	}

	console.log("🔁 Sync complete.");
}

syncClerkUsers().catch((err) => {
	console.error("❌ Sync failed:", err);
	process.exit(1);
});
