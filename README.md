# 🛢️ India Oil Risk Dashboard

A full-stack application for monitoring **crude oil supply risks** and **geopolitical threats** to India's energy security. The dashboard surfaces real-time news, sentiment analysis, country-level risk scores, oil price trends, and scenario simulations.

---

## 📁 Project Structure

```
crude oil/
├── backend/                         # FastAPI backend (Python)
│   └── New/
│       ├── app/
│       │   ├── main.py              # Application entry point & CORS setup
│       │   ├── config.py            # Settings (env vars via pydantic-settings)
│       │   ├── database.py          # SQLAlchemy engine & session
│       │   ├── models/              # SQLAlchemy ORM models
│       │   │   ├── country.py
│       │   │   ├── news_article.py
│       │   │   ├── oil_price.py
│       │   │   ├── risk_score.py
│       │   │   └── simulation.py
│       │   ├── routers/             # FastAPI route handlers
│       │   │   ├── countries.py
│       │   │   ├── dashboard.py
│       │   │   ├── news.py
│       │   │   ├── oil_prices.py
│       │   │   ├── risk_scores.py
│       │   │   └── simulate.py
│       │   ├── schemas/             # Pydantic request/response schemas
│       │   │   ├── country.py
│       │   │   ├── dashboard.py
│       │   │   ├── news_article.py
│       │   │   ├── oil_price.py
│       │   │   ├── risk_score.py
│       │   │   └── simulation.py
│       │   └── services/            # Business logic & external integrations
│       │       ├── news_ingestion.py
│       │       ├── newsapi_client.py
│       │       ├── risk_engine.py
│       │       ├── sentiment_analyzer.py
│       │       ├── simulation.py
│       │       └── simulation_engine.py
│       ├── alembic/                 # Database migrations
│       │   ├── env.py
│       │   └── versions/
│       │       ├── 001_initial_schema.py
│       │       └── 002_add_news_url_keyword.py
│       ├── scripts/
│       │   ├── entrypoint.sh        # Docker entrypoint (migrate + seed + run)
│       │   ├── seed.py              # Database seed script
│       │   └── seed_data.sql        # Raw SQL seed data
│       ├── .env.example             # Environment variable template
│       ├── alembic.ini              # Alembic configuration
│       ├── docker-compose.yml       # Docker Compose (Postgres + API)
│       ├── Dockerfile               # Backend container image
│       └── requirements.txt         # Python dependencies
│
├── frontend/                        # React frontend (TypeScript)
│   └── tizz/
│       └── nation-fuel/
│           ├── src/
│           │   ├── components/      # React components
│           │   │   ├── AppLayout.tsx
│           │   │   ├── RiskWorldMap.tsx
│           │   │   └── ui/          # shadcn/ui component library (45 components)
│           │   ├── hooks/           # Custom React hooks
│           │   │   └── use-mobile.tsx
│           │   ├── lib/             # API clients & utilities
│           │   │   ├── api.ts           # News & risk score APIs
│           │   │   ├── dashboard-api.ts # Dashboard aggregate API
│           │   │   ├── insights-api.ts  # AI insights API
│           │   │   ├── risk-api.ts      # Risk scores API
│           │   │   ├── simulation-api.ts# Simulation API
│           │   │   ├── mock-data.ts     # Fallback/mock data
│           │   │   └── utils.ts         # Shared utilities
│           │   ├── routes/          # TanStack Router file-based routes
│           │   │   ├── __root.tsx       # Root layout
│           │   │   ├── index.tsx        # Dashboard (home page)
│           │   │   ├── country-risk.tsx # Country risk details
│           │   │   └── simulator.tsx    # Scenario simulator
│           │   ├── router.tsx       # Router configuration
│           │   └── styles.css       # Global CSS (Tailwind v4)
│           ├── package.json         # Node.js dependencies & scripts
│           ├── vite.config.ts       # Vite + TanStack Start configuration
│           ├── tsconfig.json        # TypeScript configuration
│           ├── eslint.config.js     # ESLint configuration
│           └── components.json      # shadcn/ui component config
│
└── README.md                        # ← You are here
```

---

## ⚙️ Prerequisites

| Tool           | Version  | Purpose                          |
| -------------- | -------- | -------------------------------- |
| **Python**     | 3.12+    | Backend runtime                  |
| **Node.js**    | 18+      | Frontend runtime                 |
| **npm**        | 9+       | Frontend package manager         |
| **PostgreSQL** | 15+      | Database (or use Docker Compose) |
| **Git**        | any      | Version control                  |

