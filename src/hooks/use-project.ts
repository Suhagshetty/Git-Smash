import React from "react";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery(); // Fix the name to 'projects'
  const [projectId, setProjectId] = useLocalStorage(
    "github-smash-project-id",
    "",
  );

  // Use the correct 'projects' array instead of duplicate 'project'
  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
};

export default useProject;
