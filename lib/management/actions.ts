"use server";

import { hash } from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "@/lib/auth/require-owner";
import { prisma } from "@/lib/prisma";

export type ActionState = { error?: string; success?: string };

const idSchema = z.string().cuid();
const optionalId = z.string().cuid().or(z.literal(""));
const optionalDate = z.string().date().or(z.literal(""));

function text(formData: FormData, name: string) {
  return formData.get(name)?.toString() ?? "";
}

function refresh() {
  revalidatePath("/gestion", "layout");
  revalidatePath("/dashboard");
}

function errorMessage(error: unknown) {
  if (error instanceof z.ZodError) return "Revisa los datos introducidos.";
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Ya existe un registro con esos datos únicos.";
    if (error.code === "P2003") return "No se puede eliminar porque tiene datos relacionados.";
    if (error.code === "P2025") return "El registro ya no existe.";
  }
  return "No se pudo guardar el cambio.";
}

async function run(operation: () => Promise<unknown>, success: string): Promise<ActionState> {
  await requireOwner();
  try {
    await operation();
    refresh();
    return { success };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

const employeeSchema = z.object({
  id: optionalId,
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["OWNER", "TRAINER"]),
  password: z.string().min(12).max(128).or(z.literal("")),
});

export async function saveEmployee(_: ActionState, formData: FormData) {
  const data = employeeSchema.parse({ id: text(formData, "id"), name: text(formData, "name"), email: text(formData, "email"), role: text(formData, "role"), password: text(formData, "password") });
  if (!data.id && !data.password) return { error: "La contraseña inicial es obligatoria." };
  return run(async () => {
    if (data.id) {
      await prisma.user.update({ where: { id: data.id }, data: { name: data.name, email: data.email, role: data.role, ...(data.password ? { passwordHash: await hash(data.password, 12) } : {}) } });
    } else {
      await prisma.user.create({ data: { name: data.name, email: data.email, role: data.role, passwordHash: await hash(data.password, 12) } });
    }
  }, "Empleado guardado.");
}

const memberSchema = z.object({ id: optionalId, name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), phone: z.string().trim().max(30), status: z.enum(["ACTIVE", "INACTIVE", "OVERDUE"]), planId: optionalId });
export async function saveMember(_: ActionState, formData: FormData) {
  const data = memberSchema.parse({ id: text(formData, "id"), name: text(formData, "name"), email: text(formData, "email"), phone: text(formData, "phone"), status: text(formData, "status"), planId: text(formData, "planId") });
  return run(() => data.id ? prisma.member.update({ where: { id: data.id }, data: { name: data.name, email: data.email, phone: data.phone || null, status: data.status, planId: data.planId || null } }) : prisma.member.create({ data: { name: data.name, email: data.email, phone: data.phone || null, status: data.status, planId: data.planId || null, joinedAt: new Date() } }), "Cliente guardado.");
}

const contractSchema = z.object({ id: optionalId, memberId: idSchema, startsAt: z.string().date(), endsAt: optionalDate, status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED"]), notes: z.string().trim().max(1000) });
export async function saveContract(_: ActionState, formData: FormData) {
  const data = contractSchema.parse({ id: text(formData, "id"), memberId: text(formData, "memberId"), startsAt: text(formData, "startsAt"), endsAt: text(formData, "endsAt"), status: text(formData, "status"), notes: text(formData, "notes") });
  const values = { memberId: data.memberId, startsAt: new Date(`${data.startsAt}T12:00:00Z`), endsAt: data.endsAt ? new Date(`${data.endsAt}T12:00:00Z`) : null, status: data.status, notes: data.notes || null };
  return run(() => data.id ? prisma.contract.update({ where: { id: data.id }, data: values }) : prisma.contract.create({ data: values }), "Contrato guardado.");
}

const membershipSchema = z.object({ id: optionalId, memberId: idSchema, planId: idSchema, startsAt: z.string().date(), endsAt: optionalDate, status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"] ) });
export async function saveMembership(_: ActionState, formData: FormData) {
  const data = membershipSchema.parse({ id: text(formData, "id"), memberId: text(formData, "memberId"), planId: text(formData, "planId"), startsAt: text(formData, "startsAt"), endsAt: text(formData, "endsAt"), status: text(formData, "status") });
  const values = { memberId: data.memberId, planId: data.planId, startsAt: new Date(`${data.startsAt}T12:00:00Z`), endsAt: data.endsAt ? new Date(`${data.endsAt}T12:00:00Z`) : null, status: data.status };
  return run(() => data.id ? prisma.membership.update({ where: { id: data.id }, data: values }) : prisma.membership.create({ data: values }), "Membresía guardada.");
}

const paymentSchema = z.object({ id: optionalId, memberId: idSchema, amount: z.coerce.number().positive().max(999999), concept: z.enum(["FEE", "PLAN"]), method: z.enum(["CASH", "CARD", "TRANSFER"]), paidAt: z.string().date() });
export async function savePayment(_: ActionState, formData: FormData) {
  const data = paymentSchema.parse({ id: text(formData, "id"), memberId: text(formData, "memberId"), amount: text(formData, "amount"), concept: text(formData, "concept"), method: text(formData, "method"), paidAt: text(formData, "paidAt") });
  const values = { memberId: data.memberId, amount: data.amount, concept: data.concept, method: data.method, paidAt: new Date(`${data.paidAt}T12:00:00Z`) };
  return run(() => data.id ? prisma.payment.update({ where: { id: data.id }, data: values }) : prisma.payment.create({ data: values }), "Pago guardado.");
}

const checkInSchema = z.object({ id: optionalId, memberId: idSchema, enteredAt: z.string().datetime({ local: true }), leftAt: z.string().datetime({ local: true }).or(z.literal("")) });
export async function saveCheckIn(_: ActionState, formData: FormData) {
  const data = checkInSchema.parse({ id: text(formData, "id"), memberId: text(formData, "memberId"), enteredAt: text(formData, "enteredAt"), leftAt: text(formData, "leftAt") });
  const values = { memberId: data.memberId, enteredAt: new Date(data.enteredAt), leftAt: data.leftAt ? new Date(data.leftAt) : null };
  return run(() => data.id ? prisma.checkIn.update({ where: { id: data.id }, data: values }) : prisma.checkIn.create({ data: values }), "Acceso guardado.");
}

export async function deleteRecord(formData: FormData) {
  await requireOwner();
  const kind = z.enum(["employee", "member", "contract", "membership", "payment", "checkIn"]).parse(text(formData, "kind"));
  const id = idSchema.parse(text(formData, "id"));
  try {
    switch (kind) {
      case "employee": await prisma.user.delete({ where: { id } }); break;
      case "member": await prisma.member.delete({ where: { id } }); break;
      case "contract": await prisma.contract.delete({ where: { id } }); break;
      case "membership": await prisma.membership.delete({ where: { id } }); break;
      case "payment": await prisma.payment.delete({ where: { id } }); break;
      case "checkIn": await prisma.checkIn.delete({ where: { id } }); break;
    }
    refresh();
  } catch (error) {
    throw new Error(errorMessage(error));
  }
}
