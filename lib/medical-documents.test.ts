import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { saveMedicalDocument } from "./medical-documents";

let directory: string | undefined;

afterEach(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
  directory = undefined;
});

describe("saveMedicalDocument", () => {
  it("stores a valid PDF under an opaque name", async () => {
    directory = await mkdtemp(join(tmpdir(), "fuerza-total-"));
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters";
    process.env.PRIVATE_UPLOAD_DIR = directory;
    const pdf = Buffer.from("%PDF-1.4\n%%EOF");

    const document = await saveMedicalDocument(new File([pdf], "medical report.pdf", { type: "application/pdf" }));

    expect(document?.key).toMatch(/^[0-9a-f-]+\.pdf$/);
    expect(document?.name).toBe("medical report.pdf");
    await expect(readFile(join(directory, document!.key))).resolves.toEqual(pdf);
  });

  it("rejects content that only claims to be a PDF", async () => {
    directory = await mkdtemp(join(tmpdir(), "fuerza-total-"));
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters";
    process.env.PRIVATE_UPLOAD_DIR = directory;

    await expect(saveMedicalDocument(new File(["not a PDF"], "fake.pdf", { type: "application/pdf" }))).rejects.toThrow("PDF válido");
  });
});
