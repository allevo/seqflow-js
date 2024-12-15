import { defineConfig, PluginOption } from "vite";
import * as vite from 'vite'
import { resolve } from 'path'

import dts from 'vite-plugin-dts'
import { addStorybookMetaPlugin } from '@seqflow/component-book/vite-plugin'


export default defineConfig(({command}) => {
	const plugins: PluginOption[] = [
		dts({
			exclude: ['**/*.stories.tsx', '**/*.stories.ts', '**/*.test.ts', 'stories/**/*'],
		}),
		addStorybookMetaPlugin({}),
	]
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
		plugins,
	}
});



function generateAllPages(): vite.Plugin {
	return {
		name: 'seqflow-markdown',
		enforce: 'pre' as const,
		transform (code, id) {
			// If it's not a .md file, we can just skip this
			if (id !== '@seqflow/seqflow/component-list') {
				return null
			}

			return {
				code: `
export const foo = 3
`,
			}
		},
	}
}