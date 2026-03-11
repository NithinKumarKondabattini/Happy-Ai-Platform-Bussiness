# AI Business Intelligence Platform

Production-style full-stack SaaS BI platform with dark analytics UI, FastAPI backend, AI services, and Excel-powered RAG assistant.

## Stack
- Frontend: Next.js, Tailwind CSS, Framer Motion, Recharts, Chart.js, Lucide
- Backend: FastAPI, SQLAlchemy, JWT, APScheduler
- AI Assistant: Excel-powered FAQ + knowledge base
- Database: SQLite by default for demo deployment
- Storage: AWS S3 (fallback to local uploads)

## Features
- Dashboard with analytics cards, interactive charts, widgets, and card-to-page navigation
- Startup Idea Validator
- Contract Risk Analyzer (PDF/DOCX upload + analysis)
- Market Research
- Competitor Analysis
- Business Strategy Generator + downloadable strategy report
- In-page AI Assistant with Excel-sheet RAG context
- Reports downloads (PDF, Excel, CSV)
- Profile page with user activity assets
- Settings with timeline + notifications
- Background automation jobs (insights, risk alerts, competitor monitoring)

## Excel Knowledge Assets
Assistant automatically checks these files in the project root or configured Excel path:
- `Analysis_requests.xlsx` or `Analysis_requests-1.xlsx`
- `StartUp_ideas_DataBase.xlsx`
- `FAQ's for Agent.xlsx`
- `Call_logger_Database.xlsx`
- `Customer_Profile_Database.xlsx`
- `Call_DataBase_Agents.xlsx`

## Local Setup

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

## Local Run

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\NITHIN\OneDrive\Desktop\New folder\start-app.ps1"
```

Open `http://127.0.0.1:3000`

## Live Deployment on Render

This repo is prepared for Render using the root [render.yaml](C:\Users\NITHIN\OneDrive\Desktop\New folder\render.yaml).

### What gets deployed
- `happy-ai-backend`: FastAPI API service
- `happy-ai-frontend`: Next.js web service

### Steps
1. Push this project to GitHub.
2. In Render, create a new Blueprint and select your GitHub repo.
3. Render will detect `render.yaml` and create both services.
4. After deploy finishes, open the frontend service URL.

### Important notes
- `OPENAI_API_KEY` is optional. If blank, the built-in Excel assistant still works.
- Demo data stored in SQLite is suitable for judging/demo use, but it is not durable across rebuilds on free hosting.
- If you want persistent production data later, switch `DATABASE_URL` to managed PostgreSQL.

## Auth
- Signup: `/signup`
- Login: `/login`
