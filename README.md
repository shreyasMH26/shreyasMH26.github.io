# Portfolio backend (Node/Express)

This repository contains a static frontend (HTML/CSS/JS) and a minimal Node/Express backend scaffold that provides:

- GET /api/projects — returns `data.json` project list
- POST /api/contact — accepts JSON { name, email, message } and either logs the message or sends it via SMTP if configured

Quick start (macOS / zsh):

1. Install dependencies

```bash
npm install
```

2. (Optional) Configure SMTP

Copy `.env.example` to `.env` and fill in your SMTP provider values if you want the server to actually send e-mail via Nodemailer.

3. Run the server

```bash
npm start
# or for development with nodemon
npm run dev
```

4. Open http://localhost:3000 in your browser. The frontend will fetch `/api/projects` and POST contact messages to `/api/contact`.

Deployment notes:
- You can deploy the Node server on platforms like Render, Railway, Heroku, or a VPS.
- Alternatively, keep the frontend on GitHub Pages / Vercel and deploy these endpoints as serverless functions (Vercel, Netlify functions) — adapt `server.js` accordingly.
