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

const STATUS_COLORS = [
	"hsl(300, 1%, 96%)",
	"hsl(202, 79%, 56%)",
	"hsl(45, 93.6%, 46.5%)",
	"hsl(116, 62%, 41%)",
];

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
			color: "hsl(var(--chart-1))",
		},
	} as const;

	const pieConfig = {
		value: {
			label: "Progress",
			color: "hsl(var(--chart-1))",
		},
	} as const;

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Issues by Status</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer config={barConfig} className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={data.statusCounts}>
								<CartesianGrid vertical={false} />
								<XAxis dataKey="status" tickLine={false} axisLine={false} />
								<YAxis allowDecimals={false} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" radius={[4, 4, 0, 0]}>
									{data.statusCounts.map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={STATUS_COLORS[index % STATUS_COLORS.length]}
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
