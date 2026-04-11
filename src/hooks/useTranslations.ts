import { useState, useEffect, useCallback } from 'react';
import { getTranslations } from '../services/strapi';

export function useTranslations(language: 'fr' | 'en') {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setMap({});
    getTranslations(language)
      .then((data) => {
        if (!data) return;
        setMap(Object.fromEntries(data.map(({ key, value }) => [key, value])));
      })
      .catch(console.error);
  }, [language]);

  const t = useCallback(
    (key: string, fallback = key): string => map[key] ?? fallback,
    [map]
  );

  return t;
}
