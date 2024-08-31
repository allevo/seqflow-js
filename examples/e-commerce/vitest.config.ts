import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    css: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
  },
})