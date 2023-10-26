import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//? https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
	server: {
    port: 3415,
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin',
		}
  },
  resolve: {
    alias: {
      '@Muse': fileURLToPath(new URL('./', import.meta.url)),
    }
  }
})
