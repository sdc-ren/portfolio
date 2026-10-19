import "./load-env";
import { Pool } from "pg";
import { checkEnvironment } from "../src/lib/environment";
const result = checkEnvironment(process.env);
if (!result.ok) {
  for (const issue of result.issues)
    console.error(`${issue.key}: ${issue.message}`);
  process.exitCode = 1;
} else if (result.demo)
  console.log(
    "Read-only demo mode is enabled. Database and admin are not verified.",
  );
else {
  console.log(
    "Required environment variables are present and structurally valid.",
  );
  if (process.argv.includes("--database")) {
    for (const name of ["DATABASE_URL", "DIRECT_URL"] as const) {
      const pool = new Pool({
        connectionString: process.env[name],
        max: 1,
        connectionTimeoutMillis: 10000,
      });
      try {
        await pool.query("SELECT 1");
        console.log(`${name}: database connection verified`);
      } catch {
        console.error(
          `${name}: connection failed. Check the endpoint, credentials, TLS and network access.`,
        );
        process.exitCode = 1;
      } finally {
        await pool.end();
      }
    }
    if (!process.exitCode) {
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        max: 1,
        connectionTimeoutMillis: 10000,
      });
      try {
        const {
          rows: [row],
        } = await pool.query(
          'SELECT (SELECT count(*)::int FROM "Content" WHERE "published" IS NOT NULL) AS published, (SELECT count(*)::int FROM "AdminUser") AS admins',
        );
        console.log(
          `Published languages: ${row.published}; configured admin accounts: ${row.admins}`,
        );
        if (!row.published || !row.admins) {
          console.error(
            "Run the seed and provision an administrator before production.",
          );
          process.exitCode = 1;
        }
      } catch {
        console.error(
          "CMS tables are unavailable. Run db:deploy and db:seed first.",
        );
        process.exitCode = 1;
      } finally {
        await pool.end();
      }
    }
  }
}
