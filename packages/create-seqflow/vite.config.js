import { defineConfig } from "vite";
import path from 'node:path';

export default defineConfig({
	root: "src",
	build: {
		minify: false,
		target: "node20",
		ssr: true ,
		lib: {
			formats: ["es"],
		  	// Could also be a dictionary or array of multiple entry points
			entry: 'index.ts',
			name: 'create-seqflow',
			// the proper extensions will be added
			fileName: 'create-seqflow.js',
		},
		outDir: "../dist",
	},
});
