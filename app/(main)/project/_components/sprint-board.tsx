"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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

function reorder(list: any, startIndex: any, endIndex: any) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
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

	const [filteredIssues, setFilteredIssues] = useState(issues);

	const handleFilterChange = (newFilteredIssues: any) => {
		setFilteredIssues(newFilteredIssues);
	};

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

	const onDragEnd = async (result: any) => {
		if (currentSprint.status === "PLANNED") {
			toast.warning("Start the sprint to update board");
			return;
		}
		if (currentSprint.status === "COMPLETED") {
			toast.warning("Cannot update board after sprint end");
			return;
		}
		const { destination, source } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const newOrderedData = [...issues];

		// source and destination list
		const sourceList = newOrderedData.filter(
			(list) => list.status === source.droppableId
		);

		const destinationList = newOrderedData.filter(
			(list) => list.status === destination.droppableId
		);

		if (source.droppableId === destination.droppableId) {
			const reorderedCards = reorder(
				sourceList,
				source.index,
				destination.index
			);

			reorderedCards.forEach((card: any, i) => {
				card.order = i;
			});
		} else {
			// remove card from the source list
			const [movedCard] = sourceList.splice(source.index, 1);

			// assign the new list id to the moved card
			movedCard.status = destination.droppableId;

			// add new card to the destination list
			destinationList.splice(destination.index, 0, movedCard);

			sourceList.forEach((card, i) => {
				card.order = i;
			});

			// update the order for each card in destination list
			destinationList.forEach((card, i) => {
				card.order = i;
			});
		}

		const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
		// setIssues(newOrderedData, sortedIssues);
		setIssues(sortedIssues);

		updateIssueOrderFn(sortedIssues);
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

			<DragDropContext onDragEnd={onDragEnd}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 transition-all">
					{statuses.map((column) => (
						<Droppable key={column.key} droppableId={column.key}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="flex flex-col bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-md max-h-[80vh] overflow-y-auto hover:shadow-lg transition-all group"
								>
									{/* Column Header */}
									<div className="flex justify-center items-center mb-4 border-b border-slate-600 pb-2">
										<h3 className="text-lg font-semibold text-white tracking-wide uppercase">
											{column.name}
										</h3>
									</div>

									{/* Drop Zone Contents */}
									<div className="space-y-2">
										{provided.placeholder}
										{column.key === "TODO" &&
											currentSprint.status !== "COMPLETED" && (
												<Button
													className="w-full mt-2 text-sm font-medium rounded-lg border border-white bg-slate-800 text-slate-200 
             hover:bg-slate-200 hover:text-slate-800 hover:shadow-xl hover:scale-[1.02] 
             transition-all duration-300 ease-in-out flex items-center justify-center"
													onClick={() => handleAddIssue(column.key)}
												>
													<Plus className="mr-2 h-4 w-4" />
													Create Issue
												</Button>
											)}
									</div>
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
