import { config } from "dotenv";
import { defineConfig } from "prisma/config";
config({ path: ".env.local" });
config();
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --import tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? "postgresql://localhost:5432/portfolio",
  },
});
