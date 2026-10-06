import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const toList = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

// Keep the original file name as the id so old Hexo URLs (/YYYY/MM/DD/<file-name>/) keep working.
const posts = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      archived: z.boolean().default(false),
      categories: z.union([z.string(), z.array(z.string())]).optional(),
      category: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .transform(({ categories, category, ...rest }) => ({
      ...rest,
      categories: [...toList(categories), ...toList(category)],
    })),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({ title: z.string() }).passthrough(),
});

export const collections = { posts, about };
