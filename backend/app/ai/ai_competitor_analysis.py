from app.ai.openai_api import chat_completion, extract_json_object, llm_is_configured


DEFAULT_COMPETITORS = [
    {
        "company": "LaunchPilot AI",
        "pricing": "$49/mo",
        "features": "Idea scoring, trend alerts, advisor chat",
        "strengths": "Fast onboarding",
        "weaknesses": "Limited enterprise controls",
        "feature_score": 78,
        "price_score": 64,
    },
    {
        "company": "VentureScope",
        "pricing": "$99/mo",
        "features": "Market sizing, competitor tracking, strategy builder",
        "strengths": "Robust research depth",
        "weaknesses": "Higher learning curve",
        "feature_score": 88,
        "price_score": 51,
    },
    {
        "company": "GrowthLens",
        "pricing": "$29/mo",
        "features": "Basic analytics dashboard, alerts",
        "strengths": "Affordable",
        "weaknesses": "Shallow recommendations",
        "feature_score": 59,
        "price_score": 79,
    },
]


def _normalize_competitor(item: dict) -> dict:
    return {
        "company": str(item.get("company") or "Unknown competitor"),
        "pricing": str(item.get("pricing") or "Custom"),
        "features": str(item.get("features") or "Feature set not provided"),
        "strengths": str(item.get("strengths") or "Brand awareness"),
        "weaknesses": str(item.get("weaknesses") or "Limited product depth"),
        "feature_score": int(float(item.get("feature_score") or 60)),
        "price_score": int(float(item.get("price_score") or 60)),
    }


def _fallback_result(idea: str) -> dict:
    bucketed = [
        {"bucket": "<$50", "count": 2},
        {"bucket": "$50-$100", "count": 1},
        {"bucket": ">$100", "count": 0},
    ]
    return {
        "idea": idea,
        "summary": "This competitor snapshot is a fallback view built from common startup tooling patterns.",
        "competitors": DEFAULT_COMPETITORS,
        "pricing_distribution": bucketed,
    }


def generate_competitor_analysis(idea: str) -> dict:
    fallback = _fallback_result(idea)
    if not llm_is_configured():
        return fallback

    try:
        content = chat_completion(
            [
                {"role": "system", "content": "You are a competitive intelligence analyst for startups."},
                {
                    "role": "user",
                    "content": (
                        "Return strict JSON with keys summary, competitors(array), pricing_distribution(array). "
                        "Each competitor must include company, pricing, features, strengths, weaknesses, feature_score, price_score. "
                        "pricing_distribution items must include bucket and count. "
                        f"Analyze this startup idea: {idea}"
                    ),
                },
            ],
            temperature=0.25,
        )
        parsed = extract_json_object(content)
        competitors = [_normalize_competitor(item) for item in (parsed or {}).get("competitors", [])][:5]
        pricing_distribution = []
        for item in (parsed or {}).get("pricing_distribution", []):
            pricing_distribution.append(
                {
                    "bucket": str(item.get("bucket") or "Custom"),
                    "count": int(float(item.get("count") or 0)),
                }
            )
        if competitors:
            return {
                "idea": idea,
                "summary": str((parsed or {}).get("summary") or "AI-generated competitor overview."),
                "competitors": competitors,
                "pricing_distribution": pricing_distribution or fallback["pricing_distribution"],
            }
    except Exception:
        pass

    return fallback