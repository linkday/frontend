import { PlaywrightTestConfig } from "@playwright/test";
import path from "path";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "npm run build && npm run preview",
		port: 4173,
	},
	testDir: path.join(__dirname, "tests"),
	fullyParallel: true,
};

export default config;
