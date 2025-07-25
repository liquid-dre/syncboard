// components/ProjectList.jsx
import Link from "next/link";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import DeleteProject from "./delete-project";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function ProjectList({ orgId }: any) {
	const projects = await getProjects(orgId);

	if (!projects || projects.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl text-gray-300 min-h-[300px] shadow-xl text-center animate-fade-in">
				<PlusCircle className="h-16 w-16 text-blue-500 mb-6 animate-bounce-slow" />{" "}
				{/* Larger icon, subtle animation */}
				<h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
					No Projects Yet!
				</h2>
				<p className="text-base sm:text-lg text-gray-400 mb-8 max-w-md">
					It looks like your organization hasn't created any projects. Let's get
					started and build something great!
				</p>
				<Link href="/project/create" passHref>
					<Button
						size="lg" // Larger button
						className="
                        inline-flex items-center gap-2
                        px-8 py-3
                        bg-gradient-to-r from-blue-600 to-purple-600
                        hover:from-blue-700 hover:to-purple-700
                        text-white font-semibold rounded-full shadow-lg
                        transition-all duration-300 ease-in-out
                        hover:scale-105
                    "
					>
						<PlusCircle className="h-5 w-5" />
						Create Your First Project
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{" "}
			{/* More responsive columns */}
			{projects.map((project: any) => (
				<Card
					key={project.id}
					className="
            relative overflow-hidden
            bg-gray-800 border border-gray-700
            rounded-xl shadow-lg
            group
            hover:border-purple-500 hover:shadow-xl
            transition-all duration-300 ease-in-out
            transform hover:-translate-y-2
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-600/0 before:via-purple-600/0 before:to-pink-500/0
            before:transition-all before:duration-500 before:ease-out
            hover:before:from-blue-600/10 hover:before:via-purple-600/10 hover:before:to-pink-500/10
            hover:before:scale-110 hover:before:opacity-100
          "
				>
					{/* Subtle background gradient or pattern for visual interest */}
					<div className="absolute inset-0 bg-dot-pattern opacity-5 mix-blend-overlay"></div>

					<CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 p-6 pb-4">
						<CardTitle className="text-2xl font-bold text-gray-50 pr-4 truncate group-hover:text-blue-300 transition-colors duration-200">
							{project.name}
						</CardTitle>
						<DeleteProject projectId={project.id} />
					</CardHeader>

					<CardContent className="relative z-10 p-6 pt-0">
						<p className="text-sm text-gray-400 mb-4 line-clamp-3">
							{project.description ||
								"No description provided for this project."}
						</p>
					</CardContent>

					<CardFooter className="relative z-10 flex justify-end p-6 pt-0">
						<Link
							href={`/project/${project.id}`}
							className="
                inline-flex items-center px-4 py-2
                bg-blue-600 text-white font-semibold rounded-full
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-in-out
                hover:scale-105
                group-hover:bg-purple-600
              "
						>
							View Project
							<svg
								className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								></path>
							</svg>
						</Link>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
