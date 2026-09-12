import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  MemberStatus,
  MembershipStatus,
  PaymentConcept,
  PaymentMethod,
  PlanType,
  PrismaClient,
  Role,
} from "../generated/prisma/client";

function requiredEnv(name: "DATABASE_URL" | "SEED_OWNER_EMAIL" | "SEED_OWNER_PASSWORD") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} es obligatorio para sembrar datos.`);
  }
  return value;
}

const databaseUrl = requiredEnv("DATABASE_URL");
const ownerEmail = requiredEnv("SEED_OWNER_EMAIL");
const ownerPassword = requiredEnv("SEED_OWNER_PASSWORD");

if (!databaseUrl || !ownerEmail || !ownerPassword) {
  throw new Error(
    "DATABASE_URL, SEED_OWNER_EMAIL y SEED_OWNER_PASSWORD son obligatorios para sembrar datos.",
  );
}

if (ownerPassword.length < 12) {
  throw new Error("SEED_OWNER_PASSWORD debe tener al menos 12 caracteres.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const passwordHash = await hash(ownerPassword, 12);
  await prisma.user.upsert({
    where: { email: ownerEmail.toLowerCase() },
    update: { passwordHash, role: Role.OWNER },
    create: {
      name: "Propietario",
      email: ownerEmail.toLowerCase(),
      passwordHash,
      role: Role.OWNER,
    },
  });

  const planDefinitions: Array<{ name: string; monthlyPrice: string; type: PlanType }> = [
      ["Clásico", "39.00", PlanType.CLASSIC],
      ["Total", "59.00", PlanType.TOTAL],
      ["Personalizada", "89.00", PlanType.PERSONALIZED],
      ["Clases", "49.00", PlanType.CLASSES],
    ].map(([name, monthlyPrice, type]) => ({ name: String(name), monthlyPrice: String(monthlyPrice), type: type as PlanType }));
  const plans = await Promise.all(
    planDefinitions.map(({ name, monthlyPrice, type }) =>
      prisma.plan.upsert({
        where: { name },
        update: { monthlyPrice, type },
        create: { name, monthlyPrice, type },
      }),
    ),
  );

  const sampleMembers = [
    ["Lucía Moreno", "lucia@example.com", MemberStatus.ACTIVE, plans[1]],
    ["Hugo Martín", "hugo@example.com", MemberStatus.ACTIVE, plans[0]],
    ["Marta León", "marta@example.com", MemberStatus.OVERDUE, plans[2]],
    ["Diego Vega", "diego@example.com", MemberStatus.INACTIVE, plans[3]],
  ] as const;

  for (const [name, email, status, plan] of sampleMembers) {
    const member = await prisma.member.upsert({
      where: { email },
      update: { status, planId: plan.id },
      create: {
        name,
        email,
        joinedAt: new Date("2026-01-15T10:00:00.000Z"),
        status,
        planId: plan.id,
      },
    });

    const membership = await prisma.membership.findFirst({
      where: { memberId: member.id, planId: plan.id },
    });
    if (!membership) {
      await prisma.membership.create({
        data: {
          memberId: member.id,
          planId: plan.id,
          startsAt: new Date("2026-01-15T10:00:00.000Z"),
          status:
            status === MemberStatus.INACTIVE
              ? MembershipStatus.CANCELLED
              : MembershipStatus.ACTIVE,
        },
      });
    }
  }

  const paymentCount = await prisma.payment.count();
  if (paymentCount === 0) {
    const members = await prisma.member.findMany({ take: 3 });
    await prisma.payment.createMany({
      data: members.map((member, index) => ({
        memberId: member.id,
        amount: [59, 39, 89][index],
        concept: PaymentConcept.FEE,
        method: [PaymentMethod.CARD, PaymentMethod.CASH, PaymentMethod.TRANSFER][index],
        paidAt: new Date(),
      })),
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
