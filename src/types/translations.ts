// --- Types Strapi (réponse API) ---

export interface StrapiTranslation {
  id: number;
  key: string;
  value: string;
}

// --- Types frontend ---

export type TranslationData = (key: string) => string;