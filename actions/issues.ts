"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { IssueWithRelations } from "@/lib/types/issues";

export async function getIssuesForSprint(
	sprintId: any
): Promise<IssueWithRelations[]> {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	const issues = await db.issue.findMany({
		where: { sprintId: sprintId },
		orderBy: [{ status: "asc" }, { order: "asc" }],
		include: {
			project: { select: { name: true } },
			assignee: true,
			reporter: true,
		},
	});

	return issues;
}

export async function createIssue(
	projectId: any,
	data: {
		status: any;
		title: any;
		description?: any;
		priority: any;
		sprintId: any;
		assigneeId: any;
	}
) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	let user = await db.user.findUnique({ where: { clerkUserId: userId } });

	const lastIssue = await db.issue.findFirst({
		where: { projectId, status: data.status },
		orderBy: { order: "desc" },
	});

	const newOrder = lastIssue ? lastIssue.order + 1 : 0;

	const issue = await db.issue.create({
		data: {
			title: data.title,
			description: data.description,
			status: data.status,
			priority: data.priority,
			projectId: projectId,
			sprintId: data.sprintId,
			reporterId: user.id,
			assigneeId: data.assigneeId || null, // Add this line
			order: newOrder,
		},
		include: {
			assignee: true,
			reporter: true,
		},
	});

	return issue;
}

export async function updateIssueOrder(updatedIssues: any) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) throw new Error("Unauthorized");

	await db.$transaction(
		updatedIssues.map((issue: any) =>
			db.issue.update({
				where: { id: issue.id },
				data: { status: issue.status, order: issue.order },
			})
		)
	);

	return { success: true };
}

export async function deleteIssue(issueId: any) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const issue = await db.issue.findUnique({
		where: { id: issueId },
		include: { project: true },
	});

	if (!issue) {
		throw new Error("Issue not found");
	}

	if (
		issue.reporterId !== user.id &&
		!issue.project.adminIds.includes(user.id)
	) {
		throw new Error("You don't have permission to delete this issue");
	}

	await db.issue.delete({ where: { id: issueId } });

	return { success: true };
}

export async function updateIssue(
	issueId: any,
	// data: { status: any; priority: any }
	data: {
		status?: any;
		priority?: any;
		title?: any;
		description?: any;
		assigneeId?: any;
	}
): Promise<IssueWithRelations> {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	// try {
	// 	const issue = await db.issue.findUnique({
	// 		where: { id: issueId },
	// 		include: { project: true },
	// 	});

	// 	if (!issue) {
	// 		throw new Error("Issue not found");
	// 	}

	// 	if (issue.project.organizationId !== orgId) {
	// 		throw new Error("Unauthorized");
	// 	}

	// 	const updatedIssue = await db.issue.update({
	// 		where: { id: issueId },
	// 		data: {
	// 			status: data.status,
	// 			priority: data.priority,
	// 		},
	// 		include: {
	// 			assignee: true,
	// 			reporter: true,
	// 		},
	// 	});

	// 	return updatedIssue;
	// } catch (error: unknown) {
	// 	if (error instanceof Error) {
	// 		throw new Error("Error updating issue: " + error.message);
	// 	} else {
	// 		throw new Error("An unknown error occurred while updating the issue");
	// 	}
	// }
	try {
		const user = await db.user.findUnique({
			where: { clerkUserId: userId },
		});

		if (!user) {
			throw new Error("User not found");
		}

		const issue = await db.issue.findUnique({
			where: { id: issueId },
			include: { project: true },
		});

		if (!issue) {
			throw new Error("Issue not found");
		}

		if (issue.project.organizationId !== orgId) {
			throw new Error("Unauthorized");
		}

		if (
			issue.reporterId !== user.id &&
			!issue.project.adminIds.includes(user.id)
		) {
			throw new Error("You don't have permission to update this issue");
		}

		const updatedIssue = await db.issue.update({
			where: { id: issueId },
			data: {
				...(data.title !== undefined && { title: data.title }),
				...(data.description !== undefined && {
					description: data.description,
				}),
				...(data.assigneeId !== undefined && {
					assigneeId: data.assigneeId,
				}),
				...(data.status !== undefined && { status: data.status }),
				...(data.priority !== undefined && {
					priority: data.priority,
				}),
			},
			include: {
				assignee: true,
				reporter: true,
				project: { select: { name: true } },
			},
		});

		return updatedIssue as IssueWithRelations;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error("Error updating issue: " + error.message);
		} else {
			throw new Error("An unknown error occurred while updating the issue");
		}
	}
}
