import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sepoy-cup-2026/',
  server: {
    port: parseInt(process.env.PORT || '5173'),
    strictPort: false,
  },
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
