from app.ai.openai_api import chat_completion, extract_json_object, llm_is_configured


def generate_market_research(industry: str) -> dict:
    baseline = max(40, min(95, 55 + len(industry) % 25))
    fallback = {
        "market_size": f"${baseline * 2}B",
        "industry_growth": f"{baseline / 8:.1f}% CAGR",
        "customer_segments": ["SMBs", "Mid-market", "Enterprise"],
        "demand_forecast": [
            {"month": "Jan", "demand": baseline - 8},
            {"month": "Feb", "demand": baseline - 3},
            {"month": "Mar", "demand": baseline + 2},
            {"month": "Apr", "demand": baseline + 6},
            {"month": "May", "demand": baseline + 9},
        ],
    }
    if not llm_is_configured():
        return fallback

    try:
        content = chat_completion(
            [
                {"role": "system", "content": "You are a market research analyst."},
                {
                    "role": "user",
                    "content": (
                        "Return strict JSON with keys market_size, industry_growth, customer_segments(array), "
                        f"demand_forecast(array of month/demand) for industry: {industry}"
                    ),
                },
            ],
            temperature=0.2,
        )
        parsed = extract_json_object(content)
        return parsed or fallback
    except Exception:
        return fallback