// --- Types Strapi (réponse API) ---

export interface StrapiAchievement {
    value: string;
}

export interface StrapiTimeline {
    id: number;
    documentId: string;
    name: string;
    place: string;
    url: string | null;
    detail: string;
    beginning: string;
    ending: string | null;
    isCurrent: boolean;
    isYearly: boolean;
    achievements: StrapiAchievement[];
    isList: boolean;
    logo?: { url: string };
    locale: string;
}

// --- Type frontend ---

export interface TimelineData {
    type: 'experience' | 'education';
    name: string;
    place: string;
    url: string | null;
    detail: string;
    description: string[];
    isList: boolean;
    logo: string | null;
    period: string;
}