Black-Scholes Option Pricing

This project implements the Black-Scholes option pricing model using a FastAPI backend with SQLite and a React frontend with TypeScript.

Project Structure

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
│   ├── README.md                  # Project documentation
│── .gitignore
│── .gitmodules
│── README.md

Prerequisites

Ensure you have the following installed:

Python 3.8+

Node.js 16+

npm or yarn

Virtual environment (optional, but recommended for backend)

Backend Setup (FastAPI & SQLite)

1. Navigate to Backend Folder

cd backend

2. Create and Activate Virtual Environment (Optional but Recommended)

python -m venv venv
source venv/bin/activate  # On MacOS/Linux
venv\Scripts\activate     # On Windows

3. Install Required Python Packages

pip install fastapi uvicorn sqlalchemy numpy scipy pydantic

4. Run the FastAPI Server

uvicorn main:app --reload

Your FastAPI server should now be running at http://127.0.0.1:8000.

5. API Endpoints

POST /calculate - Takes input parameters and calculates call/put prices, storing the results.

GET /calculations - Fetches all stored calculations.

Swagger UI: View API docs at http://127.0.0.1:8000/docs

Frontend Setup (React + TypeScript)

1. Navigate to Frontend Folder

cd ../black-scholes-frontend

2. Install Dependencies

npm install  # or yarn install

3. Start the React Development Server

npm start

Your React frontend should now be running at http://localhost:3000

Connecting Frontend and Backend

Ensure your FastAPI backend is running on http://127.0.0.1:8000, and your frontend API calls (Axios) are correctly pointing to this address. The backend has CORS configured to allow requests from http://localhost:3000.

Technologies Used

Backend

FastAPI (Python framework)

SQLite (Database)

SQLAlchemy (ORM for database interaction)

NumPy & SciPy (Mathematical computations)

Uvicorn (ASGI server for FastAPI)

Frontend

React (JavaScript framework)

TypeScript (Strongly typed JavaScript)

Axios (HTTP client for API requests)

Troubleshooting

Backend Issues

If ModuleNotFoundError, ensure you activated the virtual environment (source venv/bin/activate or venv\Scripts\activate)

If database tables are missing, rerun:

python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"

Frontend Issues

If npm start fails, try deleting node_modules and package-lock.json, then reinstall dependencies:

rm -rf node_modules package-lock.json
npm install

Future Enhancements

Improve UI/UX with better styling

Implement authentication for API access

Deploy to cloud services (e.g., AWS, Heroku, Vercel)

Contributors

Your Name

Happy Coding! 🚀