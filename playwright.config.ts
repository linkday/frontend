import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "pnpm build && pnpm preview",
		port: 4173,
	},
	testDir: "tests",
	fullyParallel: true,
};

export default config;
