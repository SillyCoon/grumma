/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

import type { User } from "./models/user";

interface ImportMetaEnv {
	readonly PUBLIC_API: string;
	readonly PUBLIC_REAL_TIME_CONTENT_UPDATE: boolean;
	readonly SUPABASE_URL: string;
	readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare global {
	namespace App {
		interface Locals {
			user: User | null;
		}
	}
}
