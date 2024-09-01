import { defineConfig } from "vite";
import checker from 'vite-plugin-checker'

export default defineConfig({
	root: "src",
	build: {
		outDir: "../dist",
	},
	publicDir: "../public",
	plugins: [
		checker({
			typescript: true,
		}),
	],
});
