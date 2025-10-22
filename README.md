# AI Gmail Summarizer

A small full-stack project that summarizes emails using OpenAI's API and stores the results in a PostgreSQL database. The frontend is a Create React App dashboard that shows stored summaries, allows re-summarizing and deleting, and can trigger summarization of bundled mock emails.

This README covers project structure, how to run locally, environment variables, and helpful notes.

## Repository structure

Top-level layout (key files and folders):

```
ai-text-summarizer/
├─ backend/
│  ├─ server.js                  # Express server (sets up middleware and mounts routes)
│  ├─ package.json               # backend dependencies
│  ├─ mock_emails.json           # sample emails used by /summarize-emails
│  ├─ drizzle.config.ts          # drizzle-kit config (TypeScript)
│  ├─ routes/                    # Express route definitions
│  │  └─ summaryRoutes.js        # API route wiring for summaries
│  ├─ controllers/               # request handling & orchestration
│  │  └─ summaryController.js    # controller functions for each route
	│  
│  ├─ services/                  # external integrations and business logic
│  │  └─ openaiService.js        # OpenAI API calls & response parsing
│  └─ drizzle/
│     ├─ drizzle.config.js       # Drizzle DB connection (Node Postgres)
│     ├─ schema.js               # Drizzle ORM table definitions (summaries)
│     └─ migrations/             # generated migrations (if any)
│        └─ meta/
│
├─ frontend/
│  ├─ package.json               # frontend scripts / deps (Create React App)
│  ├─ README.md                  # CRA default README (frontend-specific)
│  ├─ tsconfig.json              # TypeScript config
│  ├─ public/
│  │  ├─ index.html
│  │  └─ manifest.json
│  └─ src/
		 ├─ App.tsx                 # main React app (dashboard)
		 ├─ index.tsx               # React entry
		 ├─ App.css
		 └─ ...                     # other CRA files and tests

├─ README.md                     # (this file) project overview & setup
```

Notes:
- `backend/server.js` sets up Express and mounts the routes from `backend/routes/summaryRoutes.js`.
- Route handlers are implemented in `backend/controllers/summaryController.js`.
- OpenAI-related logic (requests and response parsing) lives in `backend/services/openaiService.js` and is used by the controllers.
- `backend/drizzle/schema.js` defines the `summaries` table used by the app.
- The frontend is a Create React App (TypeScript) project and talks to the backend at `http://localhost:5000` by default.

## Requirements

- Node.js (v16+ recommended)
- PostgreSQL (or any Postgres-compatible database)
- An OpenAI API key with access to chat completions

## Environment variables

Create a `.env` file in `backend/` with the following variables:

- DATABASE_URL — Postgres connection string (example: `postgres://user:pass@localhost:5432/dbname`)
- OPENAI_API_KEY — your OpenAI API key

Example `.env` (do not commit this file):

DATABASE_URL=postgres://postgres:password@localhost:5432/ai_summarizer
OPENAI_API_KEY=sk-xxxx

## API configuration

These settings control runtime behavior for the backend API. Place them in `backend/.env`.

- `DATABASE_URL` — Postgres connection string (required)
- `OPENAI_API_KEY` — OpenAI API key (required)
- `PORT` — optional, port the backend listens on (default: `5000`)
- `OPENAI_MODEL` — optional, model to use for summarization (default in code: `gpt-3.5-turbo`)

Base URL (development): `http://localhost:5000`

Endpoints (contract):

- `GET /` — health check. Returns a short text message.

- `POST /summarize-emails` — read `mock_emails.json`, summarize each email via OpenAI and insert into DB.
	- Request: no body required (the endpoint reads bundled mock emails)
	- Response: JSON array of inserted summary records.

- `GET /summaries` — returns all stored summaries.
	- Response: JSON array of summary objects (fields: `id, sender, subject, body, summary_text, category, created_at`).

- `GET /summaries/export` — export all stored summaries as a CSV file for download.
	- Response: a CSV attachment (Content-Type: text/csv) with columns `id,sender,subject,body,summary_text,category,created_at`.

- `DELETE /summaries/:id` — delete a summary by ID.
	- Response: `{ success: true }` on success.

- `POST /summaries/:id/resummarize` — re-run summarization for a stored email and update the record.
	- Response: `{ summary_text, category }` with the updated data.

Quick curl examples:

