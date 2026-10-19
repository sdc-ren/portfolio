import { z } from "zod";
type Environment = Record<string, string | undefined>;
const postgresUrl = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return (
      ["postgresql:", "postgres:"].includes(url.protocol) &&
      Boolean(url.hostname) &&
      Boolean(url.username) &&
      Boolean(url.password)
    );
  } catch {
    return false;
  }
}, "Must be a PostgreSQL URL with encoded credentials");
const httpUrl = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), "Must be an HTTP(S) URL");
export const databaseEnvironmentSchema = z.object({
  DATABASE_URL: postgresUrl,
  DIRECT_URL: postgresUrl.refine((value) => {
    try {
      return new URL(value).port !== "6543";
    } catch {
      return false;
    }
  }, "Migrations require the session/direct connection, not transaction port 6543"),
});
export const authEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: httpUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Publishable key is required"),
});
export function checkEnvironment(env: Environment) {
  if (env.DEMO_MODE === "true")
    return { ok: true as const, demo: true, issues: [] };
  const result = databaseEnvironmentSchema
    .merge(authEnvironmentSchema)
    .extend({ NEXT_PUBLIC_SITE_URL: httpUrl })
    .safeParse(env);
  return {
    ok: result.success,
    demo: false,
    issues: result.success
      ? []
      : result.error.issues.map((issue) => ({
          key: issue.path.join("."),
          message: issue.message,
        })),
  };
}
