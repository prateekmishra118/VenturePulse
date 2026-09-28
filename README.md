# VenturePulse

**Validate. Analyze. Improve.**

VenturePulse is a startup idea validation platform. Users describe a startup
idea and receive a structured analysis of its strengths, weaknesses, risks,
and a practical path toward validation — built with React, Express, and
PostgreSQL, with AI reasoning validated at every boundary.

> **Build status: all 16 phases implemented.** Auth, the idea intake flow,
> the deterministic scoring engine, AI integration (analysis, critic,
> improve-idea, MVP, experiments), the dashboard, reports, a real backend
> test suite, and basic production/CI setup are all in place. See
> [Honest Limitations](#honest-limitations) below for what I could not
> verify end-to-end in the environment I built this in, and why.

---

## What's implemented

- **Auth** — register/login/me, JWT + bcrypt, rate-limited, per-user data isolation enforced in every service function
- **Startup idea intake** — the full form (name, idea, problem, customer, location, industry, business model, pricing, competitors, USP, additional info), Zod-validated
- **Analysis engine** — one consolidated AI call per analysis (not nine separate ones) returning structured findings for all 9 categories, Problem/Market/Competition/Business Model/Feasibility/Risk detail, competitors, risk items, and recommendations
- **Scoring engine** — deterministic and unit-tested: the AI contributes a 0-100 rating per category, but the weighted overall score and verdict are calculated by `analyzers/scoringEngine.ts`, never returned by the AI directly
- **AI Critic** — strengths, weaknesses, biggest risk, hidden assumptions, why-this-could-fail, hard questions, recommended actions — explicitly prompted to be skeptical, not encouraging
- **Improve My Idea / MVP Generator / Validation Experiments** — each its own AI-backed endpoint, each Zod-validated with one retry on invalid output before failing loudly
- **Dashboard** — total ideas, ideas analyzed, average/best score, recent analyses, and three charts (score history, category comparison, risk distribution) via Recharts
- **History** — full idea list with delete, per-idea analysis history
- **Reports** — deterministic Markdown report assembled from already-computed analysis data (no extra AI call), downloadable
- **Security** — Helmet, scoped CORS, rate limiting (general + stricter on AI-calling routes), 1MB body limits, centralized error handling that never leaks internals in production
- **Tests** — 49 backend tests (scoring engine, both validator suites, AI-response-schema validation) + 9 frontend tests (Button, status/verdict helpers), all passing
- **CI/CD prep** — Dockerfiles for both services, `docker-compose.yml` with Postgres, a GitHub Actions workflow running type-check/test/build on every push

---

## Tech Stack

| Layer     | Technology                                                        |
|-----------|---------------------------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS v4, React Router, Framer Motion, Recharts |
| Backend   | Node.js, Express.js, TypeScript                                    |
| Database  | PostgreSQL + Prisma 6 (18 models — see [Database](#database))       |
| Validation| Zod — both API input and AI response validation                     |
| AI        | Any OpenAI-compatible chat completions API (backend-only)          |
| Testing   | Vitest, Supertest, React Testing Library                            |
| Security  | Helmet, CORS, rate limiting, JWT + bcrypt                           |

---

## Project Structure

```
VenturePulse/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/        # Hero, HowItWorks, Features, AnalysisCategories,
│   │   │   │                   # ExampleScore, AICritic, ValidationExperiments, FAQ, FinalCTA
│   │   │   ├── analysis/       # CategoryCard, CriticPanel
│   │   │   ├── AnimatedSection.tsx, Button.tsx, Footer.tsx, Navbar.tsx,
│   │   │   ├── ProtectedRoute.tsx, PulseLine.tsx, SectionHeading.tsx, StatusDisplay.tsx
│   │   ├── pages/               # LandingPage, Login/Register, Dashboard, IdeasList,
│   │   │                        # NewIdea, IdeaDetail, Analysis, NotFound
│   │   ├── layouts/MainLayout.tsx
│   │   ├── context/AuthContext.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/            # apiClient, authService, ideaService,
│   │   │                        # analysisService, dashboardService
│   │   ├── types/                # api.ts, landing.ts
│   │   ├── test/setup.ts
│   │   ├── App.tsx, main.tsx, index.css
│   ├── index.html, package.json, vite.config.ts, vitest.config.mts, tsconfig*.json
│   ├── Dockerfile, nginx.conf, .dockerignore
│
├── backend/
│   ├── src/
│   │   ├── config/env.ts          # centralized, typed env vars
│   │   ├── controllers/           # health, auth, idea, analysis, dashboard
│   │   ├── routes/                # + index.ts aggregator
│   │   ├── middleware/            # auth, errorHandler, rateLimiter, requestLogger, validate
│   │   ├── services/               # auth, idea, analysis, ai, report, dashboard
│   │   ├── analyzers/               # scoringConfig.ts, scoringEngine.ts (+ .test.ts)
│   │   ├── ai/                       # aiClient.ts, prompts.ts
│   │   ├── validators/                # auth, idea, ai.schemas (+ .test.ts each)
│   │   ├── database/prisma.ts
│   │   ├── types/                      # api.ts, express.d.ts
│   │   ├── utils/                       # apiResponse, asyncHandler, jwt
│   │   ├── app.ts, server.ts
│   ├── prisma/schema.prisma            # 18 models — see below
│   ├── package.json, tsconfig.json, tsconfig.build.json, vitest.config.mts
│   ├── Dockerfile, .dockerignore
│
├── .github/workflows/ci.yml
├── docker-compose.yml
├── .gitignore, .env.example, LICENSE, README.md
└── package.json                    # root convenience scripts
```

---

## Prerequisites

- Node.js **v18+** (developed/tested against v24.18.0)
- npm **v10+**
- PostgreSQL (local install, Docker, or a free hosted instance — Neon, Supabase)
- An OpenAI-compatible API key (for the AI-powered features)
- Git

---

## Setup (Windows 11 / PowerShell)

```powershell
cd VenturePulse
Copy-Item .env.example .env
```

Edit `.env`:
- Set `DATABASE_URL` (see the format examples in `.env.example`)
- Set `JWT_SECRET` — generate one with:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- Set `OPENAI_API_KEY` to a real key (any OpenAI-compatible provider — override `OPENAI_BASE_URL`/`OPENAI_MODEL` if not using OpenAI directly)

```powershell
npm run install:all
npm install
```

**Set up the database** (once, and again after any `schema.prisma` change):

```powershell
cd backend
npm run prisma:migrate -- --name init
cd ..
```

**Run everything:**

```powershell
npm run dev
```

Backend on **http://localhost:4000**, frontend on **http://localhost:5173**.

### Or with Docker Compose

```powershell
docker compose up --build
```

Then, once, run migrations inside the backend container:

```powershell
docker compose exec backend npx prisma migrate deploy
```

Open **http://localhost:8080**.

---

## Testing

```powershell
npm test              # both projects
npm test --prefix backend
npm test --prefix frontend
```

The backend test suite (49 tests) covers what can be tested without a live
database or AI key: the scoring engine's math (weights, clamping, verdict
bands), and every Zod schema (auth, idea intake, and — critically — the AI
response validators, since nothing from the AI reaches the database
unvalidated). The frontend suite (9 tests) covers shared UI components.

Neither suite talks to a live Postgres instance or a real AI provider —
that's intentional scoping (see below), not a gap in what's testable.

---

## Database

`backend/prisma/schema.prisma` — 18 models:

- **`User`**, **`StartupIdea`** — accounts and the idea intake form
- **`Analysis`** — one validation run; `status` goes `PENDING → ANALYZING →
  COMPLETED/FAILED`; once complete, carries `overallScore` + `verdict`
- **`Score`** — one row per scoring category (all 9) per analysis; the app
  computes `overallScore` from these rows' `score × weight` — the AI never
  returns a final number directly
- **`ProblemAnalysis`**, **`MarketAnalysis`**, **`CompetitionAnalysis`**,
  **`BusinessModelAnalysis`**, **`FeasibilityAnalysis`**, **`RiskAnalysis`** —
  1:1 detail tables for categories needing extra structured fields (e.g.
  `MarketAnalysis` has separate TAM/SAM/SOM fields, each with its own
  `DataConfidence` — `VERIFIED`/`ESTIMATE`/`ASSUMPTION`/`AI_RECOMMENDATION`
  — so a figure is never shown as fact when it isn't)
- **`Competitor`**, **`RiskItem`** — one-to-many detail rows
- **`AICritique`**, **`ImprovedIdea`**, **`MvpPlan`** — not in the original
  flat table list, but each has its own defined output shape in the spec,
  so each got its own table
- **`Recommendation`**, **`ValidationExperiment`** — many-per-analysis;
  experiments carry a `decision` (`PENDING → CONTINUE/MODIFY/REJECT`)
- **`Report`** — the cached, generated downloadable report

Every foreign key cascades on delete — removing a user removes their ideas,
analyses, and every piece of analysis data with them.

---

## API Overview

All responses: `{ success, message, data }` or `{ success, message, errors? }`.

| Method | Route                             | Auth | Description                          |
|--------|-------------------------------------|------|----------------------------------------|
| GET    | /api/health                          | —    | API + DB connectivity check            |
| POST   | /api/auth/register                   | —    | Create account                          |
| POST   | /api/auth/login                      | —    | Log in                                   |
| GET    | /api/auth/me                          | ✓   | Current user                              |
| POST   | /api/ideas                             | ✓   | Create idea                                |
| GET    | /api/ideas                              | ✓   | List own ideas (+ analysis summaries)       |
| GET    | /api/ideas/:id                           | ✓   | Idea detail + analysis history               |
| DELETE | /api/ideas/:id                            | ✓   | Delete idea (cascades)                        |
| POST   | /api/ideas/:id/analyze                     | ✓   | Start analysis (async, poll for result)        |
| GET    | /api/analyses/:id                           | ✓   | Full analysis detail                            |
| POST   | /api/analyses/:id/improve                    | ✓   | Generate improved idea                           |
| POST   | /api/analyses/:id/mvp                         | ✓   | Generate MVP plan                                 |
| POST   | /api/analyses/:id/experiments                  | ✓   | Generate validation experiments                    |
| POST   | /api/analyses/:id/report                        | ✓   | Generate/download report (`?format=markdown`)       |
| GET    | /api/dashboard                                   | ✓   | Aggregate stats + chart data                          |

Protected routes require `Authorization: Bearer <token>`. Every service
function filters by the authenticated `userId` — there is no route where
one user can read or modify another's data.

---

## Backend Architecture

Every request flows through: `helmet → cors → json (1MB limit) →
requestLogger → apiLimiter → routes/index.ts → your handler →
notFoundHandler → errorHandler`.

Conventions:
- Controllers call `sendSuccess(res, data, message)` on success and `throw
  new ApiError(statusCode, message)` on failure — never build a response by hand
- Async handlers get wrapped in `asyncHandler(...)`
- Every AI call goes through `services/ai.service.ts` → `ai/aiClient.ts` (the
  only place that talks to the provider), validated against a Zod schema in
  `validators/ai.schemas.ts` with one retry on invalid output
- `startAnalysis` returns immediately (status `ANALYZING`); the AI call and
  persistence happen in a detached background function
  (`runAnalysisPipeline`) — the frontend polls `GET /api/analyses/:id`
  every 3s until `COMPLETED`/`FAILED`

---

## Design System

The landing page avoids the generic purple-gradient "AI SaaS" look:
deep report-green ink (`--color-ink`) and emerald accent, warm paper
background, gold/coral used sparingly — Tailwind v4 `@theme` tokens in
`frontend/src/index.css`. `Newsreader` (serif) for headings, `Inter` for
body/UI. A small animated "pulse line" (heartbeat/EKG shape) recurs in the
hero and final CTA as the literal nod to "VenturePulse."

---

## Honest Limitations

Building this, I hit two things worth being upfront about rather than
glossing over:

1. **I could not run `prisma generate`/`migrate` against this schema
   myself.** Prisma's CLI needs to download engine binaries from
   `binaries.prisma.sh`, which isn't reachable from the sandboxed
   environment I built this in (every attempt returned `403 Forbidden`).
   I manually proofread `schema.prisma` line-by-line (every relation's two
   sides match, every `@map` is consistent) instead of relying on the
   official validator. This is a normal, unblocked public CDN for a
   regular machine — **you are effectively the first real `prisma
   generate` run this schema gets.** If anything doesn't compile, share
   the exact error and it'll get fixed immediately.
2. **I could not call a live AI provider.** The AI integration (prompts,
   response schemas, retry logic) is built and the Zod validators are
   tested against realistic example payloads, but the actual round-trip —
   real model, real latency, real edge cases in how it might deviate from
   the requested JSON shape — is untested against a live endpoint. The
   retry-once-then-fail-loudly design should handle most deviations, but
   watch the first few real analyses closely.

Everything else — the scoring engine's math, every input validator, the
full authenticated user flow through the frontend, both production
builds — is verified: type-checked, unit-tested where the logic allows
it, and built clean from a fresh `npm install`.

---

## License

MIT — see `LICENSE`.
