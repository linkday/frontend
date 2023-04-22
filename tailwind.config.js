/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{html,svelte,vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				"!md": { max: "767px" },
				"!lg": { max: "1023px" },
			},
			colors: {
				main: "#a353ff",
				hover: "#b67ff4",
			},
			fontFamily: {
				spectrul: ["Spectral", "serif"],
			},
		},
	},
	plugins: [],
};
