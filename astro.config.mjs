// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static output. Cloudflare Pages serves dist/ directly, no SSR adapter
// needed for v0. If a future iteration wants SSR (e.g. real newsletter
// persistence on Workers), add @astrojs/cloudflare and switch output to
// 'server'.
//
// Hero entrance is CSS @keyframes; nothing on the page needs hydration,
// so no React integration is registered. If you reintroduce an island,
// add @astrojs/react and re-register here.
//
// Deployed via Cloudflare Workers static assets (see wrangler.jsonc).
export default defineConfig({
  site: 'https://aegis.ahmeteminyakar.workers.dev',
  output: 'static',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
