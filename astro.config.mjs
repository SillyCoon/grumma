// @ts-check
import node from "@astrojs/node";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://sillycoon.github.io",
	experimental: {
		env: {
			schema: {
				PUBLIC_URL: envField.string({
					context: "server",
					access: "public",
					default: "http://localhost:4321",
				}),
			},
		},
	},
	integrations: [
		solid({ devtools: import.meta.env.DEV }),
		tailwind({
			applyBaseStyles: false,
		}),
	],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	// vite: {
	// 	plugins: [gleam({})],
	// },
});
