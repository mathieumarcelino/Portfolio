// Récupération et mise en forme des données Strapi pour une page de langue.
import { marked } from 'marked';
import { createTranslator, formatPeriod, toLocales } from './i18n';
import { fetchStrapi, resolveMediaUrl } from './strapi';
import type {
  LocaleData,
  PageData,
  ProjectData,
  StrapiLink,
  StrapiLocale,
  StrapiProfile,
  StrapiProject,
  StrapiTimeline,
  StrapiTranslation,
  TimelineData,
  Translator,
} from './types';

const PAGE_SIZE = '100';

export async function getLocales(): Promise<LocaleData[]> {
  const locales = toLocales(await fetchStrapi<StrapiLocale[]>('i18n/locales'));
  if (locales.length === 0) throw new Error('Aucune langue configurée dans Strapi (i18n/locales).');
  return locales;
}

function mapTimeline(items: StrapiTimeline[], type: TimelineData['type'], locale: string, t: Translator): TimelineData[] {
  return items.map((e) => ({
    type,
    name: e.name,
    place: e.place,
    url: e.url,
    detail: e.detail,
    period: formatPeriod(e.beginning, e.ending, e.isCurrent, e.isYearly, locale, t),
    description: (e.achievements ?? []).map((a) => a.value),
    isList: e.isList,
    logo: resolveMediaUrl(e.logo?.url),
  }));
}

function mapProjects(items: StrapiProject[]): ProjectData[] {
  return items.map((p) => {
    const linkLabel = p.url ? p.url.replace(/^https?:\/\//, '') : null;
    return {
      name: p.name,
      description: p.description,
      year: p.date.substring(0, 4),
      linkLabel,
      href: p.url ? (/^https?:\/\//.test(p.url) ? p.url : `https://${p.url}`) : null,
      image: resolveMediaUrl(p.image?.url),
      github: p.github ?? [],
      languages: (p.languages ?? []).map(({ name, boxColor, textColor }) => ({ name, boxColor, textColor })),
    };
  });
}

export async function getPageData(locale: LocaleData, locales: LocaleData[]): Promise<PageData> {
  const code = locale.code;
  const timelineParams = { locale: code, populate: '*', sort: ['beginning:desc', 'isCurrent:desc'], 'pagination[pageSize]': PAGE_SIZE };

  const [profile, links, translations, experiences, educations, projects] = await Promise.all([
    fetchStrapi<StrapiProfile | null>('profile', { locale: code, populate: '*' }),
    fetchStrapi<StrapiLink[]>('links', { 'pagination[pageSize]': PAGE_SIZE }),
    fetchStrapi<StrapiTranslation[]>('translations', { locale: code, 'pagination[pageSize]': PAGE_SIZE }),
    fetchStrapi<StrapiTimeline[]>('experiences', timelineParams),
    fetchStrapi<StrapiTimeline[]>('educations', timelineParams),
    fetchStrapi<StrapiProject[]>('projects', {
      locale: code,
      populate: '*',
      sort: ['date:desc'],
      'pagination[pageSize]': PAGE_SIZE,
    }),
  ]);

  if (!profile) throw new Error(`Aucun profil publié dans Strapi pour la langue "${code}".`);
  const t = createTranslator(translations);

  return {
    locale,
    locales,
    t,
    profile: {
      fullName: `${profile.firstName} ${profile.lastName}`,
      job: profile.job ?? '',
      email: profile.email,
      image: resolveMediaUrl(profile.image?.url),
      // Contenu saisi dans notre propre CMS : rendu Markdown au build.
      // trim() : le saut de ligne final de marked créerait une ligne vide
      // (le conteneur est en white-space: pre-line).
      descriptionHtml: profile.description ? (await marked.parse(profile.description)).trim() : '',
    },
    links: links.map(({ name, url }) => ({ name, url })),
    experiences: mapTimeline(experiences, 'experience', code, t),
    educations: mapTimeline(educations, 'education', code, t),
    projects: mapProjects(projects),
  };
}
