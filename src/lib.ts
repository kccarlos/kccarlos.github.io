import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const SITE = {
  title: 'KC Blog',
  description: 'Curiosity',
  author: 'kccarlos',
  tagline: 'Notes by KC on AI engineering, full-stack and ad systems.',
  url: 'https://kccarlos.github.io',
  github: 'https://github.com/kccarlos',
  linkedin: 'https://www.linkedin.com/in/kecheng-an/',
};

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const isActive = (p: Post) => !p.data.archived;

// Front matter dates are written as wall-clock times and parsed as UTC, so read them back as UTC.
const pad = (n: number) => String(n).padStart(2, '0');

export function postPath(post: Post): string {
  const d = post.data.date;
  return `/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${post.id}/`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export const ogSlug = (p: Post) => p.id.replace(/\./g, '-');

export const slugify = (s: string) => s.trim().replace(/\s+/g, '-');

const stripTags = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/\s+/g, ' ').trim();

export function readingMinutes(post: Post): number {
  const words = stripTags(post.rendered?.html ?? '').split(' ').length;
  return Math.max(1, Math.round(words / 220));
}

// An explicit front matter description wins; otherwise use the first text paragraph.
export function excerpt(post: Post, max = 170): string {
  if (post.data.description) return post.data.description;
  const paras = [...(post.rendered?.html ?? '').matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  const text = stripTags(paras.find((p) => !p.includes('<img') && stripTags(p).length > 20) ?? '');
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}

// First image of a post doubles as its card thumbnail.
export function leadImage(post: Post): { src: string; alt: string } | undefined {
  const m = (post.rendered?.html ?? '').match(/<img[^>]*?src="([^"]+)"[^>]*?>/);
  if (!m) return undefined;
  const alt = m[0].match(/alt="([^"]*)"/)?.[1] ?? '';
  return { src: m[1], alt };
}

export function groupBy(posts: Post[], pick: (p: Post) => string[]): Map<string, Post[]> {
  const map = new Map<string, Post[]>();
  for (const p of posts) for (const k of pick(p)) map.set(k, [...(map.get(k) ?? []), p]);
  return new Map([...map].sort(([a], [b]) => a.localeCompare(b)));
}
