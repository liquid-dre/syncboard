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
import { Calendar } from "@/components/ui/calendar"; // ShadCN calendar
import { toast } from "sonner";

const CreateSprint = ({
	projectTitle,
	projectKey,
	projectId,
	sprintKey,
}: any) => {
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
	} = useForm({
		resolver: zodResolver(sprintSchema),
		defaultValues: {
			name: `${projectKey}-${sprintKey}`,
			startDate: dateRange.from,
			endDate: dateRange.to,
		},
	});

	const onSubmit = async (data: any) => {
		await createSprintFn(projectId, {
			...data,
			startDate: dateRange.from,
			endDate: dateRange.to,
		});
		setShowForm(false);
        toast.success("Sprint created successfully")
		router.refresh();
	};

	return (
		<>
			<div className="flex justify-between pb-4">
				<h1>{projectTitle}</h1>
				<Button
					className={`mt-2 px-4 py-2 rounded-md font-semibold text-white ${
						!showForm
							? "bg-blue-500 hover:bg-blue-700"
							: "bg-red-500 hover:bg-red-700"
					}`}
					onClick={() => setShowForm(!showForm)}
				>
					{!showForm ? "Create New Sprint" : "Cancel"}
				</Button>
			</div>

			{showForm && (
				<Card className="pt-4 mb-4">
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex gap-4 items-end"
						>
							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm font-medium mb-1"
								>
									Sprint Name
								</label>
								<Input
									id="name"
									{...register("name")}
									readOnly
									className="bg-slate-950"
								/>
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="flex-1">
								<label className="block text-sm font-medium mb-1">
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
													className={`w-full justify-start text-left font-normal bg-slate-950 ${
														!dateRange && "text-muted-foreground"
													}`}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
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
												className="w-auto bg-slate-900 p-2"
												align="start"
											>
												<div className="day-picker">
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
														// disabled={{ before: new Date() }}
													/>
												</div>
											</PopoverContent>
										</Popover>
									)}
								/>
							</div>

							<Button
								type="submit"
								disabled={createSprintLoading}
								className="w-full sm:w-auto px-6 py-2 font-medium rounded-2xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
		</>
	);
};

export default CreateSprint;
