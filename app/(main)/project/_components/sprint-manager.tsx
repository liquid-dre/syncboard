"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";

import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";

import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSprintStatus } from "@/actions/sprints";

export default function SprintManager({
	sprint,
	setSprint,
	sprints,
	projectId,
}: any) {
	const [status, setStatus] = useState(sprint.status);
	const router = useRouter();
	const searchParams = useSearchParams();

	const {
		fn: updateStatus,
		loading,
		error,
		data: updatedStatus,
	} = useFetch(updateSprintStatus);

	const startDate = new Date(sprint.startDate);
	const endDate = new Date(sprint.endDate);
	const now = new Date();

	const canStart =
		isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
	const canEnd = status === "ACTIVE";

	const handleStatusChange = async (newStatus: string) => {
		updateStatus(sprint.id, newStatus);
	};

	useEffect(() => {
		if (updatedStatus && updatedStatus.success) {
			setStatus(updatedStatus.sprint.status);
			setSprint({
				...sprint,
				status: updatedStatus.sprint.status,
			});
		}
	}, [updatedStatus, loading]);

	const getStatusText = () => {
		if (status === "COMPLETED") return `Sprint Ended`;
		if (status === "ACTIVE" && isAfter(now, endDate))
			return `Overdue by ${formatDistanceToNow(endDate)}`;
		if (status === "PLANNED" && isBefore(now, startDate))
			return `Starts in ${formatDistanceToNow(startDate)}`;
		return null;
	};

	useEffect(() => {
		const sprintId = searchParams.get("sprint");
		if (sprintId && sprintId !== sprint.id) {
			const selectedSprint = sprints.find((s: any) => s.id === sprintId);
			if (selectedSprint) {
				setSprint(selectedSprint);
				setStatus(selectedSprint.status);
			}
		}
	}, [searchParams, sprints]);

	const handleSprintChange = (value: any) => {
		const selectedSprint = sprints.find((s: { id: any }) => s.id === value);
		setSprint(selectedSprint);
		setStatus(selectedSprint.status);
	};

	return (
		<div className="flex flex-col gap-4 p-4 border rounded-xl bg-muted/50 shadow-sm">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<Select value={sprint.id} onValueChange={handleSprintChange}>
					<SelectTrigger className="bg-background border border-border hover:border-primary focus:ring-2 focus:ring-primary transition text-sm min-w-[250px]">
						<SelectValue placeholder="Select Sprint" />
					</SelectTrigger>
					<SelectContent>
						{sprints.map((sprint: any) => (
							<SelectItem key={sprint.id} value={sprint.id}>
								{sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} -{" "}
								{format(sprint.endDate, "MMM d, yyyy")})
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="flex gap-2">
					{canStart && (
						<Button
							onClick={() => handleStatusChange("ACTIVE")}
							disabled={loading}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							Start Sprint
						</Button>
					)}
					{canEnd && (
						<Button
							onClick={() => handleStatusChange("COMPLETED")}
							disabled={loading}
							variant="destructive"
						>
							End Sprint
						</Button>
					)}
				</div>
			</div>

			{loading && (
				<div className="mt-3 w-full animate-pulse space-y-2">
					<div className="h-4 bg-muted rounded-md w-1/3" />
					<div className="h-4 bg-muted rounded-md w-1/2" />
				</div>
			)}

			{getStatusText() && (
				<div className="mt-2">
					<Badge variant="outline" className="bg-blue-100 text-blue-800">
						{getStatusText()}
					</Badge>
				</div>
			)}
		</div>
	);
}
