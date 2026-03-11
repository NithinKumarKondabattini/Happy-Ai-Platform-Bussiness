from app.ai.openai_api import chat_completion, llm_is_configured

RISK_TERMS = {
    "indemnify": 15,
    "termination": 10,
    "liability": 12,
    "penalty": 14,
    "exclusivity": 9,
    "confidential": 7,
    "breach": 13,
}


def analyze_contract_text(text: str) -> dict:
    lowered = text.lower()
    hits = [term for term in RISK_TERMS if term in lowered]
    score = min(100, sum(RISK_TERMS[t] for t in hits) + 20)

    summary = "Contract reviewed with clause-level heuristic analysis."
    if llm_is_configured():
        try:
            summary = chat_completion(
                [
                    {"role": "system", "content": "You are a legal risk assistant."},
                    {"role": "user", "content": f"Summarize this business contract in 4 bullets with main risks:\n{text[:12000]}"},
                ],
                temperature=0.1,
            ) or summary
        except Exception:
            pass

    return {
        "summary": summary,
        "risk_score": float(score),
        "risky_clauses": hits,
        "risk_heatmap": [
            {"clause": "Payment", "risk": min(100, score - 10)},
            {"clause": "Liability", "risk": min(100, score + 8)},
            {"clause": "Termination", "risk": min(100, score + 5)},
            {"clause": "IP", "risk": max(20, score - 15)},
        ],
    }
