# Job Application Tracker

A full-stack web app to manage your job search. Track applications, monitor status changes, and get AI-powered CV match analysis powered by Claude.

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
- Anthropic Claude API (AI analysis with tool use)
- Scalar (API documentation)

**Infrastructure**
- Database: PostgreSQL (Docker locally)
- Frontend: Vercel
- CI/CD: GitHub Actions (auto-deploy on push to main)

## Features

- **Application management** — create, edit, and delete job applications with company, role, description, and dates
- **Status tracking** — move applications through a workflow: Applied → Interviewing → Offered → Rejected
- **Status history** — full audit trail of every status change per application
- **CV match analysis** — paste a job description and get an AI-powered match score and feedback against your profile
- **Authentication** — register, log in, JWT-protected routes

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
- Docker (for PostgreSQL)
- Anthropic API key

### Backend
```bash
cd backend
docker compose up -d        # start PostgreSQL
dotnet run                  # API runs at http://localhost:5000
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

API docs available at `http://localhost:5000/scalar/v1` in development.

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
