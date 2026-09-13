import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  GYM_TIME_ZONE: z.string().default("Europe/Madrid"),
  GYM_CURRENCY: z.string().length(3).default("USD"),
  PRIVATE_UPLOAD_DIR: z.string().default("/app/data/uploads"),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
