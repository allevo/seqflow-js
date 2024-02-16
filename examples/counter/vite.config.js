import { resolve } from 'path'
import { defineConfig } from 'vite'
import chokidar from 'chokidar'
import child_process from 'child_process'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
  },
})
