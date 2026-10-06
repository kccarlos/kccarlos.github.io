import type { APIRoute } from 'astro';
import { formatDate, getPosts, ogSlug, readingMinutes } from '../../lib';
import { renderCard } from '../../og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: ogSlug(post) }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const png = await renderCard({
    title: post.data.title,
    meta: `${formatDate(post.data.date)}  ·  ${readingMinutes(post)} min read  ·  kccarlos.github.io`,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
