"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { getProjectMetrics } from "@/actions/projects";

const ResponsiveContainer = dynamic(
        () => import("recharts").then((m) => m.ResponsiveContainer),
        { ssr: false }
);
const BarChart = dynamic(
        () => import("recharts").then((m) => m.BarChart),
        { ssr: false }
);
const Bar = dynamic(
        () => import("recharts").then((m) => m.Bar),
        { ssr: false }
);
const XAxis = dynamic(
        () => import("recharts").then((m) => m.XAxis),
        { ssr: false }
);
const YAxis = dynamic(
        () => import("recharts").then((m) => m.YAxis),
        { ssr: false }
);
const Tooltip = dynamic(
        () => import("recharts").then((m) => m.Tooltip),
        { ssr: false }
);
const PieChart = dynamic(
        () => import("recharts").then((m) => m.PieChart),
        { ssr: false }
);
const Pie = dynamic(
        () => import("recharts").then((m) => m.Pie),
        { ssr: false }
);
const Cell = dynamic(
        () => import("recharts").then((m) => m.Cell),
        { ssr: false }
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

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
                { name: "Completed", value: data.percentageCompleted },
                { name: "Remaining", value: 100 - data.percentageCompleted },
        ];

        return (
                <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                                <CardHeader>
                                        <CardTitle>Issues by Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={data.statusCounts}>
                                                        <XAxis dataKey="status" />
                                                        <YAxis allowDecimals={false} />
                                                        <Tooltip />
                                                        <Bar dataKey="count">
                                                                {data.statusCounts.map((entry, index) => (
                                                                        <Cell
                                                                                key={`cell-${index}`}
                                                                                fill={
                                                                                        COLORS[
                                                                                                index %
                                                                                                COLORS.length
                                                                                        ]
                                                                                }
                                                                        />
                                                                ))}
                                                        </Bar>
                                                </BarChart>
                                        </ResponsiveContainer>
                                </CardContent>
                        </Card>

                        <Card>
                                <CardHeader>
                                        <CardTitle>Completion</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                        <ResponsiveContainer width={200} height={200}>
                                                <PieChart>
                                                        <Pie
                                                                data={progressData}
                                                                dataKey="value"
                                                                innerRadius={60}
                                                                outerRadius={80}
                                                                startAngle={90}
                                                                endAngle={-270}
                                                        >
                                                                <Cell fill="#82ca9d" />
                                                                <Cell fill="#d3d3d3" />
                                                        </Pie>
                                                        <Tooltip />
                                                </PieChart>
                                        </ResponsiveContainer>
                                </CardContent>
                        </Card>
                </div>
        );
}