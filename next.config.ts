import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev uses .next-dev (see scripts/dev.mjs) so `npm run build` never corrupts dev cache.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Dozy is free for now: the web subscription pages are switched off.
  // Remove these redirects to bring the paid plan back.
  async redirects() {
    return ["/subscribe", "/success", "/cancel"].map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
