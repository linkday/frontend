/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{html,svelte,vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				"!sm": { max: "639px" },
				"!lg": { max: "1023px" },
			},
			colors: {
				main: "#a353ff",
				hover: "#893be1",
			},
		},
	},
	plugins: [],
};
