import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "npm run build && npm run preview",
		port: 4173,
	},
	testDir: "tests",
	fullyParallel: true,
	timeout: 300000,
};

export default config;
