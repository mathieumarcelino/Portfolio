import { useState, useEffect, useRef } from 'react';
import { getEducations } from '../services/strapi';
import { formatPeriod } from '../utils/formatDate';
import type { StrapiAchievement, TimelineData } from '../types/experience';
import { StrapiEducation } from 'types/eduction';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function mapEducation(e: StrapiEducation, t: (key: string) => string): TimelineData {
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
        period: formatPeriod(e.beginning, e.ending, e.isCurrent, t, true),
    };
}

export function useEducations(language: 'fr' | 'en', t: (key: string) => string): TimelineData[] | null {
    const [educations, setEducations] = useState<TimelineData[] | null>(null);
    const tRef = useRef(t);
    tRef.current = t;

    useEffect(() => {
        setEducations(null);
        getEducations(language)
        .then((data) => setEducations(data.map((e) => mapEducation(e, tRef.current))))
        .catch(console.error);
    }, [language]);

    return educations;
}
