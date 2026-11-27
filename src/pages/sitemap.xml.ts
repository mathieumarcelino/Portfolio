// sitemap.xml généré au build : une URL par langue Strapi, chacune avec ses
// alternatives hreflang. lastmod = date du build, puisqu'un build a lieu à
// chaque publication dans Strapi.
import type { APIRoute } from 'astro';
import { getLocales } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const base = site!;
  const locales = await getLocales();
  const defaultLocale = locales.find((l) => l.isDefault) ?? locales[0];
  const lastmod = new Date().toISOString().slice(0, 10);
  const href = (path: string) => new URL(path, base).href;

  const alternates = [
    ...locales.map((l) => ({ hreflang: l.code, href: href(l.path) })),
    { hreflang: 'x-default', href: href(defaultLocale.path) },
  ]
    .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`)
    .join('\n');

  const urls = locales
    .map((l) => `  <url>\n    <loc>${href(l.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
