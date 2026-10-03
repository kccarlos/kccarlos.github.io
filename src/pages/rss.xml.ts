import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import { SITE, getPosts, postPath } from '../lib';

// Feed readers resolve links outside the site, so root-relative URLs must be made absolute.
const absolutize = (html: string, site: URL) =>
  html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`);

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      content: sanitizeHtml(absolutize(p.rendered?.html ?? '', context.site!), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src', 'alt', 'title'] },
      }),
      link: postPath(p),
      categories: [...p.data.categories, ...p.data.tags],
    })),
  });
}
