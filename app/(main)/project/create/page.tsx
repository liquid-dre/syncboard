"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actions/projects";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
	const router = useRouter();
	const { isLoaded: isOrgLoaded, membership } = useOrganization();
	const { isLoaded: isUserLoaded } = useUser();
	const [isAdmin, setIsAdmin] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
	});

	useEffect(() => {
		if (isOrgLoaded && isUserLoaded && membership) {
			setIsAdmin(membership.role === "org:admin");
		}
	}, [isOrgLoaded, isUserLoaded, membership]);

	const {
		loading,
		error,
		data: project,
		fn: createProjectFn,
	} = useFetch(createProject);

	const onSubmit = async (data: ProjectFormValues) => {
		if (!isAdmin) {
			alert("Only organization admins can create projects");
			return;
		}

		createProjectFn({ ...data, description: data.description || "" });
	};

	useEffect(() => {
		if (project) {
			toast.success("Project created successfully");
			router.push(`/project/${project.id}`);
		}
	}, [project, router]);

	useEffect(() => {
		if (project) {
			toast.success("Project created successfully");
			router.push(`/project/${project.id}`);
		}
	}, [project, router]); // ✅ fixed dependencies

	if (!isOrgLoaded || !isUserLoaded) {
		return null;
	}

	if (!isAdmin) {
		return (
			<div className="flex flex-col gap-2 items-center">
				<span className="text-2xl gradient-title">
					Oops! Only Admins can create projects.
				</span>

				<span className="text-sm text-muted-foreground">
					Use the organization switcher in the navbar to select a different
					organization.
				</span>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-gray-100 flex items-center justify-center p-4">
			<div className="max-w-xl w-full bg-gray-800 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-700">
				<h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
					Create New Project
				</h1>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col space-y-6"
				>
					{/* Project Name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Project Name
						</label>
						<Input
							id="name"
							{...register("name")}
							className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
							placeholder="e.g., SyncBoard Core Platform"
						/>
						{errors.name && (
							<p className="text-red-400 text-sm mt-2">{errors.name.message}</p>
						)}
					</div>

					{/* Project Key */}
					<div>
						<label
							htmlFor="key"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Project Key
						</label>
						<Input
							id="key"
							{...register("key")}
							className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
							placeholder="e.g., SCBP (4 characters)"
							maxLength={4}
							autoCapitalize="characters"
						/>
						{errors.key && (
							<p className="text-red-400 text-sm mt-2">{errors.key.message}</p>
						)}
					</div>

					{/* Project Description */}
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Project Description
						</label>
						<Textarea
							id="description"
							{...register("description")}
							className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-32 resize-y"
							placeholder="Provide a detailed description of your project's purpose and goals."
						/>
						{errors.description && (
							<p className="text-red-400 text-sm mt-2">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Loading Indicator */}
					{loading && (
						<div className="flex justify-center py-4">
							<BarLoader width={150} color="#36d7b7" />
						</div>
					)}

					{/* Submit Button */}
					<Button
						type="submit"
						size="lg"
						disabled={loading}
						className={`
              w-full py-3 mt-6
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-purple-700 hover:to-blue-700
              text-white font-semibold rounded-lg shadow-lg
              transition-all duration-300 ease-in-out
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}
            `}
					>
						{loading ? (
							<span className="flex items-center justify-center gap-2">
								Creating
								<svg
									className="animate-spin h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							</span>
						) : (
							"Create Project"
						)}
					</Button>

					{/* General Error Message */}
					{error && (
						<p className="text-red-400 text-center mt-4 text-sm">
							{error.message}
						</p>
					)}
				</form>
			</div>
		</div>
	);
}
