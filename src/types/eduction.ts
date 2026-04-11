// --- Types Strapi (réponse API) ---

export interface StrapiAchievement {
    value: string;
}

export interface StrapiEducation {
    id: number;
    documentId: string;
    name: string;
    place: string;
    url: string;
    detail: string;
    beginning: string;
    ending: string | null;
    isCurrent: boolean;
    achievements: StrapiAchievement[];
    logo?: { url: string };
    locale: string;
}