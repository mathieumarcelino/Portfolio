// --- Réponses brutes de l'API Strapi ---

export interface StrapiMedia {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiLocale {
  code: string;
  name: string;
  isDefault: boolean;
}

export interface StrapiProfile {
  firstName: string;
  lastName: string;
  job: string;
  email: string;
  description: string | null;
  image: StrapiMedia | null;
}

export interface StrapiLink {
  name: string;
  url: string;
}

export interface StrapiTranslation {
  key: string;
  value: string;
}

export interface StrapiTimeline {
  name: string;
  place: string | null;
  url: string | null;
  detail: string | null;
  beginning: string;
  ending: string | null;
  isCurrent: boolean;
  isList: boolean;
  isYearly: boolean;
  achievements: { value: string }[];
  logo: StrapiMedia | null;
}

export interface StrapiProject {
  name: string;
  description: string;
  date: string;
  url: string | null;
  github: { name: string | null; url: string }[] | null;
  languages: { name: string; boxColor: string; textColor: string }[] | null;
  image: StrapiMedia | null;
}

// --- Données consommées par les composants ---

export type Translator = (key: string) => string;

export interface LocaleData {
  code: string;
  name: string;
  isDefault: boolean;
  /** Chemin de la page : "/" pour la langue par défaut, "/<code>/" sinon. */
  path: string;
}

export interface ProfileData {
  fullName: string;
  job: string;
  email: string;
  image: string | null;
  /** Description du profil, déjà convertie de Markdown en HTML au build. */
  descriptionHtml: string;
}

export interface LinkData {
  name: string;
  url: string;
}

export interface TimelineData {
  type: 'experience' | 'education';
  name: string;
  place: string | null;
  url: string | null;
  detail: string | null;
  period: string;
  description: string[];
  isList: boolean;
  logo: string | null;
}

export interface ProjectData {
  name: string;
  description: string;
  year: string;
  /** Lien affiché (sans protocole), ou null si le projet n'a pas d'URL. */
  linkLabel: string | null;
  /** URL complète du projet, ou null. */
  href: string | null;
  image: string | null;
  github: { name: string | null; url: string }[];
  languages: { name: string; boxColor: string; textColor: string }[];
}

export interface PageData {
  locale: LocaleData;
  locales: LocaleData[];
  t: Translator;
  profile: ProfileData;
  links: LinkData[];
  experiences: TimelineData[];
  educations: TimelineData[];
  projects: ProjectData[];
}
