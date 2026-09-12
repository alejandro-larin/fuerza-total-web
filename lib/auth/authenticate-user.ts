import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12).max(128),
});

export async function authenticateUser(credentials: unknown) {
  const parsed = credentialsSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, name: true, email: true, passwordHash: true, role: true },
  });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
