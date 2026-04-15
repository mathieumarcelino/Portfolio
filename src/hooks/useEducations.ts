import { useState, useEffect, useRef } from 'react';
import { getEducations } from '../services/strapi';
import { formatPeriod } from '../utils/formatDate';
import type { StrapiTimeline, StrapiAchievement, TimelineData } from 'types/timeline';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapEducation(e: StrapiTimeline, t: (key: string) => string): TimelineData {
    const logoUrl = e.logo?.url;
    const description =
        e.achievements.length > 0
        ? e.achievements.map((a: StrapiAchievement) => a.value)
        : [];

    return {
        type: 'education',
        name: e.name,
        place: e.place,
        url: e.url,
        detail: e.detail,
        description: description,
        isList: e.isList,
        logo: logoUrl ? resolveUrl(logoUrl) : null,
        period: formatPeriod(e.beginning, e.ending, e.isCurrent, e.isYearly, t)
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
