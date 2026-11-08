import type { NextConfig } from "next";

const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;

const nextConfig: NextConfig = {
  // The atlas is a fully static site: no server code, no API routes.
  output: "export",
  images: { unoptimized: true },
  // For project pages (https://<user>.github.io/<repo>) set
  // NEXT_PUBLIC_BASE_PATH=/<repo> at build time; leave unset for local dev.
  ...(isGitHubPages
    ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH }
    : {}),
};

export default nextConfig;
