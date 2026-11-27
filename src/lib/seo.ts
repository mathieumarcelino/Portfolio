// Métadonnées SEO d'une page de langue : title, description, Open Graph,
// hreflang et données structurées (JSON-LD Person).
import type { LocaleData, PageData, Translator } from './types';

export interface Alternate {
  hreflang: string;
  href: string;
}

export interface Seo {
  title: string;
  description: string;
  imageAlt: string;
  ogLocale: string;
  ogLocaleAlternates: string[];
  alternates: Alternate[];
  jsonLd: Record<string, unknown>;
}

const DESCRIPTION_MAX = 155;

// Codes Strapi courts -> locales Open Graph (langue_PAYS).
const OG_LOCALES: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  pt: 'pt_PT',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
};

export function toOgLocale(code: string): string {
  if (code.includes('-')) {
    const [lang, region] = code.split('-');
    return `${lang.toLowerCase()}_${region.toUpperCase()}`;
  }
  return OG_LOCALES[code] ?? `${code}_${code.toUpperCase()}`;
}

/** Texte brut d'un fragment HTML (balises retirées, espaces normalisés). */
export function htmlToText(html: string): string {
  return html
    // Balises de bloc -> espace ; balises en ligne (<strong>, <a>…) -> rien,
    // pour ne pas créer d'espace avant la ponctuation.
    .replace(/<\/?(p|br|li|ul|ol|div|h[1-6]|blockquote)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Coupe un texte à la dernière fin de mot avant max caractères. */
export function truncate(text: string, max = DESCRIPTION_MAX): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

/** Traduction Strapi si elle existe, sinon la valeur de repli. */
function translated(t: Translator, key: string, fallback: string): string {
  const value = t(key);
  return value && value !== key ? value : fallback;
}

function absolute(path: string, site: URL): string {
  return new URL(path, site).href;
}

export function buildSeo(data: PageData, site: URL): Seo {
  const { t, profile, links, experiences, locale, locales } = data;

  const fallbackTitle = `${profile.fullName} | Portfolio`;
  const fallbackDescription = truncate(htmlToText(profile.descriptionHtml)) || fallbackTitle;
  const title = translated(t, 'meta.title', fallbackTitle);
  const description = truncate(translated(t, 'meta.description', fallbackDescription));
  const imageAlt = profile.job ? `${profile.fullName}, ${profile.job}` : profile.fullName;

  const defaultLocale = locales.find((l) => l.isDefault) ?? locales[0];
  const alternates: Alternate[] = [
    ...locales.map((l: LocaleData) => ({ hreflang: l.code, href: absolute(l.path, site) })),
    { hreflang: 'x-default', href: absolute(defaultLocale.path, site) },
  ];

  const pageUrl = absolute(locale.path, site);
  const current = experiences.find((e) => e.isCurrent);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    url: pageUrl,
    email: `mailto:${profile.email}`,
    ...(profile.job && { jobTitle: profile.job }),
    ...(profile.image && { image: profile.image }),
    ...(description && { description }),
    ...(current?.place && {
      worksFor: {
        '@type': 'Organization',
        name: current.place,
        ...(current.url && { url: current.url }),
      },
    }),
    ...(links.length > 0 && { sameAs: links.map((l) => l.url) }),
  };

  return {
    title,
    description,
    imageAlt,
    ogLocale: toOgLocale(locale.code),
    ogLocaleAlternates: locales.filter((l) => l.code !== locale.code).map((l) => toOgLocale(l.code)),
    alternates,
    jsonLd,
  };
}
