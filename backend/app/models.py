from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String, Text, ForeignKey
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, nullable=False, index=True)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class StartupAnalysis(Base):
    __tablename__ = "startup_analyses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    idea = Column(Text, nullable=False)
    audience = Column(Text, nullable=False)
    industry = Column(String(120), nullable=False)
    revenue_model = Column(String(120), nullable=False)
    success_probability = Column(Float, default=0)
    market_demand = Column(Float, default=0)
    competition_level = Column(Float, default=0)
    profit_potential = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContractAnalysis(Base):
    __tablename__ = "contract_analyses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    s3_url = Column(String(500), default="")
    summary = Column(Text, default="")
    risk_score = Column(Float, default=0)
    risky_clauses = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_type = Column(String(100), nullable=False)
    file_format = Column(String(20), nullable=False)
    file_path = Column(String(400), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    title = Column(String(180), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(80), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
