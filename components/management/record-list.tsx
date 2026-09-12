import Link from "next/link";
import { deleteRecord } from "@/lib/management/actions";

export function RecordList({ rows, kind }: { rows: Array<{ id: string; title: string; details: string }>; kind: string }) {
  if (!rows.length) return <p className="border-l-4 border-[var(--blue)] bg-white p-5">Todavía no hay registros.</p>;
  return <div className="grid gap-3">{rows.map((row) => <article key={row.id} className="flex flex-wrap items-center justify-between gap-4 border border-[var(--line)] bg-white p-4"><div><h3 className="font-bold">{row.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{row.details}</p></div><div className="flex gap-2"><Link className="border border-[var(--ink)] px-3 py-2 text-sm font-bold" href={`?edit=${row.id}`}>Editar</Link><form action={deleteRecord}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="kind" value={kind}/><button className="border border-[var(--orange)] px-3 py-2 text-sm font-bold text-[var(--orange)]">Eliminar</button></form></div></article>)}</div>;
}
