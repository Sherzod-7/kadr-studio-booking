import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — build istalgan papka yoki statik hostingda ochilishi uchun nisbiy yo‘llar.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
