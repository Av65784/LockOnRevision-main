export function StatCard({ label, value, helper, tone = "bg-white" }) {
  return (
    <article className={`rounded-lg border border-black/10 ${tone} p-4 shadow-sm`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-2 block text-2xl font-black tracking-tight">{value}</strong>
      {helper ? <p className="mt-1 text-sm text-slate-500">{helper}</p> : null}
    </article>
  );
}
