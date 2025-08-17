"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { updateIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import { toast } from "sonner";
import { z } from "zod";
import type { IssueWithRelations } from "@/lib/types/issues";
import { BarLoader } from "react-spinners";

interface OrgUser {
	id: string;
	name?: string | null;
}

type IssueFormValues = z.infer<typeof issueSchema>;

interface IssueEditDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	issue: IssueWithRelations;
	orgId: string;
	onUpdated: (issue: IssueWithRelations) => void;
}

export default function IssueEditDrawer({
	isOpen,
	onClose,
	issue,
	orgId,
	onUpdated,
}: IssueEditDrawerProps) {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IssueFormValues>({
		resolver: zodResolver(issueSchema),
		defaultValues: {
			title: issue.title,
			description: issue.description || "",
			priority: issue.priority,
			assigneeId: issue.assigneeId || "",
		},
	});

	const {
		loading: updateLoading,
		fn: updateIssueFn,
		data: updatedIssue,
		setData,
	} = useFetch(updateIssue);

	const {
		loading: usersLoading,
		fn: fetchUsers,
		data: users,
	} = useFetch(getOrganizationUsers);

	useEffect(() => {
		if (isOpen && orgId) {
			fetchUsers(orgId);
			reset({
				title: issue.title,
				description: issue.description || "",
				priority: issue.priority,
				assigneeId: issue.assigneeId || "",
			});
			document.body.classList.add("keep-scroll");
		} else {
			document.body.classList.remove("keep-scroll");
		}

		return () => {
			setTimeout(() => {
				document.body.classList.remove("keep-scroll");
				document.body.style.overflow = "auto";
			}, 10);
		};
	}, [isOpen, orgId, fetchUsers, reset, issue]);

	const onSubmit = async (data: IssueFormValues) => {
		await updateIssueFn(issue.id, data);
	};

	useEffect(() => {
		if (updatedIssue) {
			onUpdated(updatedIssue as IssueWithRelations);
			toast.success("Issue updated successfully");
			setData(undefined);
			onClose();
		}
	}, [updatedIssue, onUpdated, onClose, setData]);

	return (
		<Drawer open={isOpen} onClose={onClose}>
			<DrawerContent className="max-h-[90vh] flex flex-col">
				<DrawerHeader>
					<DrawerTitle className="text-xl font-semibold tracking-wide">
						Edit Issue
					</DrawerTitle>
				</DrawerHeader>

				{usersLoading && <BarLoader width="100%" color="#36d7b7" />}

				<div className="overflow-y-auto px-4 flex-1">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-4">
						{/* Title */}
						<div>
							<label htmlFor="title" className="block text-sm font-medium mb-1">
								Title
							</label>
							<Input id="title" {...register("title")} />
							{errors.title && (
								<p className="text-red-500 text-sm mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						{/* Assignee */}
						<div>
							<label
								htmlFor="assigneeId"
								className="block text-sm font-medium mb-1"
							>
								Assignee
							</label>
							<Controller
								name="assigneeId"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select assignee" />
										</SelectTrigger>
										<SelectContent>
											{users?.map((user: OrgUser) => (
												<SelectItem key={user.id} value={user.id}>
													{user?.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.assigneeId && (
								<p className="text-red-500 text-sm mt-1">
									{errors.assigneeId.message}
								</p>
							)}
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium mb-1"
							>
								Description
							</label>
							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<MDEditor value={field.value} onChange={field.onChange} />
								)}
							/>
						</div>

						{/* Priority */}
						<div>
							<label
								htmlFor="priority"
								className="block text-sm font-medium mb-1"
							>
								Priority
							</label>
							<Controller
								name="priority"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="LOW">Low</SelectItem>
											<SelectItem value="MEDIUM">Medium</SelectItem>
											<SelectItem value="HIGH">High</SelectItem>
											<SelectItem value="URGENT">Urgent</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</form>
				</div>

				{/* Submit Button */}
				<div className="p-4 border-t border-slate-700">
					<Button
						type="submit"
						onClick={handleSubmit(onSubmit)}
						disabled={updateLoading}
						className="w-full border-2 border-slate-600 bg-slate-900 text-slate-900 dark:text-white px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-200 ease-in-out hover:bg-slate-700 hover:text-white hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-900 dark:disabled:hover:text-white"
					>
						{updateLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
