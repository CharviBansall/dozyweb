import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev uses .next-dev (see scripts/dev.mjs) so `npm run build` never corrupts dev cache.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
