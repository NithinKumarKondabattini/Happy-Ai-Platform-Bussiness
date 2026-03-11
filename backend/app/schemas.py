from typing import Any, List
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StartupIdeaRequest(BaseModel):
    idea: str
    target_audience: str
    industry: str
    revenue_model: str


class MarketResearchRequest(BaseModel):
    industry: str


class CompetitorAnalysisRequest(BaseModel):
    idea: str


class StrategyRequest(BaseModel):
    idea: str


class ChatRequest(BaseModel):
    question: str
    history: List[dict[str, Any]] = Field(default_factory=list)
