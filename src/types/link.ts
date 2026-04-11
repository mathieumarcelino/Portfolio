// --- Types frontend ---

export interface LinkData {
  name: string;
  url: string;
}

// --- Types Strapi (réponse API) ---

export interface StrapiLink {
  id: number;
  name: string;
  url: string;
}
