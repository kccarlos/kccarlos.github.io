import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kccarlos.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
