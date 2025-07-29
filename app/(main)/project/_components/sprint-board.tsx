"use client";

import React, { useState } from "react";
import SprintManager from "./sprint-manager";

export default function SprintBoard({ sprints, projectId, orgId }: any) {
	const [currentSprint, setCurrentSprint] = useState(
		sprints.find((spr: { status: string }) => spr.status === "ACTIVE") ||
			sprints[0]
	);

	return (
		<div>
			{/* Sprint Manager */}
			<SprintManager
				sprint={currentSprint}
				setSprint={setCurrentSprint}
				sprints={sprints}
				projectId={projectId}
			/>

			{/* Kanban */}
		</div>
	);
}
