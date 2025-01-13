"use client";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useProject from "~/hooks/use-project";
import { api } from "~/trpc/react";
import CommitLog from "./commit-log"; // Make sure the path is correct

const DashboardPage = () => {
  const { project } = useProject();
  const [commits, setCommits] = useState([]);

  // Fetch commits for the project
  const {
    data: commitData,
    isLoading,
    isError,
  } = api.project.getCommits.useQuery({
    projectId: project?.id ?? "",
  });

  // Update commits when data is fetched
  useEffect(() => {
    if (commitData) {
      setCommits(commitData);
    }
  }, [commitData]);

  return (
    <div>
      {project?.id}
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* GIT LINK */}
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="item-center flex">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sml font-medium text-white">
                This Project is Linked To {""}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="H-4"></div>
        <div className="flex items-center gap-4">
          TeamMembers InviteButton Archive
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          ASK QUESTION MEETING
        </div>
      </div>
      <div className="mt-8">
        {/* Display Commit Summaries */}
        {isLoading ? (
          <p>Loading commits...</p>
        ) : isError ? (
          <p>Error loading commits</p>
        ) : (
          <CommitLog commits={commits} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
