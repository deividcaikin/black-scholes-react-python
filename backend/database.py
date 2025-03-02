from sqlalchemy import create_engine, Column, Float, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "sqlite:///./black_scholes.db"  # Change to PostgreSQL if needed

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # Required for SQLite in FastAPI
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BlackScholesCalculation(Base):
    __tablename__ = "calculations"
    id = Column(Integer, primary_key=True, index=True)
    stock_price = Column(Float)
    strike_price = Column(Float)
    time_expiration = Column(Float)
    risk_free_rate = Column(Float)
    volatility = Column(Float)
    dividend_yield = Column(Float)
    call_price = Column(Float)
    put_price = Column(Float)
    date_created = Column(DateTime, default=datetime.datetime.utcnow) 

# Create tables
Base.metadata.create_all(bind=engine)