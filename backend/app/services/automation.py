from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from app.db import SessionLocal
from app.models import Notification

scheduler = BackgroundScheduler()


def _push(title: str, message: str, category: str) -> None:
    db = SessionLocal()
    try:
        db.add(Notification(title=title, message=message, category=category, created_at=datetime.utcnow()))
        db.commit()
    finally:
        db.close()


def weekly_insights() -> None:
    _push("Weekly AI Insights", "5 new startup signals identified from latest logs.", "insights")


def contract_alerts() -> None:
    _push("Contract Risk Alert", "2 newly uploaded contracts have elevated indemnity risk.", "contracts")


def competitor_monitoring() -> None:
    _push("Competitor Monitoring", "A new low-cost competitor entered your target segment.", "competitors")


def startup_suggestions() -> None:
    _push("Idea Suggestions", "Recommendation: prioritize AI-enabled workflow automation ideas.", "startup")


def scheduler_boot() -> None:
    if scheduler.running:
        return
    startup_suggestions()
    weekly_insights()
    scheduler.add_job(weekly_insights, "interval", hours=168)
    scheduler.add_job(contract_alerts, "interval", hours=24)
    scheduler.add_job(competitor_monitoring, "interval", hours=48)
    scheduler.add_job(startup_suggestions, "interval", hours=72)
    scheduler.start()
