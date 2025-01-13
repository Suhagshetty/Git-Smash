import React from "react";

interface CommitLogProps {
  commits: Array<{
    commitMessage: string;
    commitAuthorName: string;
    summary: string;
  }>;
}

const CommitLog: React.FC<CommitLogProps> = ({ commits }) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Commit Summaries</h3>
      <ul>
        {commits.map((commit) => (
          <li key={commit.commitMessage} className="py-2">
            <p>
              <strong>Message:</strong> {commit.commitMessage}
            </p>
            <p>
              <strong>Author:</strong> {commit.commitAuthorName}
            </p>
            <p>
              <strong>Summary:</strong> {commit.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitLog;
