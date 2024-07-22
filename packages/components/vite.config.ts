import { defineConfig, PluginOption } from "vite";
import { resolve } from 'path'
import * as p from "seqflow-js-storybook/vite-plugin";

import dts from 'vite-plugin-dts'


export default defineConfig(({command}) => {
	const plugins: PluginOption[] = [
		dts({
			exclude: ['**/*.stories.tsx', '**/*.stories.ts', '**/*.test.ts', 'stories/**/*'],
		}),
	]
	// Generate storybook meta data only in serve mode
	// This is to avoid generating storybook meta data in build mode
	if (command === 'serve' || true) {
		// @ts-ignore
		plugins.push(p.addStorybookMetaPlugin({}))
	}

	return {
		root: "src",
		build: {
			outDir: "../dist",
			emptyOutDir: false,
			cssCodeSplit: false,
			copyPublicDir: false,
			lib: {
				// Could also be a dictionary or array of multiple entry points
				entry: resolve(__dirname, 'src/index.tsx'),
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
		plugins,
	}
});
