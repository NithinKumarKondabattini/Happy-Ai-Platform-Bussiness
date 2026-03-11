from app.services.excel_rag import ask_excel_rag


def run_assistant(question: str, history: list | None = None) -> dict:
    return ask_excel_rag(question, history or [])
