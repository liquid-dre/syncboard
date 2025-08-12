import { Suspense } from "react";
import { getUserIssues } from "@/actions/organizations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";

type IssueWithRelations = {
	id: string;
	title: string;
	status: string;
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	createdAt: string;
	description: string | null;
	project: { name: string };
	assignee: { clerkUserId: string; name: string; image?: string } | null;
	reporter: { clerkUserId: string; name: string; imageUrl?: string };
	projectId: string;
	sprintId?: string | null;
};

export default async function UserIssues({ userId }: { userId: string }) {
	const issues: IssueWithRelations[] = await getUserIssues(userId);

	if (issues.length === 0) return null;

	// const assignedIssues = issues.filter(
	// 	(issue: { assignee: { clerkUserId: any } }) =>
	// 		issue.assignee.clerkUserId === userId
	// );
	// const reportedIssues = issues.filter(
	// 	(issue: { reporter: { clerkUserId: any } }) =>
	// 		issue.reporter.clerkUserId === userId
	// );
	const assignedIssues = issues.filter(
		(issue) => issue.assignee?.clerkUserId === userId
	);
	const reportedIssues = issues.filter(
		(issue) => issue.reporter.clerkUserId === userId
	);

	return (
		<>
			<h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

			<Tabs defaultValue="assigned" className="w-full">
				<TabsList>
					<TabsTrigger value="assigned">Assigned to You</TabsTrigger>
					<TabsTrigger value="reported">Reported by You</TabsTrigger>
				</TabsList>

				<TabsContent value="assigned">
					<Suspense fallback={<div>Loading...</div>}>
						<IssueGrid issues={assignedIssues} />
					</Suspense>
				</TabsContent>

				<TabsContent value="reported">
					<Suspense fallback={<div>Loading...</div>}>
						<IssueGrid issues={reportedIssues} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</>
	);
}

// Helper: group issues by project
// function groupIssuesByProject(issues: any[]) {
// 	return issues.reduce((acc: Record<string, any[]>, issue) => {
// 		const projectName = issue.project?.name || "Unknown Project";
// 		if (!acc[projectName]) acc[projectName] = [];
// 		acc[projectName].push(issue);
// 		return acc;
// 	}, {});
// }
function groupIssuesByProject(issues: IssueWithRelations[]) {
	return issues.reduce((acc: Record<string, IssueWithRelations[]>, issue) => {
		const projectName = issue.project?.name || "Unknown Project";
		if (!acc[projectName]) acc[projectName] = [];
		acc[projectName].push(issue);
		return acc;
	}, {});
}

// function IssueGrid({ issues }: { issues: any[] }) {
// 	const grouped = groupIssuesByProject(issues);
function IssueGrid({ issues }: { issues: IssueWithRelations[] }) {
	const grouped = groupIssuesByProject(issues);
	type CardIssue = {
		id: string;
		title: string;
		status: string;
		priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
		createdAt: string;
		project: { name: string };
		assignee: { name: string; image?: string; clerkUserId: string };
		description: string | null;
		projectId: string;
		reporter: { name: string; imageUrl?: string; clerkUserId: string };
		sprintId?: string | null;
	};

	// return (
	// 	<div className="space-y-10">
	// 		{Object.entries(grouped).map(([projectName, projectIssues]) => (
	// 			<div key={projectName}>
	// 				<h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
	// 					{projectName}
	// 				</h2>
	// 				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	// 					{projectIssues.map((issue: any) => (
	// 						<IssueCard key={issue.id} issue={issue} showStatus />
	// 					))}
	// 				</div>
	// 			</div>
	// 		))}
	// 	</div>
	// );
	return (
		<div className="space-y-10">
			{Object.entries(grouped).map(([projectName, projectIssues]) => (
				<div key={projectName}>
					<h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
						{projectName}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{projectIssues.map((issue) => {
							const cardIssue: CardIssue = {
								id: issue.id,
								title: issue.title,
								status: issue.status,
								priority: issue.priority,
								createdAt: issue.createdAt,
								project: issue.project,
								assignee: issue.assignee
									? {
											name: issue.assignee.name,
											image: issue.assignee.image,
											clerkUserId: issue.assignee.clerkUserId,
									  }
									: { name: "Unassigned", clerkUserId: "" },
								description: issue.description,
								projectId: issue.projectId,
								reporter: issue.reporter,
								sprintId: issue.sprintId,
							};
							return <IssueCard key={issue.id} issue={cardIssue} showStatus />;
						})}
					</div>
				</div>
			))}
		</div>
	);
}
