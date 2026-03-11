import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Minimize2, Send, Sparkles, X } from "lucide-react";
import { api } from "../lib/api";

const quickPrompts = [
  "give me 3 startup ideas",
  "show matching faqs",
  "summarize customer profiles",
  "show recent call issues",
];

export default function AssistantDock({ embedded = false, title = "Happy AI Assistant" }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(embedded);
  const containerRef = useRef(null);

  const shellClassName = useMemo(() => {
    if (embedded) {
      return "glass-card flex h-[72vh] min-h-[560px] flex-col overflow-hidden";
    }

    return open
      ? "glass-card fixed bottom-6 right-6 z-50 flex h-[min(78vh,720px)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden border border-cyan-300/20 shadow-2xl"
      : "hidden";
  }, [embedded, open]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const sendQuestion = async (questionText) => {
    if (!questionText.trim() || loading) return;

    const next = [...messages, { role: "user", content: questionText }];
    setMessages(next);
    setLoading(true);
    setError("");
    setInput("");

    requestAnimationFrame(scrollToBottom);

    try {
      const { data } = await api.post("/assistant/chat", { question: questionText, history: next });
      setMessages([...next, { role: "assistant", content: data.answer, sources: data.sources || [] }]);
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      const message = status === 401 || status === 403
        ? "Please log in again to continue chatting."
        : detail || "Assistant could not reach the backend right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const send = () => sendQuestion(input);

  return (
    <>
      {!embedded && !open && (
        <button
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-950/90 px-4 py-3 text-sm text-cyan-100 shadow-2xl backdrop-blur"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Bot size={18} />
          Assistant
        </button>
      )}

      <div className={shellClassName}>
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/45 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-slate-300">Startup, market, FAQ, and customer insight copilot</div>
            </div>
          </div>
          {!embedded && (
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300" onClick={() => setOpen(false)} type="button">
                <Minimize2 size={16} />
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300" onClick={() => { setOpen(false); setMessages([]); setError(""); }} type="button">
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="border-b border-white/10 px-4 py-3">
          <div className="mb-2 text-xs uppercase tracking-[0.24em] text-cyan-200/80">Quick ask</div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-500/20"
                onClick={() => sendQuestion(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !loading && (
            <div className="rounded-2xl border border-cyan-300/15 bg-white/5 p-4 text-sm text-slate-300">
              Ask about startup ideas, competitor signals, FAQs, customer profiles, call logs, or analysis requests from your Excel files.
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={message.role === "user" ? "ml-auto max-w-[88%] rounded-2xl bg-cyan-500/20 px-4 py-3 text-sm" : "max-w-[92%] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm"}
            >
              <div className="whitespace-pre-wrap leading-6">{message.content}</div>
              {message.role === "assistant" && message.sources?.length > 0 && (
                <div className="mt-3 border-t border-white/10 pt-3 text-xs text-slate-300">
                  Sources: {message.sources.map((source) => `${source.source.split(/[\\/]/).pop()} (${source.sheet})`).join(", ")}
                </div>
              )}
            </motion.div>
          ))}

          {loading && <div className="inline-block rounded-xl bg-white/10 px-3 py-2 text-sm">Thinking through your workspace data...</div>}
          {error && !loading && <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</div>}
        </div>

        <div className="border-t border-white/10 bg-slate-950/30 px-4 py-4">
          <div className="flex gap-3">
            <input
              className="field"
              placeholder="Ask your assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  send();
                }
              }}
            />
            <button className="gradient-btn flex items-center gap-2" onClick={send} type="button">
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
