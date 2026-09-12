import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Banknote, DoorOpen, Dumbbell, UsersRound } from "lucide-react";
import { signOut } from "@/auth";
import { PlanDistribution } from "@/components/dashboard/plan-distribution";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusTable } from "@/components/dashboard/status-table";
import { getDashboardMetrics } from "@/lib/dashboard/get-dashboard-metrics";
import { getServerEnv } from "@/lib/env";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: getServerEnv().GYM_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const date = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: getServerEnv().GYM_TIME_ZONE,
  }).format(metrics.generatedAt);
  const change = metrics.income.changePercent;
  const incomeDetail =
    change === null
      ? `Mes anterior: ${formatCurrency(metrics.income.previous)}`
      : `${change >= 0 ? "+" : ""}${change}% respecto al mes anterior`;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden min-h-dvh bg-[var(--ink)] p-7 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 font-display text-2xl font-bold">
          <Dumbbell aria-hidden="true" /> Fuerza Total
        </div>
        <nav aria-label="Principal" className="mt-16">
          <Link href="/dashboard" aria-current="page" className="block border-l-4 border-white bg-white/10 px-4 py-3 font-bold">
            Resumen de hoy
          </Link>
          <Link href="/gestion" className="mt-2 block px-4 py-3 font-bold hover:bg-white/10">
            Gestión operativa
          </Link>
        </nav>
        <div className="mt-auto border-t border-white/20 pt-6">
          <p className="text-xs text-slate-400">Sesión de gerencia</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="mt-3 text-sm font-bold underline decoration-slate-500 underline-offset-4 hover:decoration-white">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b-2 border-[var(--ink)] pb-7">
          <div>
            <div className="flex items-center gap-3 font-display text-xl font-bold lg:hidden">
              <Dumbbell aria-hidden="true" /> Fuerza Total
            </div>
            <h1 className="mt-8 font-display text-5xl font-extrabold leading-none sm:text-6xl lg:mt-0">Estado del gimnasio</h1>
            <p className="mt-3 capitalize text-[var(--muted)]">{date}</p>
          </div>
          <div className="flex items-center gap-2 border border-[var(--line)] bg-white px-3 py-2 text-sm">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
            </span>
            Datos en vivo
          </div>
        </header>

        <section aria-label="Métricas principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Ingresos este mes" value={formatCurrency(metrics.income.current)} detail={incomeDetail} icon={Banknote} accent="blue" />
          <StatCard label="Socios activos" value={String(metrics.members.active)} detail={`${metrics.members.overdue} con cuota pendiente`} icon={UsersRound} accent={metrics.members.overdue > 0 ? "orange" : "green"} />
          <StatCard label="Entradas de hoy" value={String(metrics.attendance.today)} detail="Registros desde las 00:00" icon={Activity} accent="green" />
          <StatCard label="Ahora dentro" value={String(metrics.attendance.inside)} detail="Con entrada y sin salida registrada" icon={DoorOpen} accent="blue" />
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <PlanDistribution plans={metrics.plans} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatusTable
              title="Socios"
              total={metrics.members.total}
              rows={[
                { label: "Activos", value: metrics.members.active, tone: "normal" },
                { label: "Morosos", value: metrics.members.overdue, tone: "warning" },
                { label: "Inactivos", value: metrics.members.inactive, tone: "muted" },
              ]}
            />
            <StatusTable
              title="Membresías"
              total={metrics.memberships.total}
              rows={[
                { label: "Activas", value: metrics.memberships.active, tone: "normal" },
                { label: "Pausadas", value: metrics.memberships.paused, tone: "warning" },
                { label: "Canceladas", value: metrics.memberships.cancelled, tone: "muted" },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
