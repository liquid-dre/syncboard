import { Issue as PrismaIssue } from "@/lib/generated/prisma";

export type IssueWithRelations = PrismaIssue & {
  project: { name: string };
  assignee?: { name?: string | null; imageUrl?: string | null } | null;
  reporter?: {
    clerkUserId?: string | null;
    name?: string | null;
    imageUrl?: string | null;
  } | null;
};