"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/management/actions";

export function EntityForm({ action, children, label = "Guardar" }: { action: (state: ActionState, data: FormData) => Promise<ActionState>; children: React.ReactNode; label?: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="grid gap-4 rounded-sm border border-[var(--line)] bg-white p-5 sm:grid-cols-2">
      {children}
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <button disabled={pending} className="bg-[var(--ink)] px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? "Guardando…" : label}</button>
        {state.error ? <p role="alert" className="text-sm text-[var(--orange)]">{state.error}</p> : null}
        {state.success ? <p role="status" className="text-sm text-[var(--green)]">{state.success}</p> : null}
      </div>
    </form>
  );
}
