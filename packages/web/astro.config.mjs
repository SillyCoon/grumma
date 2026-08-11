// @ts-check
import node from "@astrojs/node";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, logHandlers, memoryCache } from "astro/config";

export default defineConfig({
  site: "https://grumma.org",
  security: {
    checkOrigin: false,
  },
  logger: logHandlers.json(),
  env: {
    schema: {
      PUBLIC_URL: envField.string({
        context: "server",
        access: "public",
        default: "http://localhost:4321",
      }),
    },
  },
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss()],
  },
  cache: { provider: memoryCache() },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
