"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IssueStatus } from "@/lib/generated/prisma";

// Types
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
	status: IssueStatus;
	order: number;
}

interface BoardFiltersProps {
	issues: Issue[];
	onFilterChange: (filteredIssues: Issue[]) => void;
}

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function BoardFilters({
	issues,
	onFilterChange,
}: BoardFiltersProps) {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
	const [selectedPriority, setSelectedPriority] = useState<string>("");

	const assignees: Assignee[] = issues
		.map((issue) => issue.assignee)
		.filter(
			(assignee, index, self) =>
				assignee && index === self.findIndex((t) => t.id === assignee.id)
		);

	useEffect(() => {
		const filteredIssues = issues.filter((issue) => {
			const matchesSearch = issue.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesAssignee =
				selectedAssignees.length === 0 ||
				selectedAssignees.includes(issue.assignee?.id);
			const matchesPriority =
				selectedPriority === "" || issue.priority === selectedPriority;

			return matchesSearch && matchesAssignee && matchesPriority;
		});

		onFilterChange(filteredIssues);
	}, [searchTerm, selectedAssignees, selectedPriority, issues, onFilterChange]);

	const toggleAssignee = (assigneeId: string) => {
		setSelectedAssignees((prev) =>
			prev.includes(assigneeId)
				? prev.filter((id) => id !== assigneeId)
				: [...prev, assigneeId]
		);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedAssignees([]);
		setSelectedPriority("");
	};

	const isFiltersApplied =
		searchTerm !== "" ||
		selectedAssignees.length > 0 ||
		selectedPriority !== "";

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-6 pr-2">
				{/* Search Input */}
				<Input
					className="w-full sm:w-72 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
					placeholder="Search issues..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				{/* Assignee Avatars */}
				<div className="flex flex-wrap gap-2 sm:gap-3">
					{assignees.map((assignee, i) => {
						const selected = selectedAssignees.includes(assignee.id);
						return (
							<div
								key={assignee.id}
								className={`rounded-full ring-2 transition-all duration-200 cursor-pointer ${
									selected
										? "ring-blue-500 shadow-md"
										: "ring-gray-300 hover:ring-blue-400"
								}`}
								style={{ zIndex: assignees.length - i }}
								onClick={() => toggleAssignee(assignee.id)}
							>
								<Avatar className="h-10 w-10">
									<AvatarImage src={assignee.imageUrl} />
									<AvatarFallback>{assignee.name?.[0]}</AvatarFallback>
								</Avatar>
							</div>
						);
					})}
				</div>

				{/* Priority Filter */}
				<Select value={selectedPriority} onValueChange={setSelectedPriority}>
					<SelectTrigger className="w-full sm:w-52 shadow-sm focus:ring-2 focus:ring-blue-500">
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						{priorities.map((priority) => (
							<SelectItem key={priority} value={priority}>
								{priority}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Clear Filters Button */}
				{isFiltersApplied && (
					<Button
						variant="outline"
						onClick={clearFilters}
						className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition"
					>
						<X className="h-4 w-4" /> Clear Filters
					</Button>
				)}
			</div>
		</div>
	);
}
