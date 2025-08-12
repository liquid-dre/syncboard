"use client";

import { createSprint } from "@/actions/sprints";
import { sprintSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { z } from "zod";

type SprintForm = z.infer<typeof sprintSchema>;

interface CreateSprintProps {
	projectTitle: string;
	projectKey: string;
	projectId: string;
	sprintKey: number;
}

const CreateSprint = ({
	projectTitle,
	projectKey,
	projectId,
	sprintKey,
}: CreateSprintProps) => {
	const [showForm, setShowForm] = useState(false);

	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: new Date(),
		to: addDays(new Date(), 14),
	});

	const router = useRouter();

	const { loading: createSprintLoading, fn: createSprintFn } =
		useFetch(createSprint);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SprintForm>({
		resolver: zodResolver(sprintSchema),
		defaultValues: {
			name: `${projectKey}-${sprintKey}`,
			startDate: dateRange.from,
			endDate: dateRange.to,
		},
	});

	const onSubmit = async (data: SprintForm) => {
		await createSprintFn(projectId, {
			...data,
			startDate: dateRange.from,
			endDate: dateRange.to,
		});
		setShowForm(false);
		toast.success("Sprint created successfully");
		router.refresh();
	};

	return (
		<>
			{/* Header Section */}
			<div className="flex justify-between items-center pb-6 px-2 sm:px-0">
				<div>
					<h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text">
						{projectTitle}
					</h1>
					<p className="text-sm text-gray-400 mt-1 tracking-wide">
						Plan and manage your sprints efficiently
					</p>
				</div>

				<Button
					className={`
    relative overflow-hidden mt-2 px-6 py-3 rounded-2xl font-semibold text-white 
    transition-all duration-300 ease-in-out 
    border border-gray-300 dark:border-gray-700 
    shadow-md

    ${
			!showForm
				? "bg-gradient-to-r from-[#e96614] to-[#bf1363]"
				: "bg-gradient-to-r from-red-500 to-pink-600"
		}

    hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(233,102,20,0.4)]
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e96614]
  `}
					onClick={() => setShowForm(!showForm)}
				>
					<span className="relative z-10">
						{!showForm ? "Create New Sprint" : "Cancel"}
					</span>
					<span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-10 transition-opacity duration-300" />
				</Button>
			</div>

			{/* Slide-down form */}
			{showForm && (
				<Card className="bg-slate-900 border border-slate-800 shadow-2xl pt-6 mb-6 rounded-xl animate-slide-down">
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col sm:flex-row gap-6 sm:items-end"
						>
							{/* Sprint Name */}
							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm font-medium mb-1 text-gray-300"
								>
									Sprint Name
								</label>
								<Input
									id="name"
									{...register("name")}
									className="bg-slate-950 border border-slate-700 focus:ring-2 focus:ring-blue-500"
								/>
								{errors.name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.name.message}
									</p>
								)}
							</div>

							{/* Sprint Duration */}
							<div className="flex-1">
								<label className="block text-sm font-medium mb-1 text-gray-300">
									Sprint Duration
								</label>
								<Controller
									control={control}
									name="startDate"
									render={({ field }) => (
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={`w-full justify-start text-left font-normal bg-slate-950 border border-slate-700 hover:border-slate-600 ${
														!dateRange && "text-muted-foreground"
													}`}
												>
													<CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
													{dateRange.from && dateRange.to ? (
														<>
															{format(dateRange.from, "LLL dd, y")} -{" "}
															{format(dateRange.to, "LLL dd, y")}
														</>
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-2"
												align="start"
											>
												<Calendar
													mode="range"
													selected={dateRange}
													onSelect={(range) => {
														if (range?.from && range?.to) {
															const fullRange = {
																from: range.from,
																to: range.to,
															};
															setDateRange(fullRange);
															setValue("startDate", fullRange.from);
															setValue("endDate", fullRange.to);
															field.onChange(fullRange.from);
														}
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									)}
								/>
							</div>

							{/* Submit */}
							<Button
								type="submit"
								disabled={createSprintLoading}
								className="w-full sm:w-auto px-6 py-3 font-medium rounded-xl shadow-lg bg-green-600 hover:bg-green-700 hover:text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{createSprintLoading ? (
									<span className="flex items-center gap-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										Creating...
									</span>
								) : (
									"Create Sprint"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			<style jsx global>{`
				.animate-text {
					background-size: 200% 200%;
					animation: gradient 4s ease infinite;
				}
				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}
				.animate-slide-down {
					animation: slideDown 0.35s ease-out;
				}
				@keyframes slideDown {
					0% {
						opacity: 0;
						transform: translateY(-10px);
					}
					100% {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</>
	);
};

export default CreateSprint;
