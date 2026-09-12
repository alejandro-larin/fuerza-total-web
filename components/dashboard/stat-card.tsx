import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: "blue" | "orange" | "green";
};

const accentClasses = {
  blue: "bg-[var(--blue)]",
  orange: "bg-[var(--orange)]",
  green: "bg-[var(--green)]",
};

export function StatCard({ label, value, detail, icon: Icon, accent = "blue" }: StatCardProps) {
  return (
    <article className="relative min-h-52 overflow-hidden border border-[var(--line)] bg-white p-6">
      <div className={`absolute inset-x-0 top-0 h-1.5 ${accentClasses[accent]}`} />
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-36 text-sm font-semibold text-[var(--muted)]">{label}</p>
        <Icon className="size-5 text-[var(--muted)]" aria-hidden="true" />
      </div>
      <p className="mt-9 font-display text-6xl font-extrabold leading-none tabular-nums">{value}</p>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{detail}</p>
    </article>
  );
}
