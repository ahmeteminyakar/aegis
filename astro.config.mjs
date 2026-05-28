// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Static output. Cloudflare Pages serves dist/ directly, no SSR adapter
// needed for v0. If a future iteration wants SSR (e.g. real newsletter
// persistence on Workers), add @astrojs/cloudflare and switch output to
// 'server'.
export default defineConfig({
  site: 'https://aegis.example',
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
