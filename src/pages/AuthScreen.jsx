import { Chrome, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export function AuthScreen() {
  const { isFirebaseConfigured, login, loginWithGoogle, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-paper text-ink lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex min-h-[42vh] items-end bg-[linear-gradient(135deg,rgba(46,125,89,.92),rgba(98,168,219,.84)),url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-8 text-white lg:min-h-screen lg:p-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-mint">AI active recall</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">LockOn Revision</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/86">
            Upload notes, forge lessons, and revise the exact topics your memory is leaking.
          </p>
        </div>
      </section>

      <section className="grid place-items-center px-5 py-8">
        <div className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-2xl font-black">{mode === "register" ? "Create account" : "Welcome back"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isFirebaseConfigured
                ? "Your notes stay private in your Firebase account."
                : "Your notes stay private in this browser until Firebase is configured."}
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="grid gap-2 text-sm font-bold">
                Name
                <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
                  <UserRound size={17} className="text-slate-400" />
                  <input
                    required
                    className="min-w-0 flex-1 py-3 outline-none"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </span>
              </label>
            ) : null}

            <label className="grid gap-2 text-sm font-bold">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
                <Mail size={17} className="text-slate-400" />
                <input
                  required
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  className="min-w-0 flex-1 py-3 outline-none"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Password
              <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
                <LockKeyhole size={17} className="text-slate-400" />
                <input
                  required
                  minLength={6}
                  type="password"
                  className="min-w-0 flex-1 py-3 outline-none"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
              </span>
            </label>

            {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

            <button className="rounded-lg bg-ink px-4 py-3 font-black text-white" disabled={busy} type="submit">
              {busy ? "Working..." : mode === "register" ? "Create account" : "Log in"}
            </button>
          </form>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 px-4 py-3 font-black"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            className="mt-5 w-full text-sm font-bold text-moss"
          >
            {mode === "register" ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </div>
      </section>
    </main>
  );
}
