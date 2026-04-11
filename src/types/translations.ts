// --- Types frontend ---

export interface TranslationData {
  key: string;
  value: string;
}

// --- Types Strapi (réponse API) ---

export interface StrapiTranslation {
  id: number;
  key: string;
  value: string;
}
