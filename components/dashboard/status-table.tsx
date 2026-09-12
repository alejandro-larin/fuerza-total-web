type StatusRow = { label: string; value: number; tone: "normal" | "warning" | "muted" };

export function StatusTable({ title, total, rows }: { title: string; total: number; rows: StatusRow[] }) {
  return (
    <section className="border border-[var(--line)] bg-white p-6 sm:p-8">
      <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-5">
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        <span className="text-sm text-[var(--muted)]">Total {total}</span>
      </div>
      <dl className="mt-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between border-b border-[var(--line)] py-4 last:border-0">
            <dt className="flex items-center gap-3 text-sm font-semibold">
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full ${
                  row.tone === "warning"
                    ? "bg-[var(--orange)]"
                    : row.tone === "muted"
                      ? "bg-slate-400"
                      : "bg-[var(--green)]"
                }`}
              />
              {row.label}
            </dt>
            <dd className="font-display text-2xl font-bold tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
