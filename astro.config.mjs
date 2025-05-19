// @ts-check
import node from "@astrojs/node";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://grumma.org",
  env: {
    schema: {
      PUBLIC_URL: envField.string({
        context: "server",
        access: "public",
        default: "http://localhost:4321",
      }),
    },
  },
  integrations: [
    solid(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      serialize: (item) => {
        if (item.url.includes("/auth/") || item.url.includes("/admin/")) {
          return undefined;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
