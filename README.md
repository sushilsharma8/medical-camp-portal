# Medical Camp Registration Portal

A full-stack web application that lets people browse upcoming medical camps
and register for one, and lets camp staff manage registrations through an
admin dashboard.

---

## 1. Project Overview

The Medical Camp Registration Portal is an end-to-end application:

- Visitors can view a list of medical camps, open a camp's details page, and
  register through a validated form.
- On successful registration, the visitor gets a unique **Registration ID**
  (e.g. `MC-2026-4815`) and a confirmation screen.
- Admin staff can view stats, browse all registrations in a table, and
  **view / edit / delete** any registration.

The frontend and backend are fully wired together — this is not a static
mockup. Every button and form on the frontend calls a real FastAPI endpoint
backed by a MySQL database.

---

## 2. Features

- Home, Camps, Camp Details, Register, Contact, and Admin pages with working
  navigation (React Router)
- Camp listing with cards (name, date, location, description, services)
- Registration form with full client-side **and** server-side validation
- Auto-generated, unique registration IDs
- Registration confirmation screen showing the camp and submitted details
- Admin dashboard: total camps, total registrations, recent registrations,
  full registration table with View / Edit / Delete (with a confirmation
  dialog before deleting)
- Centralized error handling on both client and server (missing fields,
  invalid input, camp/registration not found, database errors)
- Responsive, mobile-friendly UI with loading, empty, and error states

---

## 3. Technology Stack

**Frontend:** React 18, React Router 6, Axios, Vite
**Backend:** Python, FastAPI, Pydantic v2
**Database:** MySQL, SQLAlchemy ORM (PyMySQL driver)

---

## 4. Folder Structure

```
medical-camp-portal/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, exception handlers
│   │   ├── database.py        # SQLAlchemy engine/session (reads DATABASE_URL)
│   │   ├── models.py          # Camp, Registration ORM models
│   │   ├── schemas.py         # Pydantic request/response schemas + validation
│   │   ├── crud.py            # DB access functions
│   │   └── routes/
│   │       ├── camps.py
│   │       └── registrations.py
│   ├── seed.py                 # Populates the 4 sample camps
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CampCard, States (loading/error/empty/toast)
│   │   ├── pages/               # Home, Camps, CampDetails, Register, RegistrationSuccess, Contact, Admin, NotFound
│   │   ├── services/api.js      # Axios client + error normalization (relative /api)
│   │   ├── App.jsx              # Route definitions
│   │   ├── main.jsx
│   │   └── index.css            # Design system (colors, type, components)
│   ├── index.html
│   └── package.json
├── .env.example                 # Backend environment variables
├── vercel.json                  # Vercel Services: frontend + backend
└── README.md
```

---

## 5. Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- MySQL Server 8.0+ (or MariaDB) installed and running

---

## 6. MySQL Database Setup

Open a MySQL shell (`mysql -u root -p`) and run:

```sql
CREATE DATABASE medical_camp_db CHARACTER SET utf8mb4;
```

