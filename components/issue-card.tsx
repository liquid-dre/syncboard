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
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: Priority;
  createdAt: string;
  assignee: {
    name: string;
    image?: string;
  };
}

interface IssueCardProps {
  issue: Issue;
  showStatus?: boolean;
  onDelete?: (issue: Issue) => void;
  onUpdate?: (issue: Issue) => void;
}

const priorityColor: Record<Priority, string> = {
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
  const router = useRouter();

  const onDeleteHandler = () => {
    router.refresh();
    onDelete(issue);
  };

  const onUpdateHandler = () => {
    router.refresh();
    onUpdate(issue);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className={`cursor-pointer border-l-4 ${priorityColor[issue.priority]} 
          hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
          bg-slate-800/40 backdrop-blur-sm`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white line-clamp-2">
            {issue.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap items-center gap-2 text-xs pb-2">
          {showStatus && (
            <Badge variant="secondary" className="text-[10px]">
              {issue.status}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-[10px] border ${priorityColor[issue.priority]} text-white`}
          >
            {issue.priority}
          </Badge>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-[11px] text-gray-400">
          <UserAvatar user={issue.assignee} />
          <div>Created {created}</div>
        </CardFooter>
      </Card>

      <IssueDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        issue={issue}
        onDelete={onDeleteHandler}
        onUpdate={onUpdateHandler}
        borderCol={priorityColor[issue.priority]}
      />
    </>
  );
}