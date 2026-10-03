import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const SITE = {
  title: 'KC Blog',
  description: 'Curiosity',
  author: 'kccarlos',
};

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// Front matter dates are written as wall-clock times and parsed as UTC, so read them back as UTC.
const pad = (n: number) => String(n).padStart(2, '0');

export function postPath(post: Post): string {
  const d = post.data.date;
  return `/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${post.id}/`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export const slugify = (s: string) => s.trim().replace(/\s+/g, '-');

export function groupBy(posts: Post[], pick: (p: Post) => string[]): Map<string, Post[]> {
  const map = new Map<string, Post[]>();
  for (const p of posts) for (const k of pick(p)) map.set(k, [...(map.get(k) ?? []), p]);
  return new Map([...map].sort(([a], [b]) => a.localeCompare(b)));
}
