import { useState, useEffect } from 'react';
import { getI18n } from '../services/strapi';
import type { I18nData, StrapiI18n } from '../types/i18n';

function mapI18n(data: StrapiI18n[]): I18nData[] {
  return data.map(i => ({
    name: i.name,
    code: i.code,
    isDefault: i.isDefault,
  }));
}

export function useI18n() {
  const [i18n, setI18n] = useState<I18nData[]>([]);

  useEffect(() => {
    setI18n([]);
    getI18n()
      .then((data) => {
        if (!data) return;
        setI18n(mapI18n(data));
      })
      .catch(console.error);
  }, []);

  return i18n;
}
