"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", { ...Object.fromEntries(formData), redirect: false });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { error: "Credenciales inválidas." };
    }
    console.error("Error inesperado durante el inicio de sesión.", error);
    return { error: "Error desconocido. Inténtalo de nuevo más tarde." };
  }
  redirect("/dashboard");
}
