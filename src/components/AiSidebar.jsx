import { Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { askForgeAssistant } from "../services/aiChatService.js";
import { EmptyState } from "./EmptyState.jsx";

export function AiSidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!input.trim() || loading || !user) return;

    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await askForgeAssistant(user.uid, nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: response.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Sorry, I couldn't process that request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg transition-all duration-300 hover:scale-105 ${
          open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open AI assistant"
      >
        <Sparkles size={22} />
      </button>

      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={18} />
            <div>
              <p className="text-sm font-black">AI Assistant</p>
              <p className="text-xs text-slate-500">Context from your Forge subjects</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-slate-200 p-2 text-slate-500"
            aria-label="Close AI assistant"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4">
          {messages.length ? (
            <div className="grid gap-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {loading ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Thinking...
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Ask about your notes"
              copy="The assistant uses your Forge subjects, units, sub-units, lessons, and uploaded material whenever possible."
            />
          )}
        </div>

        {error ? <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700">{error}</p> : null}

        <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a study question..."
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-slate-950 px-3 py-2 text-white disabled:bg-slate-300"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
