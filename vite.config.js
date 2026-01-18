import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ ensures correct asset paths on Netlify
  server: {
    port: 3001, // Optional for local dev
  },
})
