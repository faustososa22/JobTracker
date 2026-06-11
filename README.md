# Job Application Tracker

A full-stack web app to manage your job search. Track applications, monitor status changes, and get AI-powered analysis — including a Job Coach agent with memory, RAG over your CV, and multi-agent CV matching.

**Live demo:** https://job-tracker-ten-bay.vercel.app

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Bootstrap (UI components)
- React Router (client-side routing)
- Axios (HTTP client)

**Backend**
- .NET 10 / ASP.NET Core Web API
- Entity Framework Core + PostgreSQL
- JWT authentication
- Anthropic Claude API (claude-haiku-4-5, claude-sonnet-4-6)
- Semantic Kernel (agentic loops, multi-agent orchestration, plugin system)
- pgvector (vector similarity search for RAG)
- Ollama + nomic-embed-text (local embeddings)
- PdfPig (PDF text extraction)
- Scalar (API documentation)

**Infrastructure**
- Database: PostgreSQL with pgvector extension (Docker locally)
- Frontend: Vercel
- CI/CD: GitHub Actions (auto-deploy on push to main)

## Features

- **Application management** — create, edit, and delete job applications with company, role, description, and dates
- **Status tracking** — move applications through a workflow: Applied → Interviewing → Offered → Rejected
- **Status history** — full audit trail of every status change per application
- **Job Coach agent** — conversational AI agent with persistent memory, tool use, and RAG over your indexed CV
- **CV indexing** — upload your CV once; it's chunked, embedded with Ollama, and stored in pgvector for semantic search
- **CV match analysis** — multi-agent pipeline that evaluates your CV against a job description using three specialized agents
- **Application insights** — AI-generated analysis of a specific application and its status history
- **Response evaluation** — every Job Coach response is automatically scored against 5 quality criteria (relevance, grounding, actionability, tone, scope) using LLM-as-a-judge, and persisted for observability
- **Authentication** — register, log in, JWT-protected routes

## AI Architecture

### Job Coach Agent
Built with Semantic Kernel. On each turn:
1. Retrieves conversation history from PostgreSQL
2. Searches the user's indexed CV using pgvector (RAG) to inject relevant context
3. Runs an agentic loop with tool use — tools can fetch applications and status history
4. Streams the response token-by-token to the frontend
5. Evaluates the response with LLM-as-a-judge and persists the scores

### CV Match — Multi-Agent Pipeline
Three `ChatCompletionAgent` instances orchestrated with Semantic Kernel:
- **CvAnalyzer** — extracts key skills and experience from the CV
- **JobAnalyzer** — extracts requirements from the job description
- **MatchEvaluator** — compares both outputs and produces a match score with feedback

Supports plain text input and PDF upload (via PdfPig).

### RAG (Retrieval-Augmented Generation)
CV text is split into chunks, embedded locally with Ollama (`nomic-embed-text`), and stored in PostgreSQL using the pgvector extension. At query time, the Job Coach performs a cosine similarity search to retrieve the most relevant chunks and includes them in the prompt.

### LLM-as-a-Judge Evaluation
After every Job Coach response, a separate evaluator model scores the answer on five criteria (1–5 scale): relevance, grounding, actionability, tone, and scope. Scores are persisted in the `EvaluationScores` table for observability and future fine-tuning.

## Architecture

The backend follows a strict layered pattern:

```
Controllers → Services → Repositories → JobTrackerContext (EF Core) → PostgreSQL
```

Each layer has dedicated interfaces and implementations, registered as scoped dependencies via dependency injection.

## Local Development

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- Docker (for PostgreSQL + pgvector)
- Anthropic API key
- Ollama with `nomic-embed-text` model (`ollama pull nomic-embed-text`)

### Backend
```bash
cd backend
docker compose up -d        # start PostgreSQL with pgvector
dotnet run                  # API runs at http://localhost:5117
```

Add your environment variables to `appsettings.Development.json`:
```json
{
  "Anthropic": {
    "ApiKey": "your-key-here"
  },
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  }
}
```

API docs available at `http://localhost:5117/scalar/v1` in development.

### Frontend
```bash
cd frontend
npm install
npm run dev                 # runs at http://localhost:5173
```

## Author

**Fausto Martin Sosa** — Junior .NET Developer based in Cork, Ireland

- GitHub: [faustososa22](https://github.com/faustososa22)
- LinkedIn: [fausto-sosa](https://linkedin.com/in/fausto-sosa)
