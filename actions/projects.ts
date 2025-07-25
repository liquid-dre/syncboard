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
