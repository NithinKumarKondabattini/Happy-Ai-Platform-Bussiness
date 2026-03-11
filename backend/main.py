from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import Base, engine
from app.api.routes import router
from app.services.automation import scheduler_boot

app = FastAPI(title="AI Business Intelligence Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    scheduler_boot()


@app.get("/")
def root() -> dict:
    return {"status": "ok", "service": "ai-bi-platform"}
