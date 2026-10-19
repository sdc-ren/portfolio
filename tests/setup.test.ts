import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkEnvironment,
  databaseEnvironmentSchema,
} from "../src/lib/environment";
const env = {
  DATABASE_URL: "postgresql://user:password@localhost:6543/postgres",
  DIRECT_URL: "postgresql://user:password@localhost:5432/postgres",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
  NEXT_PUBLIC_SITE_URL: "https://portfolio.example.com",
};
test("Production setup requires database, Auth and canonical site URL", () => {
  assert.equal(checkEnvironment(env).ok, true);
  assert.equal(
    checkEnvironment({
      ...env,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
    }).ok,
    false,
  );
});
test("Missing environment configuration is rejected", () => {
  const result = checkEnvironment({});
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.key === "DATABASE_URL"));
  assert.ok(
    result.issues.some((issue) => issue.key === "NEXT_PUBLIC_SUPABASE_URL"),
  );
});
test("Migration configuration rejects transaction pooler port", () => {
  assert.equal(
    databaseEnvironmentSchema.safeParse({
      ...env,
      DIRECT_URL: env.DATABASE_URL,
    }).success,
    false,
  );
});
test("Validation errors never include database credentials", () => {
  const result = checkEnvironment({
    ...env,
    DIRECT_URL: "postgresql://user:secret-password@localhost:6543/postgres",
  });
  assert.equal(result.ok, false);
  assert.equal(JSON.stringify(result).includes("secret-password"), false);
});
