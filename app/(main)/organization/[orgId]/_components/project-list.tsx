"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import DeleteProject from "./delete-project";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import gsap from "gsap";
import React, { useEffect } from "react";

export default function ProjectList({ orgId }: any) {
	const [projects, setProjects] = React.useState<any[]>([]);

	useEffect(() => {
		(async () => {
			const res = await getProjects(orgId);
			setProjects(res || []);
		})();
	}, [orgId]);

	useEffect(() => {
		const cards = document.querySelectorAll(".project-card");

		cards.forEach((card) => {
			const bubbles = card.querySelectorAll(".bubble");

			card.addEventListener("mouseenter", () => {
				gsap.to(bubbles, {
					y: -20,
					repeat: -1,
					yoyo: true,
					opacity: 0.9,
					duration: 1.2 + Math.random(),
					ease: "sine.inOut",
					stagger: 0.1,
				});
			});

			card.addEventListener("mouseleave", () => {
				gsap.killTweensOf(bubbles);
				gsap.to(bubbles, { y: 0, opacity: 0.3, duration: 0.3 });
			});
		});
	}, [projects]);

	if (!projects || projects.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
				<p className="text-gray-400 text-lg">
					No projects found for this organization.
				</p>
				<Link href="/project/create">
					<Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#b81365] via-[#f55536] to-[#ffb347] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(184,19,101,0.7)] hover:scale-105 transition-transform duration-200">
						<PlusCircle size={18} />
						Create New Project
					</Button>
				</Link>
			</div>
		);
	}

	// Custom bubble colors matching your request
	const bubbleColors = [
		"bg-[#b81365]",
		"bg-[#f55536]",
		"bg-[#ffb347]",
		"bg-[#ff5fa2]",
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
			{projects.map((project: any) => (
				<Card
					key={project.id}
					className="project-card relative border border-border/50 rounded-xl shadow-md
                     hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(184,19,101,0.35)]
                     hover:border-[#b81365]/70 transition-all duration-300 overflow-hidden"
				>
					{/* Floating colorful bubbles */}
					{Array.from({ length: 8 }).map((_, i) => {
						const randomColor =
							bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
						return (
							<span
								key={i}
								className={`bubble absolute w-2 h-2 rounded-full opacity-30 ${randomColor}`}
								style={{
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
								}}
							/>
						);
					})}

					<CardHeader>
						<CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
							<span className="truncate group-hover:text-[#b81365] transition-colors">
								{project.name}
							</span>
							<DeleteProject projectId={project.id} />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col justify-between h-full">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3">
							{project.description || "No description provided."}
						</p>
						<Link
							href={`/project/${project.id}`}
							className="self-start text-sm font-medium text-[#b81365] hover:text-[#f55536] hover:underline underline-offset-4 transition-colors"
						>
							View Project →
						</Link>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