```bash
# Summarize the bundled mock emails
curl -X POST http://localhost:5000/summarize-emails

# Fetch summaries
curl http://localhost:5000/summaries

# Download all summaries as CSV (saves to summaries.csv)
curl -o summaries.csv http://localhost:5000/summaries/export

# Re-summarize an item (replace 1 with actual id)
curl -X POST http://localhost:5000/summaries/1/resummarize

# Delete an item
curl -X DELETE http://localhost:5000/summaries/1
```

Notes:
- The OpenAI requests may take a few seconds; calls run synchronously in the controller for the mock-emails flow. Consider background jobs for large volumes.
- The service uses `axios` to call OpenAI's Chat Completions endpoint. Customize `OPENAI_MODEL` if you need a different model.

## Setup & Run (backend)

1. Install dependencies and run migrations (optional):

```bash
cd backend
npm install
# Drizzle migrations are configured in drizzle/ and can be run with drizzle-kit if you use it
# npx drizzle-kit generate:migration # (optional, if you modify schema)
```

2. Start the backend server:

```bash
cd backend
node server.js
```

The server listens on http://localhost:5000 and exposes these endpoints:

- `GET /` — health check
- `POST /summarize-emails` — summarize and store the mock emails from `mock_emails.json`
- `GET /summaries` — list all stored summaries
- `DELETE /summaries/:id` — delete a summary
- `POST /summaries/:id/resummarize` — re-run summarization for a stored email
 - `GET /summaries/export` — download all stored summaries as a CSV file (used by the frontend "Download CSV" button)

Notes:
- `server.js` uses the OpenAI Chat Completion API. Make sure `OPENAI_API_KEY` is set.
- The code assumes the `summaries` table exists (see `backend/drizzle/schema.js`). Use your migration tooling (drizzle-kit) to create the table if needed.

## Setup & Run (frontend)

1. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

2. Open http://localhost:3000 in your browser. The UI calls the backend at `http://localhost:5000`.

## How it works (high level)

- The backend reads `mock_emails.json` and sends each email body to OpenAI's chat completions endpoint to get a short summary and a category. It then inserts the result into a Postgres table via Drizzle ORM.
- The frontend lists stored summaries and provides actions to re-summarize or delete records. It can also trigger summarization of the bundled mock emails.

## Troubleshooting

- If the backend fails to connect to the database, verify `DATABASE_URL` and that Postgres is running and reachable.
- If summarization fails with an OpenAI error, verify `OPENAI_API_KEY` and network connectivity.
- If CORS errors appear in the browser, ensure the backend is running and that `app.use(cors())` is active (it is by default in `server.js`).

## Security & Notes

- Do not commit `.env` or your API keys.
- The server logs some raw responses for debugging — remove or reduce logging in production.

## Design decisions

This project follows a small, pragmatic architecture to keep the code simple and easy to understand while separating concerns:

- Routing / Controllers / Services separation
	- Routes (`backend/routes/`) define API endpoints and map them to controller functions.
	- Controllers (`backend/controllers/`) handle request flow, validation, and orchestration (DB + service calls).
	- Services (`backend/services/`) encapsulate external integrations (OpenAI) and parsing logic.
	- Benefit: clear separation makes unit testing and swapping implementations easier.

- Synchronous controller flows for small batches
	- The `summarize-emails` endpoint processes mock emails synchronously and inserts each record. This is simple and straightforward for small batches.
	- Trade-off: not suitable for production-scale ingestion. For larger volumes, moving processing to a background queue (BullMQ, RabbitMQ) or serverless functions is recommended.

- Drizzle ORM + Postgres
	- Drizzle provides type-safe schema definitions and SQL generation. The schema is in `backend/drizzle/schema.js`.
	- Migrations are available via `drizzle-kit` (configure and run as needed).

- OpenAI integration
	- The OpenAI call and response parsing live in `backend/services/openaiService.js`.
	- The service attempts to parse category and summary from the model output with several fallbacks; robust parsing may require stricter prompt engineering or structured responses (e.g., JSON) to avoid mis-parsing.

Future improvements

- Add background processing for large batches and rate limit handling.
- Add request validation (e.g., with `zod` or `Joi`) and better error responses.
- Add unit and integration tests for controllers and the OpenAI service.
- Harden parsing by requesting JSON output from the model and validating it before inserting into the DB.
