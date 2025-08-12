"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react"; // Added Info icon
import { useOrganization } from "@clerk/nextjs";
import { deleteProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

// Import Shadcn Dialog components (standard Dialog)
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose, // Import DialogClose for explicit closing of dialog
} from "@/components/ui/dialog";

interface DeleteProjectProps {
	projectId: string;
}

export default function DeleteProject({ projectId }: DeleteProjectProps) {
	const { membership } = useOrganization();
	const router = useRouter();

	// State to control dialog visibility
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const {
		loading: isDeleting,
		error,
		fn: deleteProjectFn,
		data: deleted,
	} = useFetch(deleteProject);

	const isAdmin = membership?.role === "org:admin";

	// Function to handle the actual deletion after confirmation
	const confirmDelete = async () => {
		// Dialog will be closed by DialogClose button, or automatically on success via useEffect
		await deleteProjectFn(projectId);
	};

	// Effect to handle post-deletion actions and error toasts
	useEffect(() => {
		if (deleted) {
			toast.success("Project deleted successfully!");
			setIsDialogOpen(false); // Close dialog on successful deletion
			router.refresh(); // Re-fetch data for the current route
		}
		if (error) {
			toast.error(
				`Failed to delete project: ${error.message || "Unknown error"}`
			);
			setIsDialogOpen(false); // Close dialog on error as well
		}
	}, [deleted, error, router]);

	// Only render the button if the user is an admin
	if (!isAdmin) {
		return null;
	}

	return (
		<div className=" relative group flex-shrink-0">
			{/* Use Dialog instead of AlertDialog */}
			<div className=" relative group flex-shrink-0">
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					{/* The button that triggers the dialog - remains mostly the same, it's already well-styled */}
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className={`
              text-gray-500 hover:text-red-500 transition-colors duration-200
              ${isDeleting ? "opacity-70 cursor-not-allowed" : ""}
              focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-800
            `}
							disabled={isDeleting}
							title="Delete Project"
						>
							{isDeleting ? (
								<Loader2 className="h-4 w-4 animate-spin text-red-400" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</DialogTrigger>

					{/* The actual dialog content - significantly improved */}
					<DialogContent
						className="
            bg-gray-800 border  text-gray-100 rounded-xl shadow-2xl p-8
            sm:max-w-md w-[90%] md:w-auto transform transition-all duration-300 ease-out scale-100 opacity-100
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
          "
					>
						{/* Optional: Subtle background pattern or radial gradient for depth */}
						<div className="absolute inset-0 bg-dot-pattern opacity-5 mix-blend-overlay"></div>{" "}
						{/* Requires .bg-dot-pattern in global CSS */}
						<div className="absolute inset-0 z-0 bg-gradient-radial from-transparent via-gray-900/10 to-transparent"></div>
						<DialogHeader className="relative z-10">
							<DialogTitle className="text-3xl font-extrabold text-red-500 flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
								<AlertTriangle className="h-8 w-8 text-yellow-400 stroke-[1.5px]" />{" "}
								{/* Larger, bolder icon */}
								Confirm Deletion
							</DialogTitle>
							<DialogDescription className="text-gray-300 text-base leading-relaxed">
								<span className="font-semibold text-white">Warning:</span> You
								are about to{" "}
								<span className="text-red-500 font-bold">
									permanently delete
								</span>{" "}
								this project.
								<br className="my-1" />
								This action{" "}
								<span className="text-red-500 font-bold">cannot be undone</span>
								. All associated data, including tasks, members, and files, will
								be irreversibly lost.
								<br className="my-1" />
								Are you absolutely sure you want to proceed?
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="relative z-10 mt-8 flex flex-col sm:flex-row-reverse sm:space-x-4 sm:space-y-0 space-y-4">
							{/* Action button for confirmation */}
							<Button
								onClick={confirmDelete}
								className="
                w-full sm:w-auto px-6 py-3
                bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg
                transition-all duration-300 ease-in-out transform hover:scale-105
                focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800
              "
								disabled={isDeleting}
							>
								{isDeleting ? (
									<span className="flex items-center gap-2">
										Deleting <Loader2 className="h-4 w-4 animate-spin" />
									</span>
								) : (
									"Yes, Delete Project Permanently"
								)}
							</Button>
							{/* Cancel button using DialogClose */}
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									className="
                  w-full sm:w-auto px-6 py-3
                  bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-semibold rounded-lg shadow-md
                  transition-all duration-300 ease-in-out transform hover:scale-105
                  border-gray-600 hover:border-gray-500
                  focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800
                "
									disabled={isDeleting}
								>
									Cancel
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
