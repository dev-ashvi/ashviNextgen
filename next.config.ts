import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prefer this package as the tracing root when other lockfiles exist on the machine
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [{ source: "/in-memory", destination: "/legacy", permanent: true }];
  },
};

export default nextConfig;
