import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
// import CommonJs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    port: 3000,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  define: {
    global: 'globalThis',
    'process.env.COMMIT_HASH':
      process.env.COMMIT_HASH ? JSON.stringify(process.env.COMMIT_HASH) : undefined,
  }
})
