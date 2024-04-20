import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage',
    }
  },
})