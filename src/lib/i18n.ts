import type { LocaleData, StrapiLocale, StrapiTranslation, Translator } from './types';

/** Construit la liste des langues, langue par défaut en premier. */
export function toLocales(raw: StrapiLocale[]): LocaleData[] {
  const list = [...raw].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  if (list.length > 0 && !list.some((l) => l.isDefault)) list[0] = { ...list[0], isDefault: true };
  return list.map((l) => ({
    code: l.code,
    name: l.name,
    isDefault: l.isDefault,
    path: l.isDefault ? '/' : `/${l.code}/`,
  }));
}

/** Traductions d'interface Strapi : la clé sert de texte si elle n'est pas traduite. */
export function createTranslator(translations: StrapiTranslation[]): Translator {
  const map = new Map(translations.map(({ key, value }) => [key, value]));
  return (key) => map.get(key) ?? key;
}

/** "2019-10-01" -> "Oct. 2019" (fr), "Oct 2019" (en), ou "2019" si isYearly. */
export function formatDate(date: string | null, isYearly: boolean, locale: string): string {
  if (!date) return '';
  const [year, month] = date.split('-').map(Number);
  if (isYearly || !month) return String(year);
  const text = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

export function formatPeriod(
  start: string,
  end: string | null,
  isCurrent: boolean,
  isYearly: boolean,
  locale: string,
  t: Translator,
): string {
  const startText = formatDate(start, isYearly, locale);
  const endText = isCurrent ? t('Present') : formatDate(end, isYearly, locale);
  return endText ? `${startText} - ${endText}` : startText;
}
