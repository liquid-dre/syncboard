"use client";

import { useEffect } from "react";
import { BarLoader } from "react-spinners";
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
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import { toast } from "sonner";
import { z } from "zod";

type IssueFormValues = z.infer<typeof issueSchema>;

interface OrgUser {
  id: string;
  name?: string | null;
}

interface IssueCreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId?: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  projectId: string;
  onIssueCreated: () => void;
  orgId: string;
}

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: IssueCreationDrawerProps) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    data: newIssue,
    setData,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
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
  }, [isOpen, orgId, fetchUsers]); // ✅ Added missing dependency

  const onSubmit = async (data: IssueFormValues) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue added successfully");
      setData(undefined);
    }
  }, [newIssue, reset, setData]);


  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold tracking-wide">
            Create New Issue
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
            disabled={createIssueLoading}
            className="w-full border-2 border-slate-600 bg-slate-900 text-slate-900 dark:text-white px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-200 ease-in-out
               hover:bg-slate-700 hover:text-white hover:border-slate-700
               focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-900 dark:disabled:hover:text-white"
          >
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
