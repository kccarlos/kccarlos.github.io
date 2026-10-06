import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const font = (pkg: string, file: string) => readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = [
  { name: 'Nunito', data: font('nunito', 'nunito-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'Mono', data: font('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
];

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function renderCard(opts: { title: string; meta: string }): Promise<Uint8Array> {
  const size = opts.title.length > 70 ? 54 : opts.title.length > 40 ? 66 : 80;
  const dot = (c: string) => el('div', { width: 18, height: 18, borderRadius: 9, background: c, marginRight: 10 }, '');
  const tree = el('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#11111b', padding: 48 }, [
    el('div', { display: 'flex', flexDirection: 'column', flex: 1, background: '#1e1e2e', border: '2px solid #45475a', borderRadius: 24, overflow: 'hidden' }, [
      el('div', { display: 'flex', alignItems: 'center', padding: '20px 28px', background: '#181825', borderBottom: '2px solid #313244' }, [
        dot('#f38ba8'), dot('#f9e2af'), dot('#a6e3a1'),
        el('div', { display: 'flex', marginLeft: 14, fontFamily: 'Mono', fontSize: 22, color: '#6c7086' }, 'kc@blog: ~/writing'),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '44px 56px 40px' }, [
        el('div', { display: 'flex', fontFamily: 'Mono', fontSize: 30, color: '#a6e3a1' }, '$ cat article.md'),
        el('div', { display: 'flex', fontFamily: 'Nunito', fontWeight: 800, fontSize: size, lineHeight: 1.1, letterSpacing: -1.5, color: '#cdd6f4' }, opts.title),
        el('div', { display: 'flex', justifyContent: 'space-between', fontFamily: 'Mono', fontSize: 24, color: '#a6adc8' }, [
          el('div', { display: 'flex' }, opts.meta),
          el('div', { display: 'flex', color: '#cba6f7' }, '^_^'),
        ]),
      ]),
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
}
