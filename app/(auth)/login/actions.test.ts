import { beforeEach, describe, expect, it, vi } from "vitest";

const { signIn, redirect } = vi.hoisted(() => ({ signIn: vi.fn(), redirect: vi.fn() }));

vi.mock("@/auth", () => ({ signIn }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string;

    constructor(type: string) {
      super(type);
      this.type = type;
    }
  },
}));

import { loginAction } from "./actions";
import { AuthError } from "next-auth";

describe("loginAction", () => {
  beforeEach(() => {
    signIn.mockReset();
    redirect.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("returns an invalid credentials error", async () => {
    signIn.mockRejectedValue(new AuthError("CredentialsSignin"));

    await expect(loginAction({}, new FormData())).resolves.toEqual({
      error: "Credenciales inválidas.",
    });
  });

  it("returns a generic message for unknown errors", async () => {
    signIn.mockRejectedValue(new Error("database unavailable"));

    await expect(loginAction({}, new FormData())).resolves.toEqual({
      error: "Error desconocido. Inténtalo de nuevo más tarde.",
    });
  });
});
