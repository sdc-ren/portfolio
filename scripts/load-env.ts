import { config } from "dotenv";
// Match Next.js's local override precedence without logging environment values.
config({ path: ".env.local", quiet: true });
config({ quiet: true });
