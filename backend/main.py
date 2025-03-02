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
    stock_price: float  # Stock price
    strike_price: float  # Strike price
    time_expiration: float  # Time to expiration (in years)
    risk_free_rate: float  # Risk-free interest rate
    volatility: float  # Volatility
    dividend_yield: float  # Dividend yield

def black_scholes(stock_price, strike_price, time_expiration, risk_free_rate, volatility, dividend_yield):
    risk_free_rate = risk_free_rate / 100
    volatility = volatility / 100
    dividend_yield = dividend_yield / 100
    d1 = (np.log(stock_price/strike_price) + (risk_free_rate - dividend_yield + 0.5 * volatility**2) * time_expiration) / (volatility * np.sqrt(time_expiration))
    d2 = d1 - volatility * np.sqrt(time_expiration)
    call_price = stock_price * np.exp(-dividend_yield * time_expiration) * norm.cdf(d1) - strike_price * np.exp(-risk_free_rate * time_expiration) * norm.cdf(d2)
    put_price = strike_price * np.exp(-risk_free_rate * time_expiration) * norm.cdf(-d2) - stock_price * np.exp(-dividend_yield * time_expiration) * norm.cdf(-d1)
    return call_price, put_price

@app.post("/calculate")
def calculate_black_scholes(data: BlackScholesInput, db: Session = Depends(get_db)):
    call, put = black_scholes(data.stock_price, data.strike_price, data.time_expiration, data.risk_free_rate, data.volatility, data.dividend_yield)
    print(Session)
    # Store the calculation in the database
    new_calculation = BlackScholesCalculation(
        stock_price=data.stock_price, strike_price=data.strike_price, time_expiration=data.time_expiration, risk_free_rate=data.risk_free_rate,
        volatility=data.volatility, dividend_yield=data.dividend_yield, call_price=call, put_price=put
    )
    db.add(new_calculation)
    db.commit()
    db.refresh(new_calculation)

    return {"call_price": call, "put_price": put}

@app.get("/calculations")
def get_all_calculations(db: Session = Depends(get_db)):
    calculations = db.query(BlackScholesCalculation).order_by(BlackScholesCalculation.date_created.desc()).all()
    return calculations