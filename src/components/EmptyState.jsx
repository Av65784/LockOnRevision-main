export function EmptyState({ title, copy, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{copy}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
