import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/wdd330-final-project/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
}) 