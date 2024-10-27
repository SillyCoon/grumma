/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		globals: true,
		env: {
			FIRESTORE_EMULATOR_HOST: "localhost:3333",
		},
	},
});
