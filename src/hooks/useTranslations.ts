import { useEffect, useCallback, useRef } from 'react';
import { getTranslations } from '../services/strapi';
import type { StrapiTranslation, TranslationData } from '../types/translations';

function mapTranslations(data: StrapiTranslation[]): Record<string, string> {
  return Object.fromEntries(data.map(({ key, value }) => [key, value]));
}

export function useTranslations(language: string): TranslationData {
  const mapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    getTranslations(language)
      .then((data) => {
        if (!data) return;
        mapRef.current = mapTranslations(data);
      })
      .catch(console.error);
  }, [language]);

  const t = useCallback(
    (key: string): string => mapRef.current[key] || key,
    []
  );

  return t;
}
