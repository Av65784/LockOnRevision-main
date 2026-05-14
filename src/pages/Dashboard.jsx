import { ArrowRight, BadgeCheck, Brain, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { findNextLesson, subscribeLessons, subscribeSubjects, subscribeWeakQuestions } from "../services/learningService.js";

export function Dashboard() {
  const { user, profile } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [weakQuestions, setWeakQuestions] = useState([]);

  useEffect(() => subscribeSubjects(user.uid, setSubjects), [user.uid]);
  useEffect(() => subscribeLessons(user.uid, setLessons), [user.uid]);
  useEffect(() => subscribeWeakQuestions(user.uid, setWeakQuestions), [user.uid]);

  const nextLesson = useMemo(() => findNextLesson(lessons, weakQuestions), [lessons, weakQuestions]);
  const dailyUsage = profile?.dailyUsage || {};

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-moss">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Keep your recall locked in.</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Your progress updates as you upload notes, answer quizzes, and recover weak topics.
            </p>
          </div>
          <Link to="/forge" className="inline-flex items-center justify-center gap-2 rounded-lg bg-coral px-4 py-3 font-black text-white">
            Forge notes
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Energy" value={`${profile?.energy ?? 0}/100`} helper="Spent by quizzes and AI actions" tone="bg-mint/60" />
        <StatCard label="Streak" value={`${profile?.streak ?? 0} days`} helper="Updated by completed revision" />
        <StatCard label="Daily usage" value={`${dailyUsage.aiRequests || 0} AI calls`} helper={`${dailyUsage.uploadsProcessed || 0} uploads processed`} />
        <StatCard label="Plan" value={profile?.plan || "Free"} helper="Upgrade unlocks higher AI limits" tone="bg-marigold/55" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Continue learning</p>
              <h2 className="text-2xl font-black">Smart next lesson</h2>
            </div>
            <Brain className="text-moss" />
          </div>

          {nextLesson ? (
            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm font-bold text-moss">{nextLesson.subjectName || "Subject"}</p>
              <h3 className="mt-2 text-xl font-black">{nextLesson.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{nextLesson.summary || "Review this lesson using active recall."}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-600">
                  Mastery {Math.round(nextLesson.mastery || 0)}%
                </span>
                <Link to="/revision" className="rounded-lg bg-ink px-4 py-2 text-sm font-black text-white">
                  Start revision
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No lessons yet"
              copy="Upload or paste your first notes in Forge. LockOn will turn them into subjects, units, lessons, and questions."
              action={
                <Link to="/forge" className="rounded-lg bg-ink px-4 py-3 font-black text-white">
                  Open Forge
                </Link>
              }
            />
          )}
        </article>

        <article className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <Target className="text-coral" />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Goal + focus</p>
              <h2 className="text-2xl font-black">Today</h2>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg bg-paper p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Goal</p>
              <p className="mt-2 font-black">{profile?.goal || "Revise one lesson"}</p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Focus</p>
              <p className="mt-2 font-black">{profile?.focus || "Weakest topic first"}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <BadgeCheck className="text-moss" />
          <h2 className="text-2xl font-black">Subjects</h2>
        </div>
        {subjects.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <article key={subject.id} className="rounded-lg border border-black/10 p-4">
                <p className="text-sm font-bold text-moss">{subject.unitCount || 0} units</p>
                <h3 className="mt-1 text-lg font-black">{subject.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{subject.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Subjects appear after processing" copy="LockOn only shows content created from your notes." />
        )}
      </section>
    </div>
  );
}
