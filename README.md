# KC Blog

Personal blog built with [Astro](https://astro.build). Posts are Markdown files in `src/content/posts/`.

```bash
npm install
npm run dev      # local preview
npm run build    # output in dist/
```

Pushing to the `source` branch builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.
Old Hexo-style URLs (`/YYYY/MM/DD/<file-name>/`) are preserved. RSS feed: `/rss.xml`.
