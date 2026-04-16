import { useState, useEffect } from 'react';
import { getEducations } from '../services/strapi';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPeriod } from '../utils/formatDate';
import type { StrapiTimeline, StrapiAchievement, TimelineData } from 'types/timeline';
import { TranslationData } from 'types/translations';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapEducations(data: StrapiTimeline[], t: TranslationData): TimelineData[] {
    return data.map((e) => {
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
    });
}

export function useEducations(language: string): TimelineData[] | null {
    const [raw, setRaw] = useState<StrapiTimeline[] | null>(null);
    const [educations, setEducations] = useState<TimelineData[] | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        setRaw(null);
        getEducations(language)
        .then((data) => {
            if (!data) return;
            setRaw(data);
        })
        .catch(console.error);
    }, [language]);

    useEffect(() => {
        if (!raw) { setEducations(null); return; }
        setEducations(mapEducations(raw, t));
    }, [raw, t]);

    return educations;
}
