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
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

// Define priority levels as a TypeScript union type
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
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
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
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle className="text-base font-semibold">{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap items-center gap-2 -mt-3">
          {showStatus && (
            <Badge variant="secondary" className="text-xs">
              {issue.status}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {issue.priority}
          </Badge>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />
          <div className="text-xs text-muted-foreground">
            Created {created}
          </div>
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