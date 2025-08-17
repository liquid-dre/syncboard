"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import statuses from "@/data/status.json";
import { deleteIssue, updateIssue } from "@/actions/issues";
import { IssueStatus, IssuePriority } from "@/lib/generated/prisma";
import type { IssueWithRelations } from "@/lib/types/issues";
import IssueEditDrawer from "./issue-edit-drawer";

type IssueDetailsDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	issue: IssueWithRelations;
	onDelete?: () => void;
	onUpdate?: (updated: IssueWithRelations) => void;
};

const priorityOptions: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function IssueDetailsDialog({
	isOpen,
	onClose,
	issue,
	onDelete = () => {},
	onUpdate = () => {},
}: IssueDetailsDialogProps) {
	const [status, setStatus] = useState<IssueStatus>(issue.status);
	const [priority, setPriority] = useState<IssuePriority>(issue.priority);
	const { user } = useUser();
	const { membership, organization } = useOrganization();
	const router = useRouter();
	const pathname = usePathname();

	const [isEditOpen, setIsEditOpen] = useState(false);

	const {
		loading: deleteLoading,
		error: deleteError,
		fn: deleteIssueFn,
		data: deleted,
	} = useFetch(deleteIssue);

	const {
		loading: updateLoading,
		error: updateError,
		fn: updateIssueFn,
		data: updated,
	} = useFetch(updateIssue);

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this issue?")) {
			deleteIssueFn(issue.id);
		}
	};

	const handleStatusChange = async (newStatus: IssueStatus) => {
		setStatus(newStatus);
		updateIssueFn(issue.id, { status: newStatus, priority });
	};

	const handlePriorityChange = async (newPriority: IssuePriority) => {
		setPriority(newPriority);
		updateIssueFn(issue.id, { status, priority: newPriority });
	};

	useEffect(() => {
		if (deleted) {
			onClose();
			onDelete();
		}
		if (updated) {
			onUpdate(updated as IssueWithRelations);
		}
	}, [deleted, updated, onClose, onDelete, onUpdate]);

	useEffect(() => {
		setStatus(issue.status);
		setPriority(issue.priority);
	}, [issue]);

	const canChange =
		user?.id === issue.reporter?.clerkUserId ||
		membership?.role === "org:admin";

	const handleGoToProject = () => {
		router.push(`/project/${issue.projectId}?sprint=${issue.sprintId ?? ""}`);
	};

	const isProjectPage = !pathname.startsWith("/project/");

	// Priority colors
	const getPriorityClass = (level: IssuePriority) => {
		switch (level) {
			case "URGENT":
				return "border-red-400 text-red-600 bg-red-50";
			case "HIGH":
				return "border-orange-400 text-orange-600 bg-orange-50";
			case "MEDIUM":
				return "border-yellow-400 text-yellow-600 bg-yellow-50";
			case "LOW":
			default:
				return "border-gray-300 text-gray-600 bg-gray-50";
		}
	};

	// Status colors
	const getStatusClass = (currentStatus: IssueStatus) => {
		switch (currentStatus) {
			case "DONE":
				return "border-green-400 text-green-600 bg-green-50";
			case "IN_PROGRESS":
				return "border-blue-400 text-blue-600 bg-blue-50";
			case "IN_REVIEW":
				return "border-purple-400 text-purple-600 bg-purple-50";
			case "TODO":
			default:
				return "border-gray-300 text-gray-600 bg-gray-50";
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-2xl rounded-xl p-6 shadow-lg transition-all duration-300">
					<DialogHeader className="pb-3 border-b border-muted/20">
						<div className="flex justify-between items-center">
							<DialogTitle className="text-2xl font-semibold">
								{issue.title}
							</DialogTitle>
							{isProjectPage && (
								<Button
									variant="ghost"
									size="icon"
									onClick={handleGoToProject}
									title="Go to Project"
									className="hover:bg-muted rounded-full transition"
								>
									<ExternalLink className="h-5 w-5" />
								</Button>
							)}
						</div>
					</DialogHeader>

					{(updateLoading || deleteLoading) && (
						<div className="my-2">
							<BarLoader width="100%" color="#36d7b7" />
						</div>
					)}

					<div className="space-y-6 mt-4">
						{/* Status & Priority */}
						<div className="flex items-center gap-4">
							<Select
								value={status}
								onValueChange={(v) => handleStatusChange(v as IssueStatus)}
							>
								<SelectTrigger
									className={`min-w-[140px] border rounded-lg shadow-sm focus:ring-2 focus:ring-primary transition ${getStatusClass(
										status
									)}`}
								>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{(statuses as { key: IssueStatus; name: string }[]).map(
										(option) => (
											<SelectItem key={option.key} value={option.key}>
												{option.name}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>

							<Select
								value={priority}
								onValueChange={(v) => handlePriorityChange(v as IssuePriority)}
								disabled={!canChange}
							>
								<SelectTrigger
									className={`min-w-[140px] border rounded-lg shadow-sm focus:ring-2 focus:ring-primary transition ${getPriorityClass(
										priority
									)}`}
								>
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									{priorityOptions.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Description */}
						<div>
							<h4 className="font-semibold mb-2">Description</h4>
							<div className="bg-muted/20 rounded-md p-3 text-sm shadow-inner">
								<MDEditor.Markdown
									className="prose max-w-none"
									source={issue.description || "--"}
								/>
							</div>
						</div>

						{/* Assignee & Reporter */}
						<div className="flex justify-between gap-8">
							<div className="flex flex-col gap-2">
								<h4 className="font-semibold text-sm">Assignee</h4>
								<UserAvatar user={issue.assignee ?? null} />
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="font-semibold text-sm">Reporter</h4>
								<UserAvatar user={issue.reporter} />
							</div>
						</div>

						{/* Delete Button & Edit Buttons */}
						{canChange && (
							<>
								<Button
									onClick={() => setIsEditOpen(true)}
									className="w-full mt-2 transition hover:opacity-90"
								>
									Edit Issue
								</Button>
								<Button
									onClick={handleDelete}
									disabled={deleteLoading}
									variant="destructive"
									className="w-full mt-2 transition hover:opacity-90"
								>
									{deleteLoading ? "Deleting..." : "Delete Issue"}
								</Button>
							</>
						)}

						{/* Error Messages */}
						{(deleteError || updateError) && (
							<p className="text-red-600 text-sm font-medium">
								{deleteError?.message || updateError?.message}
							</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
			<IssueEditDrawer
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				issue={issue}
				orgId={organization?.id ?? ""}
				onUpdated={(updatedIssue) => {
					setStatus(updatedIssue.status);
					setPriority(updatedIssue.priority);
					onUpdate(updatedIssue);
					setIsEditOpen(false);
				}}
			/>
		</>
	);
}
