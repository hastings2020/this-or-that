# This or That

A calm, playful web app for lighthearted this-or-that questions. Browse a large question bank, vote with a nickname or a signed-in account, create questions, and share team packs with a group-vs-world dashboard.

## Stack

- **Next.js** (App Router) + React + TypeScript + Tailwind CSS
- **better-sqlite3** (`data/this-or-that.sqlite`)
- **Auth.js (next-auth v5)** — email/password credentials locally; optional GitHub OAuth

## Quick start

```bash
cp .env.example .env.local
# set AUTH_SECRET (required), optionally AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Generate a secret:

```bash
openssl rand -base64 32
```

## Auth

- **Register / sign in** at `/register` and `/signin` (email + password, 8+ chars)
- Display name on the account is used for votes and team packs when signed in
- Anonymous nickname voting still works via `localStorage` until you sign in
- **Optional GitHub OAuth**: set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`, callback `http://localhost:3000/api/auth/callback/github`

Env vars (see `.env.example`):

| Variable | Required | Notes |
|---|---|---|
| `AUTH_SECRET` | yes | Session signing secret |
| `AUTH_URL` | recommended | e.g. `http://localhost:3000` |
| `AUTH_GITHUB_ID` | no | Enables GitHub button when both GitHub vars set |
| `AUTH_GITHUB_SECRET` | no | GitHub OAuth client secret |

## Features

- ~100 seeded playful questions + create your own (2–6 options)
- Vote counts front-and-center on browse
- Team packs at `/teams/new` → share `/t/<code>`
- Group dashboard `/t/<code>/results` (group vs world)

## Reset demo data

Stop the server and delete `data/this-or-that.sqlite` (plus `-wal` / `-shm` if present).
