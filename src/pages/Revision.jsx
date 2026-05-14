import { HelpCircle, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  explainWrongAnswer,
  getHint,
  getWrongAnswers,
  recordAnswer,
  subscribeWeakQuestions,
} from "../services/learningService.js";

export function Revision() {
  const { user } = useAuth();
  const [weakQuestions, setWeakQuestions] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribeWeakQuestions(user.uid, setWeakQuestions), [user.uid]);
  useEffect(() => {
    getWrongAnswers(user.uid).then(setWrongAnswers);
  }, [user.uid, result]);

  const activeQuestion = useMemo(() => weakQuestions[activeIndex], [activeIndex, weakQuestions]);

  async function submitAnswer(answer) {
    if (!activeQuestion || result) return;
    setSelected(answer);
    setBusy(true);
    setHint("");
    setExplanation("");
    try {
      const correct = await recordAnswer(user.uid, activeQuestion, answer);
      setResult(correct ? "correct" : "wrong");
      if (!correct) {
        setExplanation(await explainWrongAnswer(activeQuestion.id, answer));
      }
    } finally {
      setBusy(false);
    }
  }

  async function revealHint() {
    if (!activeQuestion || hint) return;
    setHint(await getHint(activeQuestion.id));
  }

  function nextQuestion() {
    setActiveIndex((index) => (weakQuestions.length ? (index + 1) % weakQuestions.length : 0));
    setSelected("");
    setResult(null);
    setHint("");
    setExplanation("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-moss">Revision</p>
            <h1 className="text-3xl font-black">Weak topics first.</h1>
          </div>
          <button
            type="button"
            onClick={nextQuestion}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-4 py-3 font-black"
          >
            <RotateCcw size={18} />
            Next
          </button>
        </div>

        {activeQuestion ? (
          <article className="rounded-lg bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-600">
                Mastery {Math.round(activeQuestion.mastery || 0)}%
              </span>
              <button
                type="button"
                onMouseEnter={revealHint}
                onFocus={revealHint}
                className="inline-flex items-center gap-2 rounded-lg bg-marigold/70 px-3 py-2 text-sm font-black"
              >
                <Lightbulb size={16} />
                Hint
              </button>
            </div>

            <h2 className="mt-5 text-2xl font-black leading-snug">{activeQuestion.prompt}</h2>
            {hint ? <p className="mt-3 rounded-lg bg-white p-3 text-sm font-bold text-slate-600">{hint}</p> : null}

            <div className="mt-5 grid gap-3">
              {(activeQuestion.options || []).map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={busy || Boolean(result)}
                  onClick={() => submitAnswer(option)}
                  className={`rounded-lg border px-4 py-4 text-left font-bold transition ${
                    selected === option && result === "correct"
                      ? "border-moss bg-mint"
                      : selected === option && result === "wrong"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white hover:border-moss"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {result ? (
              <div className="mt-5 rounded-lg bg-white p-4">
                <p className={`font-black ${result === "correct" ? "text-moss" : "text-red-700"}`}>
                  {result === "correct" ? "Correct. Nice lock." : "Not quite. Patch the memory trace."}
                </p>
                {explanation ? <p className="mt-2 text-sm leading-6 text-slate-600">{explanation}</p> : null}
              </div>
            ) : null}
          </article>
        ) : (
          <EmptyState
            title="No weak questions yet"
            copy="Once your notes are processed, questions under 70% mastery will appear here for adaptive revision."
          />
        )}
      </section>

      <aside className="grid gap-5">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="text-coral" />
            <h2 className="text-xl font-black">Previously wrong</h2>
          </div>
          {wrongAnswers.length ? (
            <div className="grid gap-3">
              {wrongAnswers.slice(0, 6).map((answer) => (
                <article key={answer.id} className="rounded-lg bg-paper p-3">
                  <p className="text-sm font-bold leading-5">{answer.prompt}</p>
                  <p className="mt-2 text-xs text-slate-500">Correct: {answer.correctAnswer}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500">Wrong answers will collect here after quizzes.</p>
          )}
        </section>

        <section className="rounded-lg border border-black/10 bg-mint/70 p-5 shadow-soft">
          <h2 className="text-xl font-black">Adaptive difficulty</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Correct answers raise mastery and reduce immediate repeats. Misses lower mastery so the question returns sooner.
          </p>
        </section>
      </aside>
    </div>
  );
}
