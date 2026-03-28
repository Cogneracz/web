import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/securityHeaders";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: { unoptimized: true },
  allowedDevOrigins: ["cognera.cz", "www.cognera.cz"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: getSecurityHeaders(process.env.NODE_ENV === "production"),
      },
    ];
  },
};

export default nextConfig;
