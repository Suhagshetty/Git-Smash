import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummariseCommit = async (diff: string) => {
  const prompt = `
    You are an expert programmer tasked with summarizing a Git diff file. The goal is to create a concise summary that identifies only the key code changes. Focus on the actual code modifications, such as the functions, logic, or code lines that have been added, removed, or updated. Do not include any additional labels or details. Please avoid displaying the standard Git diff symbols like '+' or '-'.

    Consider the following Git diff:

    ${diff}

    Please summarize the changes made, without including any section headers, extra commentary, or Git diff symbols ('+' or '-'). Just provide the relevant code changes.
  `;

  const response = await model.generateContent([prompt]);

  // Extracting only the changes from the response
  const changesText =
    response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  // Clean up the text by removing '+' and '-' symbols
  const cleanChangesText = changesText?.replace(/^\+|\-/g, "").trim();

  return cleanChangesText ?? "No summary generated.";
};
