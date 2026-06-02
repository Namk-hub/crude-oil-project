# 🛢️ India Oil Risk Dashboard

A full-stack application for monitoring **crude oil supply risks** and **geopolitical threats** to India's energy security. The dashboard surfaces real-time news, sentiment analysis, country-level risk scores, oil price trends, and scenario simulations.

Designed with a premium dark cyber aesthetic, it integrates a **FastAPI** backend with a **React (TypeScript) & TanStack Start** frontend.

---

## 💻 Beginner's Guide: Running on Localhost (Windows)

This guide is designed for beginners. We'll walk you through setting up everything step-by-step on **Windows** using either the manual setup (recommended for development) or Docker.

---

### 🛠️ Prerequisites (What you need to install first)

Before running the application, make sure you have the following installed on your Windows PC:

1. **Python (version 3.12 or newer)**
   - 📥 [Download Python](https://www.python.org/downloads/)
   - ⚠️ **CRITICAL:** During installation, make sure to check the box that says **"Add python.exe to PATH"** at the bottom of the installer window!

2. **Node.js (version 18 or newer)**
   - 📥 [Download Node.js](https://nodejs.org/) (Choose the **LTS** version).
   - This installs `node`, `npm`, and all the tools needed to run the frontend.

3. **PostgreSQL Database (version 15 or newer)**
   - 📥 [Download PostgreSQL](https://www.postgresql.org/download/windows/)
   - Follow the installer and **remember the password** you set for the default `postgres` user. You will also get **pgAdmin 4** (a visual tool to manage your database), which is highly recommended!

4. **Git**
   - 📥 [Download Git for Windows](https://git-scm.com/download/win)
   - Used for cloning and managing your code repository.

---

### 🚀 Manual Setup Step-by-Step

To run the application, we will open **two separate terminal windows**: one for the **Backend (Python)** and one for the **Frontend (Node.js)**.

#### 🗄️ Step 1: Create the Database
Before running any code, we need a database for Python to connect to:
1. Open **pgAdmin 4** (search for it in your Windows Start menu).
2. Enter your master password to unlock it.
3. In the left sidebar, double-click on **Servers** -> **PostgreSQL [version]** (it will ask for your Postgres password).
4. Right-click on **Databases** -> **Create** -> **Database...**
5. Type `india_oil_risk` as the database name and click **Save**.

---

#### 🐍 Step 2: Run the Backend (Terminal 1)
Open a terminal (we recommend **PowerShell** or **Command Prompt**). Navigate to your project folder:

1. **Navigate to the Backend code directory:**
   ```powershell
   cd backend/New
   ```

2. **Create a virtual Python environment:**
   This keeps Python packages isolated to this project.
   ```powershell
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   * **If using PowerShell:**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
     *(If you get a permission error saying script execution is disabled, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` and try again).*
   * **If using Command Prompt (CMD):**
     ```cmd
     .\.venv\Scripts\activate.bat
     ```

4. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Set up your environment variables:**
   Copy the example file to make your official environment file:
   ```powershell
   copy .env.example .env
   ```

6. **Configure your Database Password:**
   Open the newly created `.env` file in your text editor (VS Code, Notepad, etc.) and look for this line:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/india_oil_risk
   ```
   Replace `YOUR_PASSWORD` with the password you set during the PostgreSQL database installation.
   
   > **Note:** If you want live news to update, get a free API key from [NewsAPI](https://newsapi.org) and add it to `NEWSAPI_KEY=your_key_here`. If not, the application will automatically fallback to high-quality mock/pre-seeded news!

7. **Run Database Migrations & Seed Default Data:**
   Let's create the tables and seed them with oil price, supplier countries, and simulated risk data!
   ```powershell
   # Create tables
   alembic upgrade head

   # Seed default data
   python -m scripts.seed
   ```

8. **Start the Backend Server:**
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   🎉 **Your Backend is now running!**
   * Keep this terminal window open.
   * You can open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to view the interactive API playground (Swagger UI).

---

#### 💻 Step 3: Run the Frontend (Terminal 2)
Now, open a **brand new** terminal window so the backend keeps running in the background.

1. **Navigate to the Frontend code directory:**
   ```powershell
   cd frontend/tizz/nation-fuel
   ```

2. **Install Node dependencies:**
   ```powershell
   npm install
   ```

3. **Start the Frontend development server:**
   ```powershell
   npm run dev
   ```

🎉 **Your Frontend is now live!**
- Open your web browser and go to: **[http://localhost:8080/](http://localhost:8080/)**
- You should see the fully interactive **India Oil Risk Dashboard** loaded and talking to your backend!

---

## 🐳 Alternative Setup: Using Docker (Fast & Self-Contained)

If you have **Docker Desktop** installed on Windows, you don't need to manually configure Python or PostgreSQL! Docker handles them automatically in containers.

1. Open your terminal in the backend directory:
   ```powershell
   cd backend/New
   ```
2. Build and start the backend + database containers:
   ```powershell
   docker-compose up --build
   ```
   *(This automatically creates the Postgres database, runs database migrations, seeds the default data, and launches the backend on port `8000`)*.
3. Open a **second terminal** and start the frontend:
   ```powershell
   cd frontend/tizz/nation-fuel
   npm install
   npm run dev
   ```
4. Access the dashboard at **[http://localhost:8080/](http://localhost:8080/)**.

---

## 📁 Project Directory Map

* **`backend/New/`**: The Python FastAPI app.
  * `app/main.py`: Entry point, hooks up routers, and enables CORS so frontend can communicate.
  * `app/routers/`: Individual API endpoints (News, Countries, Oil Prices, Scenario Simulations).
  * `app/services/risk_engine.py`: Logic calculating country risk factors.
  * `scripts/seed.py`: Loads initial historical data into your database.
* **`frontend/tizz/nation-fuel/`**: The React Vite application.
  * `src/components/`: Visually stunning UI cards, graphs, and maps (designed using `shadcn/ui` and `recharts`).
  * `src/routes/`: Main pages including the dashboard homepage (`index.tsx`), country profiles, and the scenario simulator.
  * `src/lib/api.ts`: API clients that query the FastAPI backend.

---

## 🛠️ Windows Troubleshooting & Tips

### ❌ Error: "Script execution is disabled on this system"
If PowerShell blocks you from running `Activate.ps1`, open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```
Then close and reopen your terminal and try activating again.

### ❌ Error: "psycopg2 install fails"
If `pip install` fails on compiling `psycopg2`, make sure you have the Visual Studio build tools installed, or install the pre-compiled version of the library:
```powershell
pip install psycopg2-binary
```

### ❌ Frontend shows empty charts or "Failed to Fetch"
Make sure your backend is running at `http://localhost:8000`. You can test if the backend is alive by visiting [http://localhost:8000/health](http://localhost:8000/health) in your browser. It should return `{"status":"healthy"}`.

### 🔌 Port Conflict Error
If port `8000` is already in use by another app, you can change `APP_PORT=8000` inside your `.env` file to a different port (like `APP_PORT=8001`) and restart uvicorn. Note: if you change the backend port, update the API client config in the frontend files (e.g., `frontend/tizz/nation-fuel/src/lib/api.ts`).