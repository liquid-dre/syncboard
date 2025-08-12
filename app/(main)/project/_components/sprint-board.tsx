"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import useFetch from "@/hooks/use-fetch";

import statuses from "@/data/status.json";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";

import SprintManager from "./sprint-manager";
import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";

export interface Assignee {
	id: string;
	name: string;
	imageUrl?: string;
}

export interface Issue {
	id: string;
	title: string;
	priority: string;
	assignee: Assignee;
	status: string;
	order: number;
}

export default function SprintBoard({ sprints, projectId, orgId }: any) {
	const [currentSprint, setCurrentSprint] = useState(
		sprints.find((spr: { status: string }) => spr.status === "ACTIVE") ||
			sprints[0]
	);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const {
		loading: issuesLoading,
		error: issuesError,
		fn: fetchIssues,
		data: issues,
		setData: setIssues,
	} = useFetch(getIssuesForSprint);

	const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

	useEffect(() => {
		if (issues) {
			setFilteredIssues(issues);
		}
	}, [issues]);

	// const handleFilterChange = (newFilteredIssues: any) => {
	// 	setFilteredIssues(newFilteredIssues);
	// };

	const handleFilterChange = useCallback((newFilteredIssues: Issue[]) => {
		setFilteredIssues(newFilteredIssues);
	}, []);

	useEffect(() => {
		if (currentSprint.id) {
			fetchIssues(currentSprint.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSprint.id]);

	const handleAddIssue = (status: any) => {
		setSelectedStatus(status);
		setIsDrawerOpen(true);
	};

	const handleIssueCreated = () => {
		fetchIssues(currentSprint.id);
	};

	const {
		fn: updateIssueOrderFn,
		loading: updateIssuesLoading,
		error: updateIssuesError,
	} = useFetch(updateIssueOrder);

	// const onDragEnd = async (result: any) => {
	// 	const { destination, source } = result;

	// 	if (!destination) return;

	// 	if (
	// 		destination.droppableId === source.droppableId &&
	// 		destination.index === source.index
	// 	) {
	// 		return;
	// 	}

	// 	// Clone issues deeply to avoid mutating state
	// 	const updatedIssues = issues.map((issue: any) => ({ ...issue }));

	// 	// Get source and destination lists
	// 	const sourceList = updatedIssues
	// 		.filter((i: { status: any }) => i.status === source.droppableId)
	// 		.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
	// 	const destinationList = updatedIssues
	// 		.filter((i: { status: any }) => i.status === destination.droppableId)
	// 		.sort((a: { order: number }, b: { order: number }) => a.order - b.order);

	// 	let movedCard;

	// 	if (source.droppableId === destination.droppableId) {
	// 		// Reorder within the same column
	// 		const reordered = reorder(sourceList, source.index, destination.index);
	// 		reordered.forEach((card: any, idx) => (card.order = idx));
	// 	} else {
	// 		// Move to another column
	// 		[movedCard] = sourceList.splice(source.index, 1);
	// 		movedCard.status = destination.droppableId;
	// 		destinationList.splice(destination.index, 0, movedCard);

	// 		sourceList.forEach(
	// 			(card: { order: any }, idx: any) => (card.order = idx)
	// 		);
	// 		destinationList.forEach(
	// 			(card: { order: any }, idx: any) => (card.order = idx)
	// 		);
	// 	}

	// 	// Merge updated lists back
	// 	const merged = [
	// 		...updatedIssues.filter(
	// 			(i: { status: any }) =>
	// 				i.status !== source.droppableId &&
	// 				i.status !== destination.droppableId
	// 		),
	// 		...sourceList,
	// 		...destinationList,
	// 	];

	// 	setIssues(merged);
	// 	setFilteredIssues(merged); // keeps UI in sync

	// 	await updateIssueOrderFn(merged);
	// };
	const onDragEnd = async (result: any) => {
		const { source, destination } = result;

		if (!destination) return;

		// No movement
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		// Clone state to avoid mutations
		const updatedIssues = [...issues];

		// Find the moved issue
		const movedIssueIndex = updatedIssues.findIndex(
			(i) =>
				i.status === source.droppableId &&
				updatedIssues
					.filter((j) => j.status === source.droppableId)
					.sort((a, b) => a.order - b.order)[source.index].id === i.id
		);

		const movedIssue = { ...updatedIssues[movedIssueIndex] };

		// Update status if moving to another column
		if (source.droppableId !== destination.droppableId) {
			movedIssue.status = destination.droppableId;
		}

		// Remove issue from its old position
		const sourceList = updatedIssues
			.filter((i) => i.status === source.droppableId)
			.sort((a, b) => a.order - b.order);

		sourceList.splice(source.index, 1);

		// Insert into new column at destination
		const destinationList = updatedIssues
			.filter((i) => i.status === destination.droppableId)
			.sort((a, b) => a.order - b.order);

		destinationList.splice(destination.index, 0, movedIssue);

		// Reassign order for affected columns
		sourceList.forEach((card, idx) => (card.order = idx));
		if (source.droppableId !== destination.droppableId) {
			destinationList.forEach((card, idx) => (card.order = idx));
		}

		// Merge lists back into one array
		// const merged = [
		// 	...updatedIssues.filter(
		// 		(i) =>
		// 			i.status !== source.droppableId &&
		// 			i.status !== destination.droppableId
		// 	),
		// 	...sourceList,
		// 	...destinationList,
		// ];

		// // Update state
		// setIssues(merged);
		// setFilteredIssues(merged);

		// // Persist order to backend
		// await updateIssueOrderFn(merged);

		const merged = [
			...updatedIssues.filter(
				(i) =>
					i.status !== source.droppableId &&
					i.status !== destination.droppableId
			),
			...sourceList,
			...destinationList,
		];

		// Deduplicate by id
		const uniqueMerged = Array.from(
			new Map(merged.map((item) => [item.id, item])).values()
		);

		setIssues(uniqueMerged);
		setFilteredIssues(uniqueMerged);

		await updateIssueOrderFn(uniqueMerged);
	};

	if (issuesError) return <div>Error loading issues</div>;

	return (
		<div className="flex flex-col">
			<SprintManager
				sprint={currentSprint}
				setSprint={setCurrentSprint}
				sprints={sprints}
				projectId={projectId}
			/>

			{/* Issues */}
			{issues && !issuesLoading && (
				<BoardFilters issues={issues} onFilterChange={handleFilterChange} />
			)}

			{updateIssuesError && (
				<p className="text-red-500 mt-2">{updateIssuesError.message}</p>
			)}
			{(updateIssuesLoading || issuesLoading) && (
				<BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
			)}

			<DragDropContext onDragEnd={onDragEnd}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
					{statuses.map((column) => (
						<Droppable key={column.key} droppableId={column.key}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-2"
								>
									<h3 className="font-semibold mb-2 text-center">
										{column.name}
									</h3>
									{filteredIssues
										?.filter(
											(issue: { status: string }) => issue.status === column.key
										)
										.map((issue: any, index: number) => (
											<Draggable
												key={issue.id}
												draggableId={String(issue.id)}
												index={index}
												isDragDisabled={updateIssuesLoading}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<IssueCard
															issue={issue}
															onDelete={() => fetchIssues(currentSprint.id)}
															onUpdate={(updated) =>
																setIssues((issues: { id: string }[]) =>
																	issues.map((issue: { id: string }) => {
																		if (issue.id === updated.id) return updated;
																		return issue;
																	})
																)
															}
														/>
													</div>
												)}
											</Draggable>
										))}
									{provided.placeholder}
									{column.key === "TODO" &&
										currentSprint.status !== "COMPLETED" && (
											<Button
												variant="ghost"
												className="w-full"
												onClick={() => handleAddIssue(column.key)}
											>
												<Plus className="mr-2 h-4 w-4" />
												Create Issue
											</Button>
										)}
								</div>
							)}
						</Droppable>
					))}
				</div>
			</DragDropContext>

			<IssueCreationDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				sprintId={currentSprint.id}
				status={selectedStatus}
				projectId={projectId}
				onIssueCreated={handleIssueCreated}
				orgId={orgId}
			/>
		</div>
	);
}
