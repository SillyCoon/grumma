// @ts-check
import node from "@astrojs/node";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: "https://grumma.org",
  security: {
    checkOrigin: false,
  },
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
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
