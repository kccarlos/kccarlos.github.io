import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kccarlos.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: { '/archives/': '/posts/' },
  markdown: {
    shikiConfig: { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' }, defaultColor: false },
  },
});
