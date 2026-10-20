import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cv/ai-agent-engineering",
        destination: "/cv/senior-software-engineer",
        permanent: true,
      },
      {
        source: "/en/cv/ai-agent-engineering",
        destination: "/cv/senior-software-engineer",
        permanent: true,
      },
      {
        source: "/api/cv/en/ai-agent-engineering",
        destination: "/api/cv/en/senior-software-engineer",
        permanent: true,
      },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "@react-pdf/renderer",
  ],
  outputFileTracingIncludes: { "/api/cv/**/*": ["./public/fonts/**/*"] },
};
export default config;
