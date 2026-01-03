# Form Collector

A small, beginner-friendly Node.js + Express app with a simple static frontend to collect Name + Instagram ID submissions and save them to a text file.

## Features

- Simple form UI (Bootstrap) in [public/index.html](public/index.html)
- Server API in [server.js](server.js) to store entries in `submissions.txt`
- Admin dashboard at `/admin-secret` (password-protected) to view latest 10 entries and total count
- Download all submissions via `/download`

## Files

- [server.js](server.js) — Express server and endpoints
- [public/index.html](public/index.html) — Frontend form and client JS
- [admin.html](admin.html) — Admin dashboard UI (served from `/admin-secret`)
- [.env](.env) — Local environment file (store `ADMIN_PASSWORD` here)
- `submissions.txt` — Generated data file containing all submissions

## Requirements

- Node.js 16+ and npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and set the admin password:

```text
ADMIN_PASSWORD=your_admin_password_here
```

3. Start the server:

```bash
node server.js
```

Server defaults to port `3000`. Visit `http://localhost:3000` for the form.

## Admin access

- Open `http://localhost:3000/admin-secret` to reach the admin dashboard.
- Enter the password you placed in `.env` to view the total submissions and latest 10 entries.
- The admin API used by the dashboard is `GET /admin-data?pw=PASSWORD`.

## Endpoints

- `POST /submit` — receives `name` and `instagram` (form-encoded)
- `GET /admin-data?pw=...` — returns `{ total, latest }` when password matches
- `GET /download` — download `submissions.txt`
- `GET /admin-secret` — serves `admin.html`

## Data & behavior

- Submissions are appended to `submissions.txt` in the project root.
- Duplicate Instagram IDs are rejected server-side.

## Security notes

- Keep `.env` out of version control (add to `.gitignore`).
- This project uses a simple password check for admin access — for production, use proper authentication and HTTPS.

## Quick tips

- If you want an npm shortcut, add a script to `package.json`:

```json
"scripts": {
  "start": "node server.js"
}
```

Then run `npm start`.

---
Created for a small, local form collection project. Modify as needed.