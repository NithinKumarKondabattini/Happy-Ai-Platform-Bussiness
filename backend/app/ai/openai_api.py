import json
import urllib.error
import urllib.request
from typing import Any

from app.core.config import settings

OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions"
DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


def extract_json_object(text: str) -> dict[str, Any] | None:
    text = (text or "").strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(text[start : end + 1])
    except Exception:
        return None


def llm_is_configured() -> bool:
    return bool(settings.openai_api_key)


def _request_json(url: str, *, method: str = "GET", payload: dict[str, Any] | None = None, headers: dict[str, str] | None = None) -> dict[str, Any]:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"OpenAI request failed with status {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"OpenAI request failed: {exc.reason}") from exc


def chat_completion(messages: list[dict[str, str]], temperature: float = 0.2, model: str | None = None) -> str:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    body = _request_json(
        OPENAI_CHAT_COMPLETIONS_URL,
        method="POST",
        payload={
            "model": model or settings.openai_model or DEFAULT_OPENAI_MODEL,
            "temperature": temperature,
            "messages": messages,
        },
        headers={
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        },
    )
    try:
        return body["choices"][0]["message"]["content"] or ""
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("Unexpected OpenAI response format") from exc