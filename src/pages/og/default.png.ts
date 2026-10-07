import type { APIRoute } from 'astro';
import { SITE } from '../../lib';
import { renderCard } from '../../og';

export const GET: APIRoute = async () => {
  const png = await renderCard({ title: 'Curiosity, compiled.', meta: `${SITE.tagline}` });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
