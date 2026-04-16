import type { StrapiProfile } from '../types/profile';
import type { StrapiLink } from '../types/link';
import type { StrapiTranslation } from '../types/translations';
import type { StrapiProject } from '../types/project';
import type { StrapiTimeline } from '../types/timeline';
import type { StrapiI18n } from 'types/i18n';


const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.REACT_APP_STRAPI_TOKEN;

async function fetchStrapi<T>(path: string, params: Record<string, string | string[]> = {}): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => query.append(`${key}[${i}]`, v));
    } else {
      query.append(key, value);
    }
  }
  const url = `${STRAPI_URL}/api/${path}${query.size ? `?${query}` : ''}`;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Strapi fetch error: ${res.status} ${url}`);
  const json = await res.json();
  return json.data ? (json.data as T) : (json as T);
}

// --- Fonctions d'accès ---

export async function getProfile(locale: string = 'fr'): Promise<StrapiProfile | null> {
  const data = await fetchStrapi<StrapiProfile>('profile', {
    locale,
    populate: '*',
  });
  return data ?? null;
}

export async function getLinks(): Promise<StrapiLink[]> {
  return fetchStrapi<StrapiLink[]>('links');
}

export async function getTranslations(locale: string = 'fr'): Promise<StrapiTranslation[] | null> {
  const data = await fetchStrapi<StrapiTranslation[]>('translations', {
    locale,
  });
  return data ?? null;
}

export async function getExperiences(locale: string = 'fr'): Promise<StrapiTimeline[]> {
  return fetchStrapi<StrapiTimeline[]>('experiences', {
    locale,
    populate: '*',
    sort: ['beginning:desc', 'isCurrent:desc'],
  });
}

export async function getEducations(locale: string = 'fr'): Promise<StrapiTimeline[]> {
  return fetchStrapi<StrapiTimeline[]>('educations', {
    locale,
    populate: '*',
    sort: ['beginning:desc', 'isCurrent:desc'],
  });
}

export async function getProjects(locale: string = 'fr'): Promise<StrapiProject[]> {
  return fetchStrapi<StrapiProject[]>('projects', {
    locale,
    populate: '*',
    sort: ['date:desc'],
  });
}

export async function getI18n(): Promise<StrapiI18n[]> {
  return fetchStrapi<StrapiI18n[]>('i18n/locales', {
    sort: ['isDefault:desc'],
  });
}