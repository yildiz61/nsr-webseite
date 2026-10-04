import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base: the build runs unchanged on GitLab Pages (/<projekt>/),
// on a custom domain or from any sub folder of a classic web host.
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
})
