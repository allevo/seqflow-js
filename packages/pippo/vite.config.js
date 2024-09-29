import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    dts({ include: ['src'] }),
    checker({ typescript: true }),
  ],
  build: {
    emptyOutDir: false,
    cssCodeSplit: false,
    copyPublicDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: 'index',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {},
    },
  },
})
