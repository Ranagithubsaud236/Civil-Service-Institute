import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // hide the "N" dev badge so client demos look clean; real errors still show as an overlay
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  // story images in the news section: BBC News and Dawn
  images: { remotePatterns: [{ protocol: "https", hostname: "ichef.bbci.co.uk" }, { protocol: "https", hostname: "i.dawn.com" }] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
