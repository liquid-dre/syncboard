import { Suspense } from "react";
import { getUserIssues } from "@/actions/organizations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";

export default async function UserIssues({ userId }: any) {
	const issues = await getUserIssues(userId);

	if (issues.length === 0) return null;

	const assignedIssues = issues.filter(
		(issue: { assignee: { clerkUserId: any } }) =>
			issue.assignee.clerkUserId === userId
	);
	const reportedIssues = issues.filter(
		(issue: { reporter: { clerkUserId: any } }) =>
			issue.reporter.clerkUserId === userId
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
function groupIssuesByProject(issues: any[]) {
	return issues.reduce((acc: Record<string, any[]>, issue) => {
		const projectName = issue.project?.name || "Unknown Project";
		if (!acc[projectName]) acc[projectName] = [];
		acc[projectName].push(issue);
		return acc;
	}, {});
}

function IssueGrid({ issues }: { issues: any[] }) {
	const grouped = groupIssuesByProject(issues);

	return (
		<div className="space-y-10">
			{Object.entries(grouped).map(([projectName, projectIssues]) => (
				<div key={projectName}>
					<h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
						{projectName}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{projectIssues.map((issue: any) => (
							<IssueCard key={issue.id} issue={issue} showStatus />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
