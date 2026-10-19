import "./load-env";
import { z } from "zod";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { databaseEnvironmentSchema } from "../src/lib/environment";
const index = process.argv.indexOf("--user-id");
const userId = z
  .uuid()
  .safeParse(index >= 0 ? process.argv[index + 1] : undefined);
const environment = databaseEnvironmentSchema.safeParse(process.env);
if (!userId.success || !environment.success) {
  console.error(
    "Usage: npm run admin:grant -- --user-id AUTH_USER_UUID. Configure DATABASE_URL and DIRECT_URL first.",
  );
  process.exitCode = 1;
} else {
  const db = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: environment.data.DIRECT_URL,
      connectionTimeoutMillis: 10000,
      max: 1,
    }),
  });
  try {
    const users = await db.$queryRaw<
      { id: string }[]
    >`SELECT id FROM auth.users WHERE id=${userId.data}::uuid`;
    if (!users.length) {
      console.error(
        "That UUID does not exist in Supabase Auth. Create the account first.",
      );
      process.exitCode = 1;
    } else {
      await db.adminUser.upsert({
        where: { id: userId.data },
        update: {},
        create: { id: userId.data },
      });
      console.log("Administrator access granted. Sign in at /admin/login.");
    }
  } catch {
    console.error(
      "Could not grant access. Check the connection, database migration and Auth user UUID.",
    );
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}
