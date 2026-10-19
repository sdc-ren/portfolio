import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
const globalDb = globalThis as unknown as { db?: PrismaClient };
export function getDb() {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is not configured");
  return (globalDb.db ??= new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 20000,
    }),
  }));
}
