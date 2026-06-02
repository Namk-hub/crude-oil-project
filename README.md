# 🛢️ India Oil Risk Dashboard

A full-stack application for monitoring **crude oil supply risks** and **geopolitical threats** to India's energy security. The dashboard surfaces real-time news, sentiment analysis, country-level risk scores, oil price trends, and scenario simulations.

---

## ⚙️ Prerequisites

* **Python 3.12+**
* **Node.js 18+** (with npm)
* **PostgreSQL 15+**
* **Git**

---

## 🚀 Local Setup (Windows)

To run the application locally, open **two separate terminal windows** (PowerShell or CMD) to host the backend and frontend services.

### 1. Database Setup
Create a new database in PostgreSQL named `india_oil_risk` using pgAdmin or the SQL Shell (`psql`):
```sql
CREATE DATABASE india_oil_risk;
```

### 2. Backend Setup (Terminal 1)
Navigate to the backend folder, configure environments, migrate the database, and start the FastAPI server:

```powershell
# Go to backend directory
cd backend

# Create & activate virtual environment
python -m venv .venv
# For PowerShell:
.\.venv\Scripts\Activate.ps1
# For CMD:
.\.venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
copy .env.example .env

# Run database migrations & seed sample data
alembic upgrade head
python -m scripts.seed

# Start uvicorn server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
> 💡 *Note: Open `.env` and replace `YOUR_PASSWORD` in the `DATABASE_URL` with your local PostgreSQL password. You can also optionally add a `NEWSAPI_KEY` for live news updates.*

* **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

### 3. Frontend Setup (Terminal 2)
In a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```powershell
# Go to frontend directory
cd frontend

# Install node dependencies
npm install

# Start local server
npm run dev
```

* **Dashboard Web App:** [http://localhost:8080/](http://localhost:8080/)

---

## 🐳 Docker Setup (Alternative)

To launch the backend and database automatically inside Docker:

```powershell
# Start backend and PostgreSQL container
cd backend
docker-compose up --build

# In a separate terminal, launch the frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Directory Layout

* **`backend/`**: FastAPI backend (routers, schemas, ORM models, and database migration scripts).
* **`frontend/`**: React (TypeScript) & TanStack Start frontend (UI widgets, charts, and API clients).