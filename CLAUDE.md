# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Job Application Tracker with AI integration. Learning project for a junior .NET developer.

**Stack:** ASP.NET Core Web API (.NET 10) · Entity Framework Core + Npgsql · PostgreSQL · React + TypeScript + Bootstrap (frontend, not yet built) · JWT auth (not yet implemented) · Anthropic Claude API (AI features, not yet implemented)

## Backend commands

Run from `backend/`:

```bash
dotnet build
dotnet run                          # API at http://localhost:5117
dotnet ef migrations add <Name>     # create a new migration
dotnet ef database update           # apply migrations
```

API documentation (Scalar UI): `http://localhost:5117/scalar/v1` — only available in Development.

## Local database

PostgreSQL runs in Docker. From the repo root:

```bash
docker compose up -d    # start
docker compose down     # stop
```

Connection string lives in `backend/appsettings.Development.json` (gitignored). Credentials match `docker-compose.yml`: host `localhost`, db/user/password all `jobtracker` / `jobtracker123`.

## Architecture

Strict layered architecture — no Clean Architecture, no CQRS, no MediatR:

```
Controllers → Services → Repositories → JobTrackerContext (EF Core) → PostgreSQL
```

Each layer has an interface + implementation (e.g. `IApplicationRepository` / `ApplicationRepository`). All registered as `Scoped` in `Program.cs`.

**Key decisions:**
- `DateTimeOffset` (not `DateTime`) on all date fields — Npgsql requires UTC; services call `.ToUniversalTime()` before saving.
- `SuppressAsyncSuffixInActionNames = false` in `AddControllers` — required for `CreatedAtAction` to resolve `*Async` method names correctly.
- `Npgsql.EntityFrameworkCore.PostgreSQL` and `Microsoft.EntityFrameworkCore.Tools` must stay on the same version (currently `10.0.1`) — version mismatch causes migration failures.

## Models

- `Application` — a job application (company, title, description, dates, status enum)
- `ApplicationStatus` — enum: `Applied`, `Interviewing`, `Offered`, `Rejected`
- `StatusHistory` — history of status changes for an application (FK to Application)
- `AIAnalysis` — AI-generated analysis stored per application; `MatchScore` is nullable (not all analyses include a CV match)
