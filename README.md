# Pirnav

React/Vite frontend at the repo root and an Express backend in `backend/`.

## Setup

1. Copy `.env.example` to `.env` if you want custom frontend dev values.
2. Copy `backend/.env.example` to `backend/.env` and configure admin, JWT, and SMTP values.
3. Install dependencies:
   `npm install`
   `cd backend && npm install`
4. Start the backend:
   `cd backend && npm run start`
5. Start the frontend:
   `npm run dev`

The Vite dev server proxies `/api` requests to `VITE_API_PROXY_TARGET`, so the frontend stays on relative API paths in development and production.

## Environment

Frontend `.env`:
- `VITE_API_BASE_URL`
- `VITE_API_PROXY_TARGET`
- `VITE_DEFAULT_INTERVIEW_MANAGER_ID`

Backend `backend/.env`:
- `PORT`
- `FRONTEND_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_PASSWORD_HASH`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `EMAIL_SECURE`

## Email Workflows

`POST /api/admin/shortlist`
- updates the candidate status to `Shortlisted`
- sends an email with the candidate name, shortlisted status, and next steps

`POST /api/admin/schedule-interview`
- schedules the interview in the backend
- sends an email with the interview date, time, mode, and instructions

If SMTP variables are not configured, the backend falls back to Nodemailer's stream transport so the full workflow still works in local development.

## Docker

Start both services with:

```bash
docker compose up --build
```

Services:
- frontend: `http://localhost:5000`
- backend: `http://localhost:5001`

The nginx container serves the built frontend and proxies `/api` requests to the backend container.

## Notes

- Admin routes are protected with JWT middleware.
- Backend validation is handled with Zod.
- Candidate, job, contact, and interview data live in `backend/src/data/`.
- Local resume fixtures live in `backend/storage/resumes/`.
