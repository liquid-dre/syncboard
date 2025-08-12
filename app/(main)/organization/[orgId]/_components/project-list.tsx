"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/organizations";
import DeleteProject from "./delete-project";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import gsap from "gsap";

type Project = {
	id: string;
	name: string;
	description?: string | null;
};

export default function ProjectList({ orgId }: { orgId: string }) {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		(async () => {
			const res = await getProjects(orgId);
			setProjects(res || []);
		})();
	}, [orgId]);

	// Animate bubbles on hover using GSAP
	useEffect(() => {
		const cards = document.querySelectorAll(".project-card");

		cards.forEach((card) => {
			const bubbles = card.querySelectorAll(".bubble");

			card.addEventListener("mouseenter", () => {
				gsap.to(bubbles, {
					y: -12,
					repeat: -1,
					yoyo: true,
					opacity: 0.85,
					duration: 1.1 + Math.random(),
					ease: "sine.inOut",
					stagger: 0.05,
				});
			});

			card.addEventListener("mouseleave", () => {
				gsap.killTweensOf(bubbles);
				gsap.to(bubbles, { y: 0, opacity: 0.2, duration: 0.3 });
			});
		});
	}, [projects]);

	const generateBubbles = useMemo(() => {
		const bubbleColors = [
			"bg-[#b81365]",
			"bg-[#f55536]",
			"bg-[#ffb347]",
			"bg-[#ff5fa2]",
		];

		return Array.from({ length: 8 }).map((_, i) => {
			const color =
				bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
			const top = `${(i * 12.5) % 100}%`;
			const left = `${(i * 21.3) % 100}%`;

			return (
				<span
					key={i}
					className={`bubble absolute w-2 h-2 rounded-full ${color} opacity-20`}
					style={{ top, left }}
				/>
			);
		});
	}, []); // ✅ Added missing dependency

	if (!projects || projects.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
				<p className="text-gray-400 text-lg">No projects found.</p>
				<Link href="/project/create">
					<Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#b81365] via-[#f55536] to-[#ffb347] text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform">
						<PlusCircle size={18} />
						Create New Project
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
			{projects.map((project) => (
				<Card
					key={project.id}
					className="project-card group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-slate-800/50 to-slate-900/40 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(184,19,101,0.35)] duration-300"
				>
					{/* Floating bubbles (animated on hover) */}
					{generateBubbles}

					<CardHeader className="z-10 relative">
						<CardTitle className="flex justify-between items-center text-lg font-semibold text-white">
							<span className="truncate group-hover:text-[#b81365] transition-colors">
								{project.name}
							</span>
							<DeleteProject projectId={project.id} />
						</CardTitle>
					</CardHeader>

					<CardContent className="z-10 relative flex flex-col justify-between h-full">
						<p className="text-sm text-gray-300 mb-6 line-clamp-3">
							{project.description || "No description provided."}
						</p>
						<Link
							href={`/project/${project.id}`}
							className="text-sm font-medium text-[#b81365] hover:text-[#f55536] underline underline-offset-4 transition"
						>
							View Project →
						</Link>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
