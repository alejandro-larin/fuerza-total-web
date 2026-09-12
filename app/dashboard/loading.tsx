export default function DashboardLoading() {
  return (
    <main className="min-h-dvh p-6 sm:p-10" aria-busy="true" aria-label="Cargando dashboard">
      <div className="h-16 max-w-xl animate-pulse bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-52 animate-pulse border border-[var(--line)] bg-white motion-reduce:animate-none" />
        ))}
      </div>
    </main>
  );
}
