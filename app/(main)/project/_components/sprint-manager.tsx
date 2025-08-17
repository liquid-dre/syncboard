"use client";

import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isAfter, isBefore, format } from "date-fns";
import { formatDistanceToNow } from "@/node_modules/date-fns/formatDistanceToNow";
import useFetch from "@/hooks/use-fetch";
// import { useSearchParams } from "next/navigation";
// import { updateSprintStatus } from "@/actions/sprints";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSprintStatus, deleteSprint } from "@/actions/sprints";
import gsap from "gsap";
import { CircleOff, Pause, Play, RotateCcw, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Sprint = {
	id: string;
	name: string;
	status: string;
	startDate: string | Date;
	endDate: string | Date;
};

interface SprintManagerProps {
	sprint: Sprint;
	setSprint: Dispatch<SetStateAction<Sprint>>;
	sprints: Sprint[];
	setSprints: Dispatch<SetStateAction<Sprint[]>>;
}

export default function SprintManager({
	sprint,
	setSprint,
	sprints,
	setSprints,
}: SprintManagerProps) {
	const [status, setStatus] = useState(sprint.status);
	const searchParams = useSearchParams();
	const sprintContainerRef = useRef<HTMLDivElement>(null);

	// const {
	// 	fn: updateStatus,
	// 	loading,
	// 	data: updatedStatus,
	// } = useFetch(updateSprintStatus);
	const {
		fn: updateStatus,
		loading: statusLoading,
		data: updatedStatus,
	} = useFetch(updateSprintStatus);

	const { fn: removeSprint, loading: deleteLoading } = useFetch(deleteSprint);

	const loading = statusLoading || deleteLoading;
	const router = useRouter();

	const startDate = new Date(sprint.startDate);
	const endDate = new Date(sprint.endDate);
	const now = new Date();

	const canStart =
		isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
	const canEnd = status === "ACTIVE";
	const canHold = status === "ACTIVE";
	const canResume = status === "ON_HOLD";
	const canEndFromHold = status === "ON_HOLD";

	const handleStatusChange = (newStatus: string) => {
		updateStatus(sprint.id, newStatus);
	};

	const handleDelete = async () => {
		await removeSprint(sprint.id);
		const updatedSprints = sprints.filter((s) => s.id !== sprint.id);
		setSprints(updatedSprints);
		if (updatedSprints.length > 0) {
			setSprint(updatedSprints[0]);
		}
		router.refresh();
	};

	// useEffect(() => {
	// 	if (updatedStatus?.success) {
	// 		setStatus(updatedStatus.sprint.status);
	// 		setSprint({ ...sprint, status: updatedStatus.sprint.status });
	// 	}
	// }, [updatedStatus, sprint, setSprint]);
	useEffect(() => {
		if (updatedStatus?.success) {
			setStatus(updatedStatus.sprint.status);
			setSprint((prev) => ({ ...prev, status: updatedStatus.sprint.status }));
		}
	}, [updatedStatus, setSprint]);

	const getStatusText = () => {
		if (status === "COMPLETED") {
			return {
				text: "Sprint Ended",
				color: "#C40B0B",
				bg: "bg-red-100",
				textColor: "text-red-800",
				border: "border-[##C40B0B]",
			};
		}

		if (status === "ON_HOLD") {
			return {
				text: "On Hold",
				color: "#FACC15",
				bg: "bg-yellow-100",
				textColor: "text-yellow-800",
				border: "border-[#FACC15]",
			};
		}

		if (status === "ACTIVE") {
			if (isAfter(now, endDate)) {
				return {
					text: `Overdue by ${formatDistanceToNow(endDate)}`,
					color: "#C40B0B",
					bg: "bg-red-100",
					textColor: "text-red-800",
					border: "border-[#C40B0B]",
				};
			}
			return {
				text: "Healthy",
				color: "#57DA2F",
				bg: "bg-green-100",
				textColor: "text-green-800",
				border: "border-[#57DA2F]",
			};
		}

		if (status === "PLANNED" && isBefore(now, startDate)) {
			return {
				text: `Starts in ${formatDistanceToNow(startDate)}`,
				color: "#9CA3AF",
				bg: "bg-gray-100",
				textColor: "text-gray-800",
				border: "border-gray-300",
			};
		}

		return null;
	};

	// useEffect(() => {
	// 	const sprintId = searchParams.get("sprint");
	// 	if (!sprintId || String(sprint.id) === sprintId) return;

	// 	const selectedSprint = sprints.find((s) => String(s.id) === sprintId);
	// 	if (selectedSprint) {
	// 		animateSprintChange();
	// 		setSprint(selectedSprint);
	// 		setStatus(selectedSprint.status);
	// 	}
	// }, [searchParams, sprints, sprint.id, setSprint]);

	const sprintId = searchParams.get("sprint");
	useEffect(() => {
		if (!sprintId || String(sprint.id) === sprintId) return;
		const selectedSprint = sprints.find((s) => String(s.id) === sprintId);
		if (selectedSprint) {
			animateSprintChange();
			setSprint(selectedSprint);
			setStatus(selectedSprint.status);
		}
	}, [sprintId, sprints, sprint.id, setSprint]);

	const handleSprintChange = (value: string) => {
		if (String(sprint.id) === value) return;
		const selectedSprint = sprints.find((s) => String(s.id) === value);
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

	const statusInfo = getStatusText();

	return (
		<div
			ref={sprintContainerRef}
			className="bg-[oklch(0.205_0_0)] flex flex-col gap-4 p-5 border rounded-xl shadow-md hover:shadow-lg transition-shadow"
		>
			<div className="relative">
				{/* Main Content */}
				<div
					className={`bg-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-opacity duration-300 ${
						loading ? "opacity-50 pointer-events-none" : ""
					}`}
				>
					<Select
						value={String(sprint.id ?? "")}
						onValueChange={handleSprintChange}
					>
						<SelectTrigger className="bg-background border border-border hover:border-primary focus:ring-2 focus:ring-primary transition text-sm min-w-[260px] rounded-lg shadow-sm">
							<SelectValue placeholder="Select Sprint" />
						</SelectTrigger>
						<SelectContent>
							{sprints.map((s) => (
								<SelectItem key={s.id} value={String(s.id)}>
									{s.name} ({format(s.startDate, "MMM d, yyyy")} –{" "}
									{format(s.endDate, "MMM d, yyyy")})
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="flex gap-2 flex-wrap w-full sm:w-auto">
						{canStart && (
							<Button
								onClick={() => handleStatusChange("ACTIVE")}
								disabled={loading}
								className="bg-gradient-to-r from-[#43ce19] to-[#3cae16] text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition"
							>
								<Play className="w-4 h-4 mr-2" />
								Start Sprint
							</Button>
						)}

						{canResume && (
							<Button
								onClick={() => handleStatusChange("ACTIVE")}
								disabled={loading}
								className="bg-gradient-to-r from-[#43ce19] to-[#3cae16] text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition"
							>
								<RotateCcw className="w-4 h-4 mr-2" />
								Resume Sprint
							</Button>
						)}

						{canHold && (
							<Button
								onClick={() => handleStatusChange("ON_HOLD")}
								disabled={loading}
								className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition"
							>
								<Pause className="w-4 h-4 mr-2" />
								Put on Hold
							</Button>
						)}

						{/* {(canEnd || canEndFromHold) && (
							<Button
								onClick={() => handleStatusChange("COMPLETED")}
								disabled={loading}
								className="bg-gradient-to-r from-[#C40B0B] to-[#9b0a0a] text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition ml-auto"
							>
								<CircleOff className="w-4 h-4 mr-2" />
								End Sprint
							</Button>
						)} */}
						{(canEnd || canEndFromHold) && (
							<Button
								onClick={() => handleStatusChange("COMPLETED")}
								disabled={loading}
								className="bg-gradient-to-r from-[#C40B0B] to-[#9b0a0a] text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition"
							>
								<CircleOff className="w-4 h-4 mr-2" />
								End Sprint
							</Button>
						)}
						<Button
							onClick={handleDelete}
							disabled={loading}
							className="bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-md shadow hover:scale-[1.02] hover:shadow-lg transition ml-auto"
						>
							<Trash className="w-4 h-4 mr-2" />
							Delete Sprint
						</Button>
					</div>
				</div>

				{/* Loading Overlay */}
				{loading && (
					<div className="mt-4 w-full p-4 rounded-xl border border-muted bg-muted/20 shadow-sm space-y-3">
						<Skeleton className="h-4 w-2/5 rounded-md" />
						<Skeleton className="h-3 w-3/5 rounded-md" />
						<Skeleton className="h-8 w-24 mt-2 rounded-md" />
					</div>
				)}
			</div>

			{statusInfo && (
				<div className="mt-2">
					<Badge
						variant="outline"
						className={`
							px-3 py-1 rounded-full text-sm font-medium shadow-sm border
							${statusInfo.bg} ${statusInfo.textColor}
							`}
						style={{ borderColor: statusInfo.color }}
					>
						{statusInfo.text}
					</Badge>
				</div>
			)}
		</div>
	);
}
