"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "@/node_modules/date-fns/formatDistanceToNow";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";
import { IssuePriority } from "@/lib/generated/prisma";
import type { IssueWithRelations } from "@/lib/types/issues";


interface IssueCardProps {
	issue: IssueWithRelations;
	showStatus?: boolean;
	onDelete?: (issue: IssueWithRelations) => void;
	onUpdate?: (issue: IssueWithRelations) => void;
}

const priorityColor: Record<IssuePriority, string> = {
	LOW: "border-green-500",
	MEDIUM: "border-yellow-400",
	HIGH: "border-orange-500",
	URGENT: "border-red-500",
};

export default function IssueCard({
	issue,
	showStatus = false,
	onDelete = () => {},
	onUpdate = () => {},
}: IssueCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentIssue, setCurrentIssue] = useState<IssueWithRelations>(issue);
	const router = useRouter();

	const onDeleteHandler = () => {
		router.refresh();
		onDelete(currentIssue);
	};

	const onUpdateHandler = (updatedIssue: IssueWithRelations) => {
		setCurrentIssue(updatedIssue);
		router.refresh();
		onUpdate(updatedIssue);
	};

	const created = formatDistanceToNow(new Date(currentIssue.createdAt), {
		addSuffix: true,
	});

	return (
		<>
			<Card
				className={`cursor-pointer border-l-4 ${
					priorityColor[currentIssue.priority]
				} 
        hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
        bg-slate-800/40 backdrop-blur-sm`}
				onClick={() => setIsDialogOpen(true)}
			>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold text-white line-clamp-2">
						{currentIssue.title}
					</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-wrap items-center gap-2 text-xs pb-2">
					{showStatus && (
						<Badge variant="secondary" className="text-[10px]">
							{currentIssue.status}
						</Badge>
					)}
					<Badge
						variant="outline"
						className={`text-[10px] border ${
							priorityColor[currentIssue.priority]
						} text-white`}
					>
						{currentIssue.priority}
					</Badge>
				</CardContent>

				<CardFooter className="flex items-center justify-between text-[11px] text-gray-400">
					<UserAvatar user={currentIssue.assignee} />
					<div>Created {created}</div>
				</CardFooter>
			</Card>

			<IssueDetailsDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				issue={currentIssue}
				onDelete={onDeleteHandler}
				onUpdate={onUpdateHandler}
			/>
		</>
	);
}
