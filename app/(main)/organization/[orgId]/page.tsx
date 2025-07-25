import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "@/components/org-switcher";
import React from "react";
import { notFound, redirect } from "next/navigation"; // Import for error handling
import ProjectList from "./_components/project-list";

// Define the shape of the 'params' prop
// Typically, Next.js will infer this for page components,
// but explicit typing is good practice.
interface OrganisationPageParams {
	orgId: string;
}

// Define the shape of the component's props, including 'params'
// In Next.js App Router page components, the props are usually just { params, searchParams }
interface OrganisationProps {
	params: OrganisationPageParams;
}

const Organisation = async ({ params }: OrganisationProps) => {
	const resolvedParams = await params; // This is the key change

	const { orgId } = resolvedParams;

	// Fetch organization data
	const organization = await getOrganization(orgId);

	// --- Robust Error Handling ---
	if (!organization) {
		notFound();

	}

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{" "}
			{/* Added vertical padding */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				{" "}
				{/* Adjusted spacing and alignment */}
				<h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 pb-2 leading-tight">
					{organization.name}&rsquo;s Projects
				</h1>
				{/* OrgSwitcher is a client component, correctly placed here */}
				<OrgSwitcher />
			</div>
			<section className="mb-12">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					Project List
				</h2>
				{/* Render your ProjectList component here */}
				{/* <ProjectList orgId={organization.id} /> */}
				<div className="mb-4">
					<ProjectList orgId={organization.id} />
				</div>
			</section>
			<section className="mt-12">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					User Issues
				</h2>
				{/* Render your UserIssues component here */}
				{/* <UserIssues userId={userId} /> */}
				<div className="bg-gray-100 p-6 rounded-lg shadow-md min-h-[150px] flex items-center justify-center text-gray-500">
					<p>User Issues will be displayed here.</p>
				</div>
			</section>
		</div>
	);
};

export default Organisation;
