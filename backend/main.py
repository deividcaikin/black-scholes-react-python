from fastapi import FastAPI, Depends
from pydantic import BaseModel
import numpy as np
from scipy.stats import norm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Import database setup and models
from database import SessionLocal, BlackScholesCalculation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BlackScholesInput(BaseModel):
    S: float  # Stock price
    K: float  # Strike price
    T: float  # Time to expiration (in years)
    r: float  # Risk-free interest rate
    sigma: float  # Volatility
    q: float  # Dividend yield

def black_scholes(S, K, T, r, sigma, q):
    r = r / 100
    sigma = sigma / 100
    q = q / 100
    d1 = (np.log(S/K) + (r - q + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    call_price = S * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    put_price = K * np.exp(-r * T) * norm.cdf(-d2) - S * np.exp(-q * T) * norm.cdf(-d1)
    return call_price, put_price

@app.post("/calculate")
def calculate_black_scholes(data: BlackScholesInput, db: Session = Depends(get_db)):
    call, put = black_scholes(data.S, data.K, data.T, data.r, data.sigma, data.q)
    print(Session)
    # Store the calculation in the database
    new_calculation = BlackScholesCalculation(
        S=data.S, K=data.K, T=data.T, r=data.r,
        sigma=data.sigma, q=data.q, call_price=call, put_price=put
    )
    db.add(new_calculation)
    db.commit()
    db.refresh(new_calculation)

    return {"call_price": call, "put_price": put}

@app.get("/calculations")
def get_all_calculations(db: Session = Depends(get_db)):
    calculations = db.query(BlackScholesCalculation).all()
    return calculations