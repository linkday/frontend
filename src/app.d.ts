// See https://kit.svelte.dev/docs/types#app

import type { User } from "./api/api.client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
