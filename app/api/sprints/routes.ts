import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { deleteSprint } from "@/actions/sprints";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const projectId = searchParams.get("projectId");
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	if (!projectId) {
		return NextResponse.json(
			{ error: "projectId is required" },
			{ status: 400 }
		);
	}

	const sprints = await db.sprint.findMany({
		where: { projectId, project: { organizationId: orgId } },
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(sprints);
}

export async function DELETE(req: Request) {
	const { sprintId } = await req.json();

	if (!sprintId) {
		return NextResponse.json(
			{ error: "sprintId is required" },
			{ status: 400 }
		);
	}

	try {
		const res = await deleteSprint(sprintId);
		return NextResponse.json(res);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to delete sprint" },
			{ status: 500 }
		);
	}
}
