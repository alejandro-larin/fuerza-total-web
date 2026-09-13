import { EntityForm } from "@/components/management/entity-form";
import { Field, SelectField } from "@/components/management/fields";
import { RecordList } from "@/components/management/record-list";
import { saveMember } from "@/lib/management/actions";
import { prisma } from "@/lib/prisma";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const [records, plans, current] = await Promise.all([
    prisma.member.findMany({ include: { plan: true }, orderBy: { name: "asc" } }),
    prisma.plan.findMany({ orderBy: { name: "asc" } }),
    edit ? prisma.member.findUnique({ where: { id: edit } }) : null,
  ]);
  return <Wrap title="Clientes"><EntityForm action={saveMember}><input type="hidden" name="id" value={current?.id ?? ""}/><Field label="Nombre" name="name" defaultValue={current?.name}/><Field label="Correo" name="email" type="email" defaultValue={current?.email}/><Field label="Teléfono" name="phone" required={false} defaultValue={current?.phone ?? ""}/><Field label="DUI" name="dui" required={false} defaultValue={current?.dui ?? ""}/><Field label="Contacto telefónico de emergencia" name="emergencyPhone" type="tel" required={false} defaultValue={current?.emergencyPhone ?? ""}/><SelectField label="Estado" name="status" defaultValue={current?.status} options={[["ACTIVE", "Activo"], ["INACTIVE", "Inactivo"], ["OVERDUE", "Moroso"]]}/><SelectField label="Plan actual" name="planId" required={false} defaultValue={current?.planId ?? ""} options={plans.map((plan) => [plan.id, plan.name])}/><Field label="Notas médicas (PDF)" name="medicalNotes" type="file" accept="application/pdf" required={false} description={current?.medicalNotesName ? `Actual: ${current.medicalNotesName}. Máximo 5 MB.` : "Documento privado. Máximo 5 MB."}/>{current?.medicalNotesKey ? <a className="self-end font-bold text-[var(--blue)] underline" href={`/api/medical-documents/member/${current.id}`}>Ver PDF actual</a> : null}</EntityForm><RecordList kind="member" rows={records.map((record) => ({ id: record.id, title: record.name, details: `${record.email} · DUI: ${record.dui ?? "Sin DUI"} · Emergencia: ${record.emergencyPhone ?? "Sin contacto"} · ${record.plan?.name ?? "Sin plan"}` }))}/></Wrap>;
}

function Wrap({ title, children }: { title: string; children: React.ReactNode }) {
  return <><header className="mb-8 border-b-2 border-[var(--ink)] pb-6"><h1 className="font-display text-5xl font-extrabold">{title}</h1><p className="mt-2 text-[var(--muted)]">Personas inscritas y su situación actual.</p></header><div className="space-y-6">{children}</div></>;
}
