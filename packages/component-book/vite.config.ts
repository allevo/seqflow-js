import { defineConfig } from "vite";
import { resolve } from 'path'


export default defineConfig(({command}) => {
	return {
		root: "src",
		build: {
			emptyOutDir: false,
			cssCodeSplit: false,
			copyPublicDir: false,
			outDir: "../dist",
			lib: {
				// Could also be a dictionary or array of multiple entry points
				entry: resolve(__dirname, 'src/index.tsx'),
				formats: ['es'],
				name: 'index',
				// the proper extensions will be added
				fileName: 'index.all',
			},
			rollupOptions: {
				external: (id) => {
					if (id === './components.js') return true
					return false
				},
			}
		},
		plugins: [],
	}
});

