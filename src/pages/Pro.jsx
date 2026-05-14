import { Check, Gem } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const rows = [
  ["AI uploads", "3/day", "Higher monthly limits"],
  ["Tutor chat", "Basic context", "Longer context + richer explanations"],
  ["Revision engine", "Weak topic queue", "Weak queue + advanced hints"],
  ["Billing", "Not required", "Coming soon"],
];

export function Pro() {
  const { profile } = useAuth();

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-moss">Pro</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Pro plan is paused for now.</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              LockOn Revision currently runs without payments. The Pro screen stays here as a clean placeholder for a
              later subscription flow.
            </p>
          </div>
          <div className="rounded-lg bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <Gem className="text-marigold" />
              <span className="text-sm font-bold uppercase tracking-widest">Future upgrade</span>
            </div>
            <p className="mt-4 text-5xl font-black">Rs 20</p>
            <button
              type="button"
              disabled
              className="mt-5 w-full rounded-lg bg-marigold px-4 py-3 font-black text-ink disabled:opacity-60"
            >
              {profile?.plan === "Pro" ? "Pro active" : "Payments disabled"}
            </button>
            <p className="mt-3 text-sm text-white/80">No payment key is needed in this version.</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-soft">
        <div className="grid grid-cols-3 bg-paper px-4 py-3 text-sm font-black">
          <span>Feature</span>
          <span>Free</span>
          <span>Pro</span>
        </div>
        {rows.map(([feature, free, pro]) => (
          <div key={feature} className="grid grid-cols-3 gap-3 border-t border-black/10 px-4 py-4 text-sm">
            <span className="font-black">{feature}</span>
            <span className="text-slate-500">{free}</span>
            <span className="flex items-center gap-2 font-bold text-moss">
              <Check size={16} />
              {pro}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
