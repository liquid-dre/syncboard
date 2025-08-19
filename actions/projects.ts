"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: {
	name: any;
	key: any;
	description: any;
}) {
	const { userId, orgId } = await auth();

	if (!userId) {
		throw new Error("Unauthorized");
	}

	if (!orgId) {
		throw new Error("No Organization Selected");
	}

	// Check if the user is an admin of the organization
	const { data: membershipList } = await (
		await clerkClient()
	).organizations.getOrganizationMembershipList({
		organizationId: orgId,
	});

	const userMembership = membershipList.find(
		(membership) => membership.publicUserData?.userId === userId
	);

	if (!userMembership || userMembership.role !== "org:admin") {
		throw new Error("Only organization admins can create projects");
	}

	try {
		const project = await db.project.create({
			data: {
				name: data.name,
				key: data.key,
				description: data.description,
				organizationId: orgId,
			},
		});

		return project;
	} catch (error: unknown) {
		// Explicitly mark as unknown for clarity, though it's default
		// Type narrowing: Check if error is an instance of Error
		if (error instanceof Error) {
			throw new Error("Error creating project: " + error.message);
		} else {
			// Handle cases where the thrown error is not an Error object
			// This could be a string, number, or any other value
			throw new Error("An unknown error occurred while creating the project.");
		}
	}
}

export async function getProject(projectId: any) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	// Find user to verify existence
	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	// Get project with sprints and organization
	const project = await db.project.findUnique({
		where: { id: projectId },
		include: {
			sprints: {
				orderBy: { createdAt: "desc" },
			},
		},
	});

	if (!project) {
		throw new Error("Project not found");
	}

	// Verify project belongs to the organization
	if (project.organizationId !== orgId) {
		return null;
	}

	return project;
}

export async function deleteProject(projectId: any) {
	const { userId, orgId, orgRole } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	if (orgRole !== "org:admin") {
		throw new Error("Only organization admins can delete projects");
	}

	const project = await db.project.findUnique({
		where: { id: projectId },
	});

	if (!project || project.organizationId !== orgId) {
		throw new Error(
			"Project not found or you don't have permission to delete it"
		);
	}

	await db.project.delete({
		where: { id: projectId },
	});

	return { success: true };
}

type StatusGroup = { status: string; _count: { _all: number } };
type StatusCount = { status: string; count: number };

export async function getProjectMetrics(projectId: any) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorized");
	}

	const project = await db.project.findUnique({
		where: { id: projectId },
		select: { organizationId: true },
	});

	if (!project || project.organizationId !== orgId) {
		throw new Error("Project not found");
	}

	const groups: StatusGroup[] = await db.issue.groupBy({
		by: ["status"],
		where: { projectId },
		_count: { _all: true },
	});

	const statusCounts = groups.map((g) => ({
		status: g.status,
		count: g._count._all,
	}));

	const total = statusCounts.reduce(
		(sum: number, cur: StatusCount) => sum + cur.count,
		0
	);
	const done =
		statusCounts.find((s: StatusCount) => s.status === "DONE")?.count ?? 0;
	const percentageCompleted = total > 0 ? Math.round((done / total) * 100) : 0;

	return { statusCounts, percentageCompleted };
}
