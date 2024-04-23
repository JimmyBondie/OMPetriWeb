import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: './src/renderer',
  plugins: [vue()],
  build: {
    outDir: '../../dist-web'
  },
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src', 'renderer', 'src')
    }
  }
})
