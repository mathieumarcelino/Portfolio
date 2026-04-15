// --- Types Strapi (réponse API) ---

export interface StrapiGithub {
  id: number;
  name: string;
  url: string;
}

export interface StrapiLanguage {
  id: number;
  name: string;
  boxColor: string;
  textColor: string;
}

export interface StrapiProject {
  id: number;
  documentId: string;
  name: string;
  description: string;
  date: string;
  url: string;
  github: StrapiGithub[];
  languages: StrapiLanguage[];
  image?: { url: string };
  locale: string;
}

// --- Type frontend ---

export interface ProjectLanguage {
  name: string;
  boxColor: string;
  textColor: string;
}

export interface ProjetGithub {
  name: string;
  url: string;
}

export interface ProjectData {
  name: string;
  image: string | null;
  description: string;
  date: string;
  languages: ProjectLanguage[];
  link: string;
  github: ProjetGithub[];
}
