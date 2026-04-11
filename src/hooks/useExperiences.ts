import { useState, useEffect, useRef } from 'react';
import { getExperiences } from '../services/strapi';
import { formatPeriod } from '../utils/formatDate';
import type { StrapiExperience, StrapiAchievement, TimelineData } from '../types/experience';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function mapExperience(e: StrapiExperience, t: (key: string) => string): TimelineData {
    const logoUrl = e.logo?.url;
    const description =
        e.achievements.length > 0
            ? e.achievements.map((a: StrapiAchievement) => a.value)
            : [];

    return {
        name: e.name,
        place: e.place,
        url: e.url,
        detail: e.detail,
        description: description,
        logo: logoUrl
            ? logoUrl.startsWith('http')
                ? logoUrl
                : `${STRAPI_URL}${logoUrl}`
            : '',
        period: formatPeriod(e.beginning, e.ending, e.isCurrent, t),
    };
}

export function useExperiences(language: 'fr' | 'en', t: (key: string) => string): TimelineData[] | null {
    const [experiences, setExperiences] = useState<TimelineData[] | null>(null);
    const tRef = useRef(t);
    tRef.current = t;

    useEffect(() => {
        setExperiences(null);
        getExperiences(language)
        .then((data) => setExperiences(data.map((e) => mapExperience(e, tRef.current))))
        .catch(console.error);
    }, [language]);

    return experiences;
}
