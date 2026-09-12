"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="mt-10 space-y-6" noValidate>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full border border-[var(--line)] bg-white px-4 text-base shadow-[inset_3px_0_var(--blue)] outline-none placeholder:text-slate-400"
          placeholder="nombre@gimnasio.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-required="true"
          aria-describedby={state.error ? "login-error" : undefined}
          aria-invalid={Boolean(state.error)}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full border border-[var(--line)] bg-white px-4 text-base shadow-[inset_3px_0_var(--blue)] outline-none"
        />
      </div>
      {state.error ? (
        <p id="login-error" role="alert" className="border-l-4 border-[var(--orange)] pl-3 text-sm">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center bg-[var(--ink)] px-5 font-bold text-white transition-colors hover:bg-[var(--blue)] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Comprobando acceso…" : "Entrar al panel"}
      </button>
    </form>
  );
}
