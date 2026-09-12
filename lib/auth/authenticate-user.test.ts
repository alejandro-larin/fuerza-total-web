import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique } },
}));

import { authenticateUser } from "./authenticate-user";

describe("authenticateUser", () => {
  beforeEach(() => findUnique.mockReset());

  it("normalizes email and authenticates a valid password", async () => {
    findUnique.mockResolvedValue({
      id: "owner-1",
      name: "Propietario",
      email: "owner@example.com",
      passwordHash: await hash("ValidPassword123!", 4),
      role: "OWNER",
    });

    await expect(
      authenticateUser({ email: " OWNER@EXAMPLE.COM ", password: "ValidPassword123!" }),
    ).resolves.toEqual({
      id: "owner-1",
      name: "Propietario",
      email: "owner@example.com",
      role: "OWNER",
    });
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { email: "owner@example.com" } }));
  });

  it("rejects malformed credentials without querying the database", async () => {
    await expect(authenticateUser({ email: "invalid", password: "short" })).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns the same failure for unknown users and invalid passwords", async () => {
    findUnique.mockResolvedValueOnce(null);
    await expect(
      authenticateUser({ email: "missing@example.com", password: "InvalidPassword123!" }),
    ).resolves.toBeNull();

    findUnique.mockResolvedValueOnce({
      id: "owner-1",
      name: "Propietario",
      email: "owner@example.com",
      passwordHash: await hash("ValidPassword123!", 4),
      role: "OWNER",
    });
    await expect(
      authenticateUser({ email: "owner@example.com", password: "InvalidPassword123!" }),
    ).resolves.toBeNull();
  });
});
