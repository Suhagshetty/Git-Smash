🚀 GitSmash

AI-Powered Code Collaboration & Repository Intelligence Platform

GitSmash helps developers understand, review, and collaborate on codebases faster using AI-powered insights, real-time collaboration, and GitHub integration.

🧠 Overview

Modern codebases are large and complex. GitSmash solves this by combining AI-driven repository analysis with real-time peer collaboration, enabling teams to:Instantly understand unfamiliar repositories, Perform smarter code reviews with AI assistance, Collaborate live on code using peer-to-peer connections Track changes and insights across commits and branches

✨ Key Features
🔍 AI Repository Intelligence

Automated repository summaries and structure analysis

AI-generated explanations for files, folders, and commits

Context-aware insights powered by T3 Chat + LangChain

💬 T3 Chat (AI Code Assistant)

Chat directly with your codebase

Ask questions like:

“What does this service do?”

“Explain this function in simple terms”

“What changed in the last 5 commits?”

Uses repository context for accurate, grounded answers

🤝 Real-Time Collaboration

Live peer-to-peer code collaboration using WebRTC

Shared sessions for reviewing and discussing code

Low-latency communication without centralized servers

🔗 GitHub Integration

Authenticate and fetch repositories via GitHub API

Analyze commit history, pull requests, and file changes

Intelligent change tracking and diff insights

🏗 Tech Stack
Frontend

Next

Tailwind CSS

ShadCN UI

Backend

Node.js

Express.js

REST APIs

WebRTC (P2P collaboration)

AI / Intelligence Layer

T3 Chat

LangChain

LLM-powered repository analysis

Context-aware embeddings for code understanding

Integrations & Infra

GitHub API

WebSockets / WebRTC

Docker

🧩 System Architecture (High Level)
User
 │
 ├── Next Frontend
 │     ├── Repo Viewer
 │     ├── T3 Chat Interface
 │     └── Live Collaboration UI
 │
 ├── Node.js Backend
 │     ├── GitHub API Integration
 │     ├── Repo Parser & Indexer
 │     └── AI Orchestration Layer
 │
 └── AI Layer (T3 Chat + LangChain)
       ├── Code Context Retrieval
       ├── Embeddings & Memory
       └── LLM Response Generation

⚙️ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/gitsmash.git
cd gitsmash

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key

4️⃣ Run the App
npm run dev

🧪 Use Cases

🚀 Onboard faster into new codebases

🧠 Understand legacy projects with AI summaries

👨‍💻 Conduct collaborative code reviews

🤖 Ask AI questions directly about repository logic

🛣 Roadmap

 Pull request AI reviews

 Multi-repo workspace support

 Advanced RAG for large repositories

 Voice-based AI code walkthroughs

 Team collaboration & permissions

👤 Author

Suhag Shetty
📧 suhagshetty07@gmail.com

🔗 LinkedIn

🐙 GitHub

⭐ If you like this project

Give it a ⭐ — it helps a lot and keeps me building 🚀
