"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// receives orgID from organization/page.tsx as input
export async function getOrganization(slug: any) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthorized");
	}

	// const user = await db.user.findUnique({
	// 	where: { clerkUserId: userId },
	// });

	const user = await getOrCreateUser(userId); 

	if (!user) {
		throw new Error("User not found");
	}

	// Get the organization details
	const organization = await (
		await clerkClient()
	).organizations.getOrganization({
		slug,
	});

	if (!organization) {
		return null;
	}

	// Check if user belongs to this organization
	const { data: membership } = await (
		await clerkClient()
	).organizations.getOrganizationMembershipList({
		organizationId: organization.id,
	});

	const userMembership = membership.find(
		(member) => member.publicUserData?.userId === userId
	);

	// If user is not a member, return null
	if (!userMembership) {
		return null;
	}

	return organization;
}

export async function getOrCreateUser(clerkUserId: string) {
	let user = await db.user.findUnique({ where: { clerkUserId } });

	if (!user) {
		const clerkUser = await (await clerkClient()).users.getUser(clerkUserId);
		user = await db.user.create({
			data: {
				clerkUserId: clerkUser.id,
				email: clerkUser.emailAddresses[0].emailAddress,
				name: clerkUser.firstName ?? "Unnamed",
				imageUrl: clerkUser.imageUrl,
			},
		});
	}

	return user;
}

export async function getProjects(orgId: any) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const projects = await db.project.findMany({
		where: { organizationId: orgId },
		orderBy: { createdAt: "desc" },
	});

	return projects;
}

export async function getUserIssues(userId: any) {
	const { orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("No user id or organization id found");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const issues = await db.issue.findMany({
		where: {
			OR: [{ assigneeId: user.id }, { reporterId: user.id }],
			project: {
				organizationId: orgId,
			},
		},
		include: {
			project: true,
			assignee: true,
			reporter: true,
		},
		orderBy: { updatedAt: "desc" },
	});

	return issues;
}

export async function getOrganizationUsers(orgId: any) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const organizationMemberships = await (
		await clerkClient()
	).organizations.getOrganizationMembershipList({
		organizationId: orgId,
	});

	const userIds = organizationMemberships.data.map(
		(membership) => membership?.publicUserData?.userId
	);

	const users = await db.user.findMany({
		where: {
			clerkUserId: {
				in: userIds,
			},
		},
	});

	return users;
}
