import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { requireOwner } from "@/lib/auth/require-owner";

const links = [["/dashboard", "Dashboard"], ["/gestion/empleados", "Empleados"], ["/gestion/clientes", "Clientes"], ["/gestion/contratos", "Contratos"], ["/gestion/membresias", "Membresías"], ["/gestion/pagos", "Pagos"], ["/gestion/accesos", "Acceso diario"]];

export default async function ManagementLayout({ children }: { children: React.ReactNode }) {
  await requireOwner();
  return <div className="min-h-dvh lg:grid lg:grid-cols-[250px_1fr]"><aside className="bg-[var(--ink)] p-5 text-white lg:min-h-dvh lg:p-7"><Link href="/dashboard" className="flex items-center gap-3 font-display text-2xl font-bold"><Dumbbell aria-hidden="true"/> Fuerza Total</Link><nav aria-label="Gestión" className="mt-7 flex gap-2 overflow-x-auto pb-2 lg:mt-12 lg:block lg:space-y-1">{links.map(([href,label])=><Link key={href} href={href} className="block shrink-0 px-3 py-2 text-sm font-semibold hover:bg-white/10">{label}</Link>)}</nav></aside><main className="min-w-0 p-4 sm:p-8 lg:p-10">{children}</main></div>;
}
