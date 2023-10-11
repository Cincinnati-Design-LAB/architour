import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    server: {
      hmr: { path: '/vite-hmr/' },
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.netlify/**',
          '**/.stackbit/**',
          '**/.vscode/**',
        ],
      },
    },
  },
});