That's it — the application creates the `camps` and `registrations` tables
automatically on first run (via SQLAlchemy's `create_all`). No manual
`CREATE TABLE` statements are required, but for reference, the tables are:

```sql
-- camps
id INT PRIMARY KEY AUTO_INCREMENT
name VARCHAR(150) NOT NULL
date DATE NOT NULL
location VARCHAR(150) NOT NULL
description TEXT NOT NULL
services VARCHAR(500) NOT NULL   -- comma-separated list
created_at DATETIME

-- registrations
id INT PRIMARY KEY AUTO_INCREMENT
registration_id VARCHAR(30) UNIQUE NOT NULL
full_name VARCHAR(150) NOT NULL
age INT NOT NULL
gender VARCHAR(20) NOT NULL
contact_number VARCHAR(20) NOT NULL
email VARCHAR(150) NOT NULL
address VARCHAR(300) NOT NULL
camp_id INT NOT NULL REFERENCES camps(id)
preferred_time VARCHAR(50)
health_concern TEXT
created_at DATETIME
```

---

## 7. Backend Installation

### macOS / Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
# edit .env and set your real MySQL password
```

### Windows (Command Prompt)

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
:: edit .env and set your real MySQL password
```

Edit `backend/.env`:

```
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/medical_camp_db
```

`FRONTEND_ORIGIN` is optional. The Vite dev server proxies `/api` to port 8000, so the browser stays same-origin and CORS is not involved. Set `FRONTEND_ORIGIN` only if a page on another origin calls the API directly.

Seed the sample camps (run once):

```bash
python seed.py
```

> Note: if `DATABASE_URL` is not set at all, the backend falls back to a
> local SQLite file (`medical_camp.db`) so you can smoke-test the API
> without MySQL installed. On Vercel that fallback file is
> `/tmp/medical_camp.db` and does not persist. For the real project, always
> set `DATABASE_URL` to a MySQL connection string the runtime can reach.

---

## 8. Frontend Installation

```bash
cd frontend
npm install
```

No frontend `.env` is required. The client calls relative `/api` paths. `npm run dev` proxies those to `http://localhost:8000`. Set `VITE_API_URL` only when the API is on a different host (the value is inlined at build time).

---

## 9. Environment Variables

| Location | Variable | Purpose |
|---|---|---|
| `backend/.env` or Vercel | `DATABASE_URL` | MySQL connection string. Required for a real deployment. |
| `backend/.env` or Vercel | `FRONTEND_ORIGIN` | Optional. Comma-separated CORS origins when the browser calls the API cross-origin. |
| `frontend/.env` | `VITE_API_URL` | Optional. Absolute API origin, baked in at build time. Leave unset on Vercel. |

Never commit real `.env` files — only `.env.example` is checked in.

---

## 10. Deploy on Vercel

This repo is one Vercel project with two [services](https://vercel.com/docs/services) (Beta):

| Service | Root | Framework | Public path |
|---|---|---|---|
| `frontend` | `frontend` | Vite | `/` (everything except `/api`) |
| `backend` | `backend` | FastAPI (`app.main:app`) | `/api/*` |

Neither service is internal. There is no service binding: the React app calls the API from the browser, and bindings are injected only into server functions at runtime. FastAPI routes already use the `/api` prefix, which matches the public rewrite, so the path is not stripped.

Set `DATABASE_URL` on the Vercel project to a MySQL server that Vercel can reach (not `localhost`). Tables are created on startup or on the first request. Sample camps are not inserted automatically; from a machine that can reach that database, run `python seed.py` in `backend/` with the same `DATABASE_URL`.

Do not set `VITE_API_URL` for the Vercel deployment. Preview and production both call relative `/api` on their own host.

## 11. How to Run the Backend

```bash
cd backend
# macOS/Linux: source venv/bin/activate
# Windows:     venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`, and interactive docs
(Swagger UI) at `http://localhost:8000/docs`.

---

## 12. How to Run the Frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

For a production build:

```bash
npm run build
npm run preview
```

---

## 13. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/camps` | List all camps |
| GET | `/api/camps/{id}` | Get a single camp |
| POST | `/api/camps` | Create a camp (utility endpoint) |
| POST | `/api/registrations` | Create a registration |
| GET | `/api/registrations` | List all registrations |
| GET | `/api/registrations/{id}` | Get a single registration |
| PUT | `/api/registrations/{id}` | Update a registration |
| DELETE | `/api/registrations/{id}` | Delete a registration |
| GET | `/api/health` | Health check |

---

## 14. Sample API Requests

**Create a registration**

```bash
curl -X POST http://localhost:8000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Rohan Sharma",
    "age": 34,
    "gender": "Male",
    "contact_number": "9876543210",
    "email": "rohan@example.com",
    "address": "House 12, Sector 22, Chandigarh",
    "camp_id": 1,
    "preferred_time": "Morning",
    "health_concern": "General checkup"
  }'
```

Response (`201 Created`):

```json
{
  "id": 1,
  "registration_id": "MC-2026-4815",
  "full_name": "Rohan Sharma",
  "age": 34,
  "camp_id": 1,
  "camp": { "id": 1, "name": "General Health Checkup Camp", "...": "..." },
  "...": "..."
}
```

**Invalid input** (missing name, bad age, bad email) returns `422` with
field-level errors:

```json
{
  "detail": "Validation failed",
  "errors": [
    { "field": "full_name", "message": "Value error, Full name cannot be empty" },
    { "field": "age", "message": "Value error, Age must be a valid positive number" },
    { "field": "email", "message": "value is not a valid email address..." }
  ]
}
```

---

## 15. Testing the Complete Registration Flow

1. Start MySQL, then the backend (`uvicorn app.main:app --reload`), then run
   `python seed.py` once to load the 4 sample camps.
2. Start the frontend (`npm run dev`) and open `http://localhost:5173`.
3. On the Home page, click **View Camps**.
4. Click **View Details** on any camp to see its full description and
   services, or click **Register Now** directly.
5. Fill in the registration form. Try submitting with an empty name, a
   negative age, or an invalid email first — you should see inline field
   errors and the form should refuse to submit.
6. Correct the fields and submit. You'll land on a **Registration
   Successful** screen with your Registration ID and camp summary.
7. Go to **Admin** in the navbar. You should see the updated total
   registrations count and your new entry in the table.
8. Click **View** to see full details, **Edit** to change a field and save,
   or **Delete** to remove it (a confirmation dialog appears first).

This flow was verified end-to-end against the FastAPI backend during
development (camp listing, camp details, registration creation with both
valid and invalid data, listing, updating, and deleting registrations all
return the expected responses and status codes).

---

## 16. User-to-Admin Flow Summary

```
Home → View Camps → Camp Details → Register Now → Registration Form
  → Client-side validation → POST /api/registrations → MySQL insert
  → Registration Confirmation (Registration ID shown)
  → Admin Dashboard → GET /api/registrations (table, stats)
  → View / Edit (PUT) / Delete (DELETE) a registration
```

Every step calls a real API endpoint — there are no fake buttons or
non-functional links. Validation runs first in the browser for fast
feedback, and again on the server (Pydantic) so bad data can never reach
the database, no matter what submits the request.
