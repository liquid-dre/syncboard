import { Issue as PrismaIssue } from "@/lib/generated/prisma";

export type IssueWithRelations = PrismaIssue & {
	project: { name: string };
	assignee?: {
		id?: string | null;
		clerkUserId?: string | null;
		name?: string | null;
		imageUrl?: string | null;
	} | null;
	reporter?: {
		id?: string | null;
		clerkUserId?: string | null;
		name?: string | null;
		imageUrl?: string | null;
	} | null;
};
