import { Suspense } from "react";
import React from "react"; // Explicitly import React
import { BarLoader } from "react-spinners"; // Assuming react-spinners is installed

export default async function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen text-gray-100">
			{" "}
			{/* Added full-page background */}
			{/*
        The actual layout content (header, sidebar, etc.) can go here
        before the children are rendered.
      */}
			<main className="flex-grow">
				{" "}
				{/* Flex-grow to ensure content takes available space */}
				<Suspense fallback={<LoadingFallback />}>{children}</Suspense>
			</main>
		</div>
	);
}

// A dedicated component for the loading fallback to keep the main component clean
const LoadingFallback = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full text-white p-4">
			{/* Optional: Add a subtle background animation or pattern if desired */}
			{/* <div className="absolute inset-0 z-0 bg-dots opacity-10"></div> */}{" "}
			{/* Example: if you have a bg-dots utility */}
			<div className="relative z-10 text-center">
				<BarLoader
					width={200} // Set a fixed width for a better visual presence
					color="#36d7b7" // Your chosen color
					aria-label="Loading project content"
					className="mx-auto mb-6" // Center the loader
				/>
				<p className="text-xl sm:text-2xl font-medium animate-pulse mb-2">
					Loading your project workspace...
				</p>
				<p className="text-gray-400 text-sm">
					Getting everything ready for you.
				</p>
			</div>
		</div>
	);
};
