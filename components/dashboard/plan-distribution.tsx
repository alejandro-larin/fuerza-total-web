import type { DashboardMetrics } from "@/lib/dashboard/metrics";

export function PlanDistribution({ plans }: { plans: DashboardMetrics["plans"] }) {
  const hasMembers = plans.some((plan) => plan.count > 0);

  return (
    <section aria-labelledby="plans-title" className="border border-[var(--line)] bg-white p-6 sm:p-8">
      <div className="flex items-end justify-between gap-6 border-b border-[var(--line)] pb-5">
        <div>
          <h2 id="plans-title" className="font-display text-3xl font-bold">Distribución de planes</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Socios asociados actualmente a cada plan.</p>
        </div>
      </div>
      {hasMembers ? (
        <ul className="mt-7 space-y-6">
          {plans.map((plan) => (
            <li key={plan.id}>
              <div className="mb-2 flex justify-between gap-4 text-sm">
                <span className="font-bold">{plan.name}</span>
                <span className="tabular-nums text-[var(--muted)]">
                  {plan.count} {plan.count === 1 ? "socio" : "socios"} · {plan.percentage}%
                </span>
              </div>
              <div className="h-3 overflow-hidden bg-[var(--paper)]" aria-hidden="true">
                <div className="h-full bg-[var(--blue)]" style={{ width: `${plan.percentage}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border-l-4 border-[var(--blue)] py-1 pl-4 text-[var(--muted)]">
          Aún no hay socios asociados a un plan.
        </p>
      )}
    </section>
  );
}
