// Client Strapi utilisé uniquement pendant le build (pages statiques).
// Le token ne quitte jamais la machine de build.
import { STRAPI_MEDIA_URL, STRAPI_TOKEN, STRAPI_URL } from 'astro:env/server';
import type { ImageData, StrapiMedia } from './types';

const API_URL = STRAPI_URL.replace(/\/$/, '');
const MEDIA_URL = (STRAPI_MEDIA_URL ?? STRAPI_URL).replace(/\/$/, '');
const TIMEOUT_MS = 15_000;

type Params = Record<string, string | string[]>;

/**
 * Appelle l'API Strapi. Toute erreur (réseau, statut HTTP, délai dépassé)
 * fait échouer le build : la version déjà en ligne reste alors en place.
 */
export async function fetchStrapi<T>(path: string, params: Params = {}): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => query.append(`${key}[${i}]`, v));
    } else {
      query.append(key, value);
    }
  }
  const qs = query.toString();
  const url = `${API_URL}/api/${path}${qs ? `?${qs}` : ''}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

  let res: Response;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    throw new Error(`Strapi injoignable (${API_URL}/api/${path}) : ${String(error)}`, { cause: error });
  }
  if (!res.ok) {
    throw new Error(`Strapi a répondu ${res.status} sur /api/${path}`);
  }
  const json = await res.json();
  // Les collections renvoient { data, meta } ; i18n/locales renvoie un tableau.
  return (json && typeof json === 'object' && 'data' in json ? json.data : json) as T;
}

/** Transforme un chemin de média Strapi (/uploads/…) en URL absolue publique. */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : `${MEDIA_URL}${url}`;
}

/** Média Strapi -> image avec URL absolue et dimensions (null si absent). */
export function resolveImage(media: StrapiMedia | null | undefined): ImageData | null {
  const src = resolveMediaUrl(media?.url);
  if (!media || !src) return null;
  const isSvg = media.mime === 'image/svg+xml' || /\.svg(\?|$)/i.test(media.url);
  // Strapi fournit toujours les dimensions des images matricielles ; valeur
  // carrée par défaut pour un SVG sans dimensions.
  return { src, width: media.width ?? 100, height: media.height ?? 100, isSvg };
}
