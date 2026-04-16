// --- Types frontend ---

export interface ProfileData {
  firstName: string;
  lastName: string;
  job: string;
  image: string;
  email: string;
  description: string;
}

// --- Types Strapi (réponse API) ---

export interface StrapiProfile {
  id: number;
  firstName: string;
  lastName: string;
  job: string;
  email: string;
  description: string;
  image?: { url: string };
}
