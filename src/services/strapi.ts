import type { StrapiProfile } from '../types/profile';
import type { StrapiLink } from '../types/link';
import type { StrapiTranslation } from '../types/translations';
import type { StrapiExperience } from '../types/experience';
import type { StrapiProject } from '../types/project';
import { StrapiEducation } from 'types/eduction';


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
  return json.data as T;
}

// --- Fonctions d'accès ---

export async function getProfile(locale: 'fr' | 'en' = 'fr'): Promise<StrapiProfile | null> {
  const data = await fetchStrapi<StrapiProfile>('profile', {
    locale,
    populate: '*',
  });
  return data ?? null;
}

export async function getLinks(): Promise<StrapiLink[]> {
  return fetchStrapi<StrapiLink[]>('links');
}

export async function getTranslations(locale: 'fr' | 'en' = 'fr'): Promise<StrapiTranslation[] | null> {
  const data = await fetchStrapi<StrapiTranslation[]>('translations', {
    locale,
    populate: '*',
  });
  return data ?? null;
}

export async function getExperiences(locale: 'fr' | 'en' = 'fr'): Promise<StrapiExperience[]> {
  return fetchStrapi<StrapiExperience[]>('experiences', {
    locale,
    populate: '*',
    sort: ['beginning:desc', 'isCurrent:desc'],
  });
}

export async function getEducations(locale: 'fr' | 'en' = 'fr'): Promise<StrapiEducation[]> {
  return fetchStrapi<StrapiEducation[]>('educations', {
    locale,
    populate: '*',
    sort: ['beginning:desc', 'isCurrent:desc'],
  });
}

export async function getProjects(locale: 'fr' | 'en' = 'fr'): Promise<StrapiProject[]> {
  return fetchStrapi<StrapiProject[]>('projects', {
    locale,
    populate: '*',
    sort: ['date:desc'],
  });
}