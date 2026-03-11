from app.ai.openai_api import chat_completion, extract_json_object, llm_is_configured


def _report_fallback(report_type: str, user_email: str, startup, contract) -> dict:
    title = report_type.replace("_", " ").title()
    if report_type == "startup_analysis" and startup:
        summary = (
            f"Latest startup analysis for {user_email}: {startup.idea}. Success probability {startup.success_probability}, "
            f"market demand {startup.market_demand}, competition level {startup.competition_level}, profit potential {startup.profit_potential}."
        )
        highlights = [
            f"Industry: {startup.industry}",
            f"Audience: {startup.audience}",
            f"Revenue model: {startup.revenue_model}",
            "Use this report to prioritize validation and GTM next steps.",
        ]
        metrics = [
            {"metric": "success_probability", "value": startup.success_probability},
            {"metric": "market_demand", "value": startup.market_demand},
            {"metric": "competition_level", "value": startup.competition_level},
            {"metric": "profit_potential", "value": startup.profit_potential},
        ]
        return {"title": title, "summary": summary, "highlights": highlights, "metrics": metrics}

    if report_type == "contract_risk" and contract:
        summary = f"Latest contract review for {user_email}: risk score {contract.risk_score}. {contract.summary}"
        highlights = [
            f"File: {contract.file_name}",
            f"Risk score: {contract.risk_score}",
            f"Risky clauses: {contract.risky_clauses}",
            "Review liability and termination sections first.",
        ]
        metrics = [{"metric": "risk_score", "value": contract.risk_score}]
        return {"title": title, "summary": summary, "highlights": highlights, "metrics": metrics}

    summary = f"Generated {title} report for {user_email}."
    highlights = [
        "Use market research to validate segment demand.",
        "Compare 3 to 5 competitors before pricing changes.",
        "Document assumptions behind growth forecasts.",
        "Refresh this report after each major analysis run.",
    ]
    metrics = [{"metric": "report_type", "value": report_type}]
    return {"title": title, "summary": summary, "highlights": highlights, "metrics": metrics}


def build_report_content(report_type: str, user_email: str, startup, contract) -> dict:
    fallback = _report_fallback(report_type, user_email, startup, contract)
    if not llm_is_configured():
        return fallback

    startup_context = fallback["summary"] if startup else "No startup analysis available."
    contract_context = contract.summary if contract else "No contract analysis available."

    try:
        content = chat_completion(
            [
                {"role": "system", "content": "You are a business report generator."},
                {
                    "role": "user",
                    "content": (
                        "Return strict JSON with keys title, summary, highlights(array of 4), metrics(array of metric/value objects). "
                        "Keep the report factual and concise.\n\n"
                        f"Report type: {report_type}\n"
                        f"User: {user_email}\n"
                        f"Startup context: {startup_context}\n"
                        f"Contract context: {contract_context}"
                    ),
                },
            ],
            temperature=0.2,
        )
        parsed = extract_json_object(content)
        if parsed:
            metrics = []
            for item in parsed.get("metrics", []):
                metrics.append(
                    {
                        "metric": str(item.get("metric") or "metric"),
                        "value": str(item.get("value") or "n/a"),
                    }
                )
            return {
                "title": str(parsed.get("title") or fallback["title"]),
                "summary": str(parsed.get("summary") or fallback["summary"]),
                "highlights": [str(item) for item in parsed.get("highlights", [])][:4] or fallback["highlights"],
                "metrics": metrics or fallback["metrics"],
            }
    except Exception:
        pass

    return fallback