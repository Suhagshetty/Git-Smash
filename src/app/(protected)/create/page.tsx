"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();

  // Assuming you want to refetch the projects after the mutation
  const { refetch } = api.project.getProjects.useQuery(undefined, {
    enabled: false, // Disable auto fetching
  });

  function onSubmit(data: FormInput) {
    // Mutate the API call to create the project
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch(); // Refetch the list of projects
          reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          toast.error(
            `Error creating project: ${error.message || "Unknown error"}`,
          );
        },
      },
    );
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/github.svg" alt="GitHub Logo" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link Your Github Repository
          </h1>
          <p className="text-sm">
            Enter the link to your Github repository and we'll create a project
            for you.
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Repository URL"
              required
            />
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <Input
              {...register("githubToken", { required: true })}
              placeholder="GitHub Token"
              required
              type="password"
            />
            <button
              type="submit"
              className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
              disabled={createProject.isPending}
            >
              Create Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
