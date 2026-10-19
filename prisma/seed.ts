import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
config({ path: ".env.local" });
config();
if (!process.env.DIRECT_URL) throw new Error("DIRECT_URL required");
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL }),
});
try {
  const data = contentSchema.parse(initial);
  await db.content.upsert({
    where: { locale: "en" },
    update: {},
    create: {
      locale: "en",
      draft: data,
      published: data,
      publishedAt: new Date(),
    },
  });
  console.log("English content initialized; existing content preserved.");
} finally {
  await db.$disconnect();
}
