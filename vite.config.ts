import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Vercel serves the app from the domain root, so base must be '/'.
  // (If you ever deploy the SAME code to GitHub Pages instead, change
  // this back to '/YOUR-REPO-NAME/' for that deployment.)
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});
