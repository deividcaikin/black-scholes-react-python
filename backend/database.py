from sqlalchemy import create_engine, Column, Float, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
import datetime

DATABASE_URL = "sqlite:///./black_scholes.db"  # Change to PostgreSQL if needed

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # Required for SQLite in FastAPI
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BlackScholesCalculation(Base):
    __tablename__ = "calculations"
    id = Column(Integer, primary_key=True, index=True)
    S = Column(Float)
    K = Column(Float)
    T = Column(Float)
    r = Column(Float)
    sigma = Column(Float)
    q = Column(Float)
    call_price = Column(Float)
    put_price = Column(Float)
    date_created = Column(DateTime, default=datetime.datetime.utcnow) 

# Create tables
Base.metadata.create_all(bind=engine)