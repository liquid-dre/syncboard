"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSprintStatus } from "@/actions/sprints";
import gsap from "gsap";

export default function SprintManager({ sprint, setSprint, sprints }: any) {
	const [status, setStatus] = useState(sprint.status);
	const router = useRouter();
	const searchParams = useSearchParams();
	const sprintContainerRef = useRef<HTMLDivElement>(null);

	const {
		fn: updateStatus,
		loading,
		data: updatedStatus,
	} = useFetch(updateSprintStatus);

	const startDate = new Date(sprint.startDate);
	const endDate = new Date(sprint.endDate);
	const now = new Date();

	const canStart =
		isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
	const canEnd = status === "ACTIVE";

	const handleStatusChange = (newStatus: string) => {
		updateStatus(sprint.id, newStatus);
	};

	useEffect(() => {
		if (updatedStatus?.success) {
			setStatus(updatedStatus.sprint.status);
			setSprint({ ...sprint, status: updatedStatus.sprint.status });
		}
	}, [updatedStatus]);

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
		if (!sprintId || String(sprint.id) === sprintId) return;

		const selectedSprint = sprints.find((s: any) => String(s.id) === sprintId);
		if (selectedSprint) {
			animateSprintChange();
			setSprint(selectedSprint);
			setStatus(selectedSprint.status);
		}
	}, [searchParams, sprints, sprint.id, setSprint]);

	const handleSprintChange = (value: string) => {
		if (String(sprint.id) === value) return;
		const selectedSprint = sprints.find((s: any) => String(s.id) === value);
		if (selectedSprint) {
			animateSprintChange();
			setSprint(selectedSprint);
			setStatus(selectedSprint.status);
		}
	};

	const animateSprintChange = () => {
		if (sprintContainerRef.current) {
			gsap.fromTo(
				sprintContainerRef.current,
				{ opacity: 0, scale: 0.95 },
				{
					opacity: 1,
					scale: 1,
					duration: 0.5,
					ease: "power2.out",
				}
			);
		}
	};

	const statusText = getStatusText();

	return (
		<div
			ref={sprintContainerRef}
			className="flex flex-col gap-4 p-5 border rounded-xl bg-card shadow-md hover:shadow-lg transition-shadow"
		>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<Select
					value={String(sprint.id ?? "")}
					onValueChange={handleSprintChange}
				>
					<SelectTrigger className="bg-background border border-border hover:border-primary focus:ring-2 focus:ring-primary transition text-sm min-w-[260px] rounded-lg shadow-sm">
						<SelectValue placeholder="Select Sprint" />
					</SelectTrigger>
					<SelectContent>
						{sprints.map((s: any) => (
							<SelectItem key={s.id} value={String(s.id)}>
								{s.name} ({format(s.startDate, "MMM d, yyyy")} –{" "}
								{format(s.endDate, "MMM d, yyyy")})
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="flex gap-2">
					{canStart && (
						<Button
							onClick={() => handleStatusChange("ACTIVE")}
							disabled={loading}
							className="bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm"
						>
							Start Sprint
						</Button>
					)}
					{canEnd && (
						<Button
							onClick={() => handleStatusChange("COMPLETED")}
							disabled={loading}
							className="bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
						>
							End Sprint
						</Button>
					)}
				</div>
			</div>

			{loading && (
				<div className="mt-3 w-full space-y-2 animate-pulse">
					<div className="h-3 bg-muted rounded-md w-1/3" />
					<div className="h-3 bg-muted rounded-md w-1/2" />
				</div>
			)}

			{statusText && (
				<div className="mt-2">
					<Badge
						variant="outline"
						className={`px-3 py-1 rounded-full text-sm shadow-sm 
              ${
								status === "ACTIVE"
									? "bg-blue-100 text-blue-800 border-blue-200"
									: status === "COMPLETED"
									? "bg-green-100 text-green-800 border-green-200"
									: "bg-gray-100 text-gray-800 border-gray-200"
							}`}
					>
						{statusText}
					</Badge>
				</div>
			)}
		</div>
	);
}
