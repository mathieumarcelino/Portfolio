import { useEffect, useCallback, useState } from 'react';
import { getTranslations } from '../services/strapi';
import type { StrapiTranslation, TranslationData } from '../types/translations';

function mapTranslations(data: StrapiTranslation[]): Record<string, string> {
  return Object.fromEntries(data.map(({ key, value }) => [key, value]));
}

export function useTranslations(language: string): TranslationData {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    getTranslations(language)
      .then((data) => {
        if (!data) return;
        setMap(mapTranslations(data));
      })
      .catch(console.error);
  }, [language]);

  const t = useCallback(
    (key: string): string => map[key] ?? key,
    [map]
  );

  return t;
}
