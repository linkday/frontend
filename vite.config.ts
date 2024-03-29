import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ["svelte-headlessui", "three", "troika-three-text", "postprocessing"],
	},
	server: {
		host: "localhost",
	},
});
