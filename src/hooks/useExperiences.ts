import { useState, useEffect } from 'react';
import { getExperiences } from '../services/strapi';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPeriod } from '../utils/formatDate';
import type { StrapiTimeline, StrapiAchievement, TimelineData } from '../types/timeline';
import { TranslationData } from 'types/translations';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapExperiences(data: StrapiTimeline[], t: TranslationData): TimelineData[] {
    return data.map((e) => {
        const logoUrl = e.logo?.url;
        const description =
            e.achievements.length > 0
            ? e.achievements.map((a: StrapiAchievement) => a.value)
            : [];

        return {
            type: 'experience',
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

export function useExperiences(language: string): TimelineData[] | null {
    const [experiences, setExperiences] = useState<TimelineData[] | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        setExperiences(null);
        getExperiences(language)
        .then((data) => {
            if (!data) return;
            setExperiences(mapExperiences(data, t));
        })
        .catch(console.error);
    }, [language, t]);

    return experiences;
}
