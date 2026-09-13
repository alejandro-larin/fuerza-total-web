import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwner } from "@/lib/auth/require-owner";
import { readMedicalDocument } from "@/lib/medical-documents";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({ kind: z.enum(["employee", "member"]), id: z.string().cuid() });

export async function GET(_: Request, context: { params: Promise<{ kind: string; id: string }> }) {
  await requireOwner();
  const { kind, id } = paramsSchema.parse(await context.params);
  const record = kind === "employee"
    ? await prisma.user.findUnique({ where: { id }, select: { medicalNotesKey: true, medicalNotesName: true } })
    : await prisma.member.findUnique({ where: { id }, select: { medicalNotesKey: true, medicalNotesName: true } });

  if (!record?.medicalNotesKey) return new NextResponse("Documento no encontrado.", { status: 404 });
  try {
    const document = await readMedicalDocument(record.medicalNotesKey);
    return new NextResponse(document, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(record.medicalNotesName ?? "notas-medicas.pdf")}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Documento no encontrado.", { status: 404 });
  }
}
