from app.ai.openai_api import chat_completion, extract_json_object, llm_is_configured


def generate_business_strategy(idea: str) -> dict:
    fallback = {
        "business_plan": "Focus on one painful workflow and ship an automation-first MVP.",
        "marketing_strategy": "Run founder-led content + outbound to 50 target accounts weekly.",
        "revenue_model": "SaaS subscription with tiered pricing and annual discount.",
        "growth_roadmap": [
            "Month 1 - Market validation",
            "Month 2 - MVP development",
            "Month 3 - Beta launch",
            "Month 4 - Customer acquisition",
        ],
    }
    if not llm_is_configured():
        return fallback

    try:
        content = chat_completion(
            [
                {"role": "system", "content": "You are a startup strategy consultant."},
                {
                    "role": "user",
                    "content": (
                        "Return strict JSON with keys business_plan, marketing_strategy, revenue_model, "
                        f"growth_roadmap(array) for this idea: {idea}"
                    ),
                },
            ],
            temperature=0.3,
        )
        parsed = extract_json_object(content)
        return parsed or fallback
    except Exception:
        return fallback