> **Tip:** If you have Docker & Docker Compose installed, you can skip the PostgreSQL manual install — the `docker-compose.yml` spins up a Postgres container automatically.

---

## 🚀 Running on Localhost

### Option A — Run Everything Manually

#### 1. Start PostgreSQL

Make sure PostgreSQL is running on `localhost:5432`. Create the database:

```sql
CREATE DATABASE india_oil_risk;
```

#### 2. Set Up the Backend

```bash
# Navigate to the backend directory
cd backend/New

# Create and activate a virtual environment
python -m venv .venv

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# Windows (CMD)
.\.venv\Scripts\activate.bat

# macOS/Linux
source .venv/bin/activate
```

```bash
# Install Python dependencies
pip install -r requirements.txt
```

```bash
# Create your .env file from the template
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux
```

Edit `.env` and update the values as needed:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/india_oil_risk
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
NEWSAPI_KEY=your_newsapi_key_here
NEWS_FETCH_ON_STARTUP=true
```

> **Note:** Get a free API key from [https://newsapi.org](https://newsapi.org) for live news fetching. The app will still work without it — it just won't auto-fetch news on startup.

```bash
# Run database migrations
alembic upgrade head

# Seed the database with sample data
python -m scripts.seed
```

```bash
# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend is now live at:** [http://localhost:8000](http://localhost:8000)

- **API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

#### 3. Set Up the Frontend

Open a **new terminal window**:

```bash
# Navigate to the frontend directory
cd frontend/tizz/nation-fuel

# Install Node.js dependencies
npm install
```

```bash
# Start the development server
npm run dev
```

✅ **Frontend is now live at:** [http://localhost:5173](http://localhost:5173) (Vite default port)

---

### Option B — Use Docker Compose (Backend + Database Only)

```bash
cd backend/New

# Start Postgres + API containers
docker-compose up --build
```

This will:
1. Start a **PostgreSQL 16** container on port `5432`
2. Run **Alembic migrations** automatically
3. **Seed** the database with sample data
4. Start the **FastAPI server** on port `8000`

Then start the frontend separately:

```bash
cd frontend/tizz/nation-fuel
npm install
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/health`                | Health check                     |
| GET    | `/dashboard`             | Aggregated dashboard data        |
| GET    | `/oil-prices`            | Historical Brent crude prices    |
| GET    | `/countries`             | Supplier countries & import share|
| GET    | `/risk-scores?limit=100` | Country-level risk scores        |
| GET    | `/news?limit=50`         | Latest oil-related news articles |
| POST   | `/simulate`              | Run a scenario simulation        |

---

## 🧩 Tech Stack

### Backend
- **FastAPI** — High-performance async Python web framework
- **SQLAlchemy 2.0** — ORM with PostgreSQL
- **Alembic** — Database migrations
- **Pydantic v2** — Data validation & serialization
- **VADER Sentiment** — News sentiment analysis
- **NewsAPI** — External news data ingestion
- **Docker** — Containerisation

### Frontend
- **React 19** — UI library
- **TypeScript** — Type safety
- **TanStack Router** — File-based routing
- **TanStack Query** — Server state management
- **Vite 7** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **Recharts** — Charts & data visualisation
- **shadcn/ui** — Pre-built UI component library
- **Lucide React** — Icons

---

## 🛠️ Troubleshooting

| Problem                                   | Solution                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `psycopg2` install fails on Windows       | Install `pip install psycopg2-binary` or install [PostgreSQL dev libs](https://www.postgresql.org/download/windows/) |
| Frontend shows "Failed to fetch" errors   | Ensure the backend is running on `http://127.0.0.1:8000`                                  |
| Database connection refused               | Check PostgreSQL is running and `DATABASE_URL` in `.env` is correct                       |
| Alembic "Target database is not up to date"| Run `alembic upgrade head`                                                               |
| Port 8000 already in use                  | Kill the existing process or change `APP_PORT` in `.env`                                  |
| Port 5173 already in use                  | Vite will auto-pick the next available port — check the terminal output                   |
| News not loading                          | Verify your `NEWSAPI_KEY` is valid, or run `python -m scripts.seed` for sample data       |

---

## 📝 Notes

- The frontend API clients (in `src/lib/*.ts`) are hard-coded to call `http://127.0.0.1:8000`. If you change the backend port, update these files accordingly.
- The backend enables **CORS for all origins** (`allow_origins=["*"]`) — suitable for development but should be restricted in production.
- The `docker-compose.yml` uses default PostgreSQL credentials (`postgres:postgres`) — change these for any non-local deployment.
#   c r u d e - o i l - p r o j e c t  
 