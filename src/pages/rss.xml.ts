import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getPosts, postPath } from '../lib';

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
      link: postPath(p),
      categories: [...p.data.categories, ...p.data.tags],
    })),
  });
}
