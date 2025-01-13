import { Octokit } from "octokit";
import { db } from "~/server/db";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

// Initialize Octokit with authentication
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Extract the owner and repo from the GitHub URL
const parseGithubUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2] };
};

// Response Type Definition
type CommitResponse = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

// Function to Get Commit Hashes
export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) throw new Error("Invalid GitHub URL");

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  // Sort and map the commits
  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author?.date || "").getTime() -
      new Date(a.commit.author?.date || "").getTime(),
  );

  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? "",
  }));
};

// Example Usage
export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryPromises = unprocessedCommits.map((commit) => {
    return summariseCommit(githubUrl, commit.commitHash);
  });

  const summaryResponses = await Promise.allSettled(summaryPromises);

  const commitSummaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  console.log(
    "Saving commits:",
    commitSummaries.map((summary, index) => ({
      projectId,
      commitHash: unprocessedCommits[index]?.commitHash,
      commitMessage: unprocessedCommits[index]?.commitMessage,
      commitAuthorName: unprocessedCommits[index]?.commitAuthorName,
      commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar,
      commitDate: new Date(unprocessedCommits[index]?.commitDate),
      summary,
    })),
  );

  const commits = await db.commit.createMany({
    data: commitSummaries.map((summary, index) => ({
      projectId,
      commitHash: unprocessedCommits[index]?.commitHash,
      commitMessage: unprocessedCommits[index]?.commitMessage,
      commitAuthorName: unprocessedCommits[index]?.commitAuthorName,
      commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar,
      commitDate: new Date(unprocessedCommits[index]?.commitDate),
      summary,
    })),
  });

  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  // Get the diff and pass the diff to AI
  const [data] = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return (await aiSummariseCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project not found");
  }
  return { project, githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: CommitResponse[],
) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unprocessedCommits;
}
