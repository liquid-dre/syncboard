"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { BarLoader } from "react-spinners"; // Assuming this is installed

const UserLoading = () => {
	const { isLoaded: isOrganizationLoaded } = useOrganization();
	const { isLoaded: isUserLoaded } = useUser();

	// Combine the loading states for clarity
	const isLoading = !isOrganizationLoaded || !isUserLoaded;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen w-full ">
				<div className="text-center">
					{/* A more prominent and visually centered loader */}
					<BarLoader
						className="mx-auto mb-6"
						width={250}
						color="#36d7b7"
						aria-label="Loading content"
					/>
					<p className="text-white text-lg mt-4 animate-pulse">
						Loading your workspace...
					</p>
					{/* Optional: Add a small, subtle message */}
					<p className="text-gray-400 text-sm mt-2">
						Just a moment while we get things ready.
					</p>
				</div>
			</div>
		);
	}

	// If both are loaded, render nothing (or a placeholder if needed by parent)
	// Returning null or an empty fragment are both valid for "no render"
	return null;
};

export default UserLoading;
