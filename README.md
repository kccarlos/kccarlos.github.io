# KC Blog

Personal blog built with [Astro](https://astro.build). Posts are Markdown files in `src/content/posts/`.

```bash
npm install
npm run dev      # local preview
npm run build    # output in dist/
```

Pushing to the `source` branch builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.
Old Hexo-style URLs (`/YYYY/MM/DD/<file-name>/`) are preserved. RSS feed: `/rss.xml`.

## License

- **Code** (Astro site, components, styles, scripts, workflow): [MIT](LICENSE).
- **Articles** (`src/content/posts/*.md`) **and the images made for them** (`public/uploads/`): [CC BY 4.0](LICENSE-CONTENT). Share and adapt freely, with credit to kccarlos and a link back.
- **Not covered by either license:**
  - third-party logos and images, such as the OpenCV, phpMyAdmin, Samba and Google XSS game artwork under `public/uploads/`, which belong to their owners;
  - the project icons in `public/projects/`, which belong to the respective projects;
  - the avatar and favicons in `public/`.

