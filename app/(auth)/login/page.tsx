import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Acceso" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user.role === "OWNER") redirect("/dashboard");

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(300px,0.9fr)_minmax(480px,1.1fr)]">
      <section className="relative hidden overflow-hidden bg-[var(--ink)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(115deg,transparent_0_38px,#fff_39px_40px)]" />
        <div className="relative flex items-center gap-3 font-display text-2xl font-bold">
          <Dumbbell aria-hidden="true" /> Fuerza Total
        </div>
        <div className="relative max-w-lg">
          <p className="font-display text-6xl font-extrabold leading-[0.9] tracking-tight">
            El negocio también se entrena.
          </p>
          <p className="mt-7 max-w-md text-lg leading-8 text-slate-300">
            Ingresos, socios y asistencia. La lectura diaria de tu gimnasio, sin hojas de cálculo.
          </p>
        </div>
        <p className="relative text-sm text-slate-400">Panel privado para gerencia</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3 font-display text-2xl font-bold lg:hidden">
            <Dumbbell aria-hidden="true" /> Fuerza Total
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-none">Vuelve al gimnasio</h1>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Identifícate para consultar el estado de hoy.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
