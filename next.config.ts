import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  // Pin the workspace root so a stray lockfile in a parent directory doesn't
  // make Turbopack resolve modules from the wrong place.
  turbopack: { root: __dirname },
};

export default nextConfig;
