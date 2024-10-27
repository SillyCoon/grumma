import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import spotlightjs from "@spotlightjs/astro";
import { defineConfig } from "astro/config";
import auth from "auth-astro";
import gleam from "vite-gleam";

// https://astro.build/config
export default defineConfig({
	site: "https://sillycoon.github.io",
	integrations: [
		solidJs(),
		tailwind({
			applyBaseStyles: false,
		}),
		spotlightjs(),
		auth(),
	],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	// vite: {
	// 	plugins: [gleam({})],
	// },
});
