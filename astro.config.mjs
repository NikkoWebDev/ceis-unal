import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ceis-unal.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
