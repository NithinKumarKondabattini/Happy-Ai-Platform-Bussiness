from app.ai.openai_api import chat_completion, extract_json_object, llm_is_configured


def _startup_context(startup) -> str:
    if not startup:
        return "No startup validation data yet."
    return (
        f"Idea: {startup.idea}; Audience: {startup.audience}; Industry: {startup.industry}; Revenue model: {startup.revenue_model}; "
        f"Success probability: {startup.success_probability}; Market demand: {startup.market_demand}; "
        f"Competition level: {startup.competition_level}; Profit potential: {startup.profit_potential}."
    )


def _contract_context(contract) -> str:
    if not contract:
        return "No contract analysis data yet."
    return (
        f"File: {contract.file_name}; Risk score: {contract.risk_score}; Summary: {contract.summary}; "
        f"Risky clauses: {contract.risky_clauses}."
    )


def generate_dashboard_widgets(startup, contract, notifications: list) -> dict:
    fallback = {
        "weekly_insights": [
            "Customer pain around manual reporting is increasing.",
            "Contracts with broad indemnity terms increased this week.",
            "AI workflow startups show strongest demand momentum.",
        ],
        "recent_analyses": [
            "Startup idea validation completed",
            "Contract review completed",
            "Market research generated",
        ],
        "recommendations": [
            "Prioritize faster onboarding.",
            "Reduce legal exposure in termination clauses.",
            "Test pricing in two-tier plan.",
        ],
    }
    if not llm_is_configured():
        return fallback

    notification_text = "; ".join(f"{item.title}: {item.message}" for item in notifications[:5]) or "No notifications yet."

    try:
        content = chat_completion(
            [
                {"role": "system", "content": "You are an executive BI copilot."},
                {
                    "role": "user",
                    "content": (
                        "Return strict JSON with keys weekly_insights(array of 3), recent_analyses(array of 3), "
                        "recommendations(array of 3). Base the output only on this context.\n\n"
                        f"Startup context: {_startup_context(startup)}\n"
                        f"Contract context: {_contract_context(contract)}\n"
                        f"Notifications: {notification_text}"
                    ),
                },
            ],
            temperature=0.2,
        )
        parsed = extract_json_object(content)
        if parsed:
            return {
                "weekly_insights": [str(item) for item in parsed.get("weekly_insights", [])][:3] or fallback["weekly_insights"],
                "recent_analyses": [str(item) for item in parsed.get("recent_analyses", [])][:3] or fallback["recent_analyses"],
                "recommendations": [str(item) for item in parsed.get("recommendations", [])][:3] or fallback["recommendations"],
            }
    except Exception:
        pass

    return fallback