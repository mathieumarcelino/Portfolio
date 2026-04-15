import { TranslationData } from "types/translations";

const MONTH_NAMES = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

export function formatDateText(dateString: string | null, isYearly: boolean, t: TranslationData): string {
    if (!dateString) return '';
    
    const [year, month] = dateString.split('-');
    return isYearly ? year : `${t ? t(MONTH_NAMES[parseInt(month) - 1]) : MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

export function formatPeriod(start: string, end: string | null, isCurrent: boolean, isYearly: boolean, t: TranslationData): string {
    const startStr = formatDateText(start, isYearly, t);
    const endStr = isCurrent ? t('Present') : formatDateText(end, isYearly, t);
    return endStr ? `${startStr} - ${endStr}` : startStr;
}
