"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { getProjectMetrics } from "@/actions/projects";

const STATUS_ORDER = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const STATUS_COLOR_MAP: Record<string, string> = {
	TODO: "hsl(300, 1%, 96%)",
	IN_PROGRESS: "hsl(202, 79%, 56%)",
	IN_REVIEW: "hsl(45, 93.6%, 46.5%)",
	DONE: "hsl(116, 62%, 41%)",
};

interface ProjectChartsProps {
	projectId: string;
}

export default function ProjectCharts({ projectId }: ProjectChartsProps) {
	const [data, setData] = useState<{
		statusCounts: { status: string; count: number }[];
		percentageCompleted: number;
	} | null>(null);

	useEffect(() => {
		getProjectMetrics(projectId).then((metrics) => {
			setData(metrics);
		});
	}, [projectId]);

	if (!data) return null;

	const progressData = [
		{ label: "Completed", value: data.percentageCompleted },
		{ label: "Remaining", value: 100 - data.percentageCompleted },
	];

	const barConfig = {
		count: {
			label: "Issues",
			color: "hsl(450, 71%, 65%)",
		},
	} as const;

	const pieConfig = {
		value: {
			label: "Progress",
			color: "hsl(300, 1%, 96%)",
		},
	} as const;

	const orderedCounts = STATUS_ORDER.map((status) => ({
		status,
		count: data.statusCounts.find((s) => s.status === status)?.count ?? 0,
	}));

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Issues by Status</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer config={barConfig} className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={orderedCounts}>
								<CartesianGrid vertical={false} />
								<XAxis dataKey="status" tickLine={false} axisLine={false} />
								<YAxis allowDecimals={false} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" radius={[4, 4, 0, 0]}>
									{orderedCounts.map((item) => (
										<Cell
											key={item.status}
											fill={STATUS_COLOR_MAP[item.status]}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Completion</CardTitle>
				</CardHeader>
				<CardContent className="flex justify-center">
					<ChartContainer config={pieConfig} className="h-52 w-52">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={progressData}
									dataKey="value"
									innerRadius={60}
									outerRadius={80}
									startAngle={90}
									endAngle={-270}
								>
									<Cell fill="hsl(142, 70.8%, 45.3%)" />
									<Cell fill="hsl(350, 77.5%, 35.5%)" />
								</Pie>
								<ChartTooltip content={<ChartTooltipContent />} />
							</PieChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
