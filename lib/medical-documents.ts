import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { getServerEnv } from "@/lib/env";

const MAX_PDF_SIZE = 5 * 1024 * 1024;
const PDF_SIGNATURE = Buffer.from("%PDF-");

export type MedicalDocument = { key: string; name: string };

function uploadPath(key: string) {
  return join(getServerEnv().PRIVATE_UPLOAD_DIR, basename(key));
}

export async function saveMedicalDocument(file: File): Promise<MedicalDocument | null> {
  if (!file.size) return null;
  if (file.size > MAX_PDF_SIZE) throw new Error("El PDF no puede superar 5 MB.");

  const bytes = Buffer.from(await file.arrayBuffer());
  if (file.type !== "application/pdf" || !bytes.subarray(0, 5).equals(PDF_SIGNATURE)) {
    throw new Error("Las notas médicas deben ser un documento PDF válido.");
  }

  const key = `${randomUUID()}.pdf`;
  await mkdir(getServerEnv().PRIVATE_UPLOAD_DIR, { recursive: true, mode: 0o700 });
  await writeFile(uploadPath(key), bytes, { mode: 0o600, flag: "wx" });
  return { key, name: basename(file.name).slice(0, 255) || "notas-medicas.pdf" };
}

export async function readMedicalDocument(key: string) {
  return readFile(uploadPath(key));
}

export async function deleteMedicalDocument(key: string | null | undefined) {
  if (!key) return;
  await unlink(uploadPath(key)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
