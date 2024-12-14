import { defineConfig } from "vite";
import { resolve } from 'path'


export default defineConfig(({command}) => {
	return {
		root: "src",
		build: {
			outDir: "../dist",
			emptyOutDir: false,
			cssCodeSplit: false,
			copyPublicDir: false,
			lib: {
				// Could also be a dictionary or array of multiple entry points
				entry: resolve(__dirname, 'src/index.ts'),
				formats: ['es' as const],
				name: 'index',
				// the proper extensions will be added
				fileName: 'index',
			},
			rollupOptions: {
				output: {
					entryFileNames: '[name].js',	
				},
				// mainEntryPointFilePath: resolve(__dirname, 'src/index.tsx'),
				external: /react/,
			}
		},
		plugins: [],
	}
});

