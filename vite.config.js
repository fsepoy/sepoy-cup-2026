import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sepoy-cup-2026/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
      },
    },
  },
  test: {
    environment: 'node',
  },
})
