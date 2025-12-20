# Spur AI Chat Backend

A minimal Express + Prisma backend that powers a chat interface with memory (conversations/messages stored in Postgres) and replies generated using Google Gemini.

## Quickstart: Run Locally (Step‑by‑Step)

Prerequisites:

- Node.js 18+ and npm
- A running PostgreSQL instance
- A Google Gemini API key

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root with your environment variables (see “Environment Variables” below)

```
PORT=your_port
DATABASE_URL= your_url
GEMINI_API_KEY= your_key
```

3. Configure Prisma datasource
   Prisma is already configured via `prisma.config.ts` to read `DATABASE_URL` from your `.env`. You do NOT need to edit `prisma/schema.prisma`. Ensure `.env` contains a valid `DATABASE_URL`.

4. Apply migrations (this will create the tables in your DB)

```bash
npx prisma migrate dev --name init
```
