import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="max-w-lg border-l-8 border-[var(--orange)] bg-white p-8">
        <p className="font-display text-6xl font-extrabold">403</p>
        <h1 className="mt-4 text-2xl font-bold">Este panel es solo para gerencia</h1>
        <p className="mt-3 text-[var(--muted)]">Tu cuenta no tiene permiso para consultar estos datos.</p>
        <Link href="/login" className="mt-8 inline-block bg-[var(--ink)] px-5 py-3 font-bold text-white">
          Volver al acceso
        </Link>
      </div>
    </main>
  );
}
