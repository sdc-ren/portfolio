import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "@react-pdf/renderer",
  ],
  outputFileTracingIncludes: { "/api/cv/**/*": ["./public/fonts/**/*"] },
};
export default config;
