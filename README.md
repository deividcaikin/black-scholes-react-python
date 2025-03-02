# Black-Scholes Option Pricing

This project implements the Black-Scholes option pricing model using a FastAPI backend with SQLite and a React frontend with TypeScript.

## Project Structure

```
black-scholes/
│── backend/                     # FastAPI Backend
│   ├── __pycache__/
│   ├── venv/                    # Virtual environment (optional)
│   ├── black_scholes.db         # SQLite database
│   ├── database.py              # Database setup using SQLAlchemy
│   ├── main.py                  # FastAPI app
│
│── black-scholes-frontend/       # React Frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   ├── App.css
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── logo.svg
│   │   ├── setupTests.ts
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│── .gitignore
│── .gitmodules
│── README.md
```

## Prerequisites

Ensure you have the following installed:

- Python 3.8+
- Node.js 16+
- npm or yarn
- Virtual environment (optional, but recommended for backend)

---

## Backend Setup (FastAPI & SQLite)

### 1. Navigate to Backend Folder

```sh
cd backend
```

### 2. Create and Activate Virtual Environment (Optional but Recommended)

```sh
python -m venv venv
source venv/bin/activate  # On MacOS/Linux
venv\Scripts\activate     # On Windows
```

### 3. Install Required Python Packages

```sh
pip install fastapi uvicorn sqlalchemy numpy scipy pydantic
```

### 4. Run the FastAPI Server

```sh
uvicorn main:app --reload
```

Your FastAPI server should now be running at `http://127.0.0.1:8000`.

### 5. API Endpoints

- **POST /calculate** - Takes input parameters and calculates call/put prices, storing the results.
- **GET /calculations** - Fetches all stored calculations.
- **Swagger UI:** View API docs at `http://127.0.0.1:8000/docs`

---

## SQLite3 Usage

This project uses SQLite3 to store calculations. The database file `black_scholes.db` is created and managed using SQLAlchemy.

### Accessing the Database

To open the SQLite database and inspect stored calculations, run:

```sh
sqlite3 black_scholes.db
```

Then, list tables with:

```sql
.tables
```

To view the stored calculations table:

```sql
SELECT * FROM calculations;
```

### Example Table Schema

The `calculations` table stores computed option prices:

```sql
CREATE TABLE calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    option_type TEXT,
    stock_price REAL,
    strike_price REAL,
    time_to_expiration REAL,
    volatility REAL,
    risk_free_rate REAL,
    result_price REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Frontend Setup (React + TypeScript)

### 1. Navigate to Frontend Folder

```sh
cd ../black-scholes-frontend
```

### 2. Install Dependencies

```sh
npm install  # or yarn install
```

### 3. Start the React Development Server

```sh
npm start
```

Your React frontend should now be running at `http://localhost:3000`

---

## Connecting Frontend and Backend

Ensure your FastAPI backend is running on `http://127.0.0.1:8000`, and your frontend API calls (Axios) are correctly pointing to this address. The backend has CORS configured to allow requests from `http://localhost:3000`.

---

## Technologies Used

### Backend

- FastAPI (Python framework)
- SQLite (Database)
- SQLAlchemy (ORM for database interaction)
- NumPy & SciPy (Mathematical computations)
- Uvicorn (ASGI server for FastAPI)

### Frontend

- React (JavaScript framework)
- TypeScript (Strongly typed JavaScript)
- Axios (HTTP client for API requests)

---

## Troubleshooting

### Backend Issues

- If `ModuleNotFoundError`, ensure you activated the virtual environment (`source venv/bin/activate` or `venv\Scripts\activate`)
- If database tables are missing, rerun:

```sh
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Frontend Issues

- If `npm start` fails, try deleting `node_modules` and `package-lock.json`, then reinstall dependencies:

```sh
rm -rf node_modules package-lock.json
npm install
```

---

## Future Enhancements

- Improve UI/UX with better styling
- Implement authentication for API access
- Deploy to cloud services (e.g., AWS, Heroku, Vercel)

---

## Contributors

- Deivid Caikin

Happy Coding! 🚀

