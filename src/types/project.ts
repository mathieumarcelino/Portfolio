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

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  url: string;
  formats: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
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
  image: StrapiImage | null;
  locale: string;
}

// --- Type frontend ---

export interface ProjectLanguage {
  name: string;
  boxColor: string;
  textColor: string;
}

export interface ProjectData {
  name: string;
  image: string;
  description: string;
  date: string;
  languages: ProjectLanguage[];
  link: string;
  github: Array<{ name: string; url: string }>;
}
