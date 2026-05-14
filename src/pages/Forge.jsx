import { FileUp, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "../components/EmptyState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { askTutor, processRawNotes, processUploadedFile, uploadNoteFile } from "../services/learningService.js";

export function Forge() {
  const { isFirebaseConfigured, user, profile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setStatus("File is larger than 20MB.");
      return;
    }

    setBusy(true);
    setStatus("Uploading notes...");
    try {
      const uploaded = await uploadNoteFile(user.uid, file, setProgress);
      setStatus("Processing notes with Gemini if configured...");
      await processUploadedFile(uploaded.id);
      setStatus("Done. Your lessons and questions are now available.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function processPastedNotes() {
    if (!rawNotes.trim()) {
      setStatus("Paste some notes first.");
      return;
    }
    setBusy(true);
    setProgress(100);
    setStatus("Processing pasted notes with Gemini if configured...");
    try {
      await processRawNotes(user.uid, rawNotes);
      setRawNotes("");
      setStatus("Done. Your lessons and questions are now available.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!chatInput.trim()) return;
    const nextMessages = [...messages, { role: "user", content: chatInput.trim() }];
    setMessages(nextMessages);
    setChatInput("");
    setBusy(true);
    try {
      const response = await askTutor(nextMessages, { plan: profile?.plan || "Free" });
      setMessages([...nextMessages, { role: "assistant", content: response.reply }]);
    } catch (error) {
      setMessages([...nextMessages, { role: "assistant", content: error.message }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-moss text-white">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-moss">Forge</p>
            <h1 className="text-3xl font-black">Turn notes into recall.</h1>
          </div>
        </div>

        <label className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-paper p-8 text-center transition hover:border-moss">
          <FileUp size={34} className="text-moss" />
          <strong className="mt-3">Upload notes</strong>
          <span className="mt-1 text-sm text-slate-500">PDF, image, or text file up to 20MB</span>
          <input className="hidden" type="file" accept=".pdf,.txt,.md,.png,.jpg,.jpeg" onChange={handleFile} />
        </label>

        <div className="mt-4 grid gap-3">
          <textarea
            value={rawNotes}
            onChange={(event) => setRawNotes(event.target.value)}
            className="min-h-40 resize-y rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-moss"
            placeholder="Or paste notes here to generate lessons instantly..."
          />
          <button
            type="button"
            disabled={busy}
            onClick={processPastedNotes}
            className="rounded-lg bg-ink px-4 py-3 font-black text-white disabled:opacity-60"
          >
            Generate from pasted notes
          </button>
        </div>

        {busy || status ? (
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-600">{status || "Working..."}</p>
          </div>
        ) : null}

        <div className="mt-5 rounded-lg bg-mint/60 p-4">
          <p className="text-sm font-black">Backend workflow</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isFirebaseConfigured
              ? "Gemini can generate lessons from pasted notes and save them to Firestore. Storage uploads are ready for the Firebase backend path."
              : "Without Firebase config, LockOn runs in local mode using browser storage. Add a Gemini key in `.env` to use Gemini for generation, chat, hints, and explanations."}
          </p>
        </div>
      </section>

      <section className="flex min-h-[620px] flex-col rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="mb-4">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">AI chat</p>
          <h2 className="text-2xl font-black">Ask your tutor</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-paper p-4">
          {messages.length ? (
            <div className="grid gap-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[86%] rounded-lg p-3 text-sm leading-6 ${
                    message.role === "user" ? "ml-auto bg-ink text-white" : "bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No chat yet" copy="Ask for a simpler explanation, a memory hook, or a quick checkpoint quiz." />
          )}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-moss"
            placeholder="Ask about your notes..."
          />
          <button disabled={busy} className="rounded-lg bg-ink px-4 text-white" type="submit" aria-label="Send message">
            <Send size={19} />
          </button>
        </form>
      </section>
    </div>
  );
}
