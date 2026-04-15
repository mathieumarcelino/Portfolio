// --- Types frontend ---

export interface I18nData {
  name: string;
  code: string;
  isDefault: boolean;
}

// --- Types Strapi (réponse API) ---

export interface StrapiI18n {
  id: number;
  name: string;
  code: string;
  isDefault: boolean;
}
