import type { NextConfig } from "next";

import { DEFAULT_LOCALE } from "./src/common/i18n/locales";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/", destination: `/${DEFAULT_LOCALE}`, permanent: false }];
  },
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
