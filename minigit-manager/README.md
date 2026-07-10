# Mini Git Manager

A full-stack educational project that simulates the core Git workflow — repositories, files, staging, commits and version history — without using any real Git library. Built as a college internship project.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, React Router, React Icons, Framer Motion
- **Backend:** Node.js, Express
- **Storage:** Local JSON files (no database)

## Project Structure

```
minigit-manager/
├── backend/
│   ├── routes/         REST route definitions
│   ├── controllers/    Request handlers
│   ├── services/        Business logic (repos, files, staging, commits, history, settings)
│   ├── utils/           JSON file storage + hashing helpers
│   ├── data/             Generated at runtime — one folder per repository
│   └── server.js
└── frontend/
    └── src/
        ├── api/           API service functions (one per module)
        ├── components/    Reusable UI components
        ├── hooks/          Data-fetching hooks per module
        ├── layouts/        Dashboard shell (sidebar + topbar)
        ├── pages/          One page per sidebar item
        ├── store/          React Context: active repo, settings, toasts
        ├── types/          Shared TypeScript interfaces
        └── utils/          Formatting + tree helpers
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm start        # runs on http://localhost:5000
```

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

The frontend dev server proxies all `/api` requests to the backend automatically (see `vite.config.ts`), so just open `http://localhost:5173`.

## How It Works (Viva Notes)

- **Repositories** are tracked in `backend/data/repositories.json`. Each repository gets its own folder under `backend/data/<repoId>/` containing `files.json` (the virtual file tree), `stage.json`, `commits.json`, and `history.json`.
- **Files and folders** are stored as a JSON tree (not real filesystem paths), so the whole project works purely on local JSON — no Git internals, no external Git binary.
- **File status** (untracked / modified / unmodified) is computed by comparing each file's current content hash against the same file's hash in the last commit's snapshot.
- **Staging** just tracks a list of file IDs (`stage.json`) that will be included in the next commit.
- **Commits** take a deep snapshot of the entire file tree at that point in time and store it alongside a short generated hash (like a real commit ID), a message, and a timestamp.
- **Version History / Restore** replaces the current working tree with a past commit's snapshot — similar in spirit to `git checkout`, but simplified so it never deletes newer commits.

## Reset

Settings → **Reset Demo Data** wipes all repositories and starts from a clean slate.
