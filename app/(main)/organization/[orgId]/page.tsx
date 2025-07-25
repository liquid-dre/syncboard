import React from "react";

// Define the shape of the 'params' prop
interface OrganisationPageParams {
  orgId: string;
}

// Define the shape of the component's props, including 'params'
interface OrganisationProps {
  params: OrganisationPageParams;
}

const Organisation = async ({ params }: OrganisationProps) => {
  // Explicitly await params before destructuring
  const resolvedParams = await params; // This is the key change
  const { orgId } = resolvedParams;

  return (
    <div>
      <h1>Organization ID: {orgId}</h1>
    </div>
  );
};

export default Organisation;