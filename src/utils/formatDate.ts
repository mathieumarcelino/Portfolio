export function formatDateText(dateString: string, isYearly?: boolean): string {
    if (!dateString) return dateString;

    // Année seule → retourner telle quelle
    if (/^\d{4}$/.test(dateString)) return dateString;

    // YYYY-MM ou YYYY-MM-DD → formater
    const match = dateString.match(/^(\d{4})-(\d{2})/);
    if (!match) return dateString;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const monthNames = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

    return isYearly ? `${year}` : `${monthNames[month]} ${year}`;
}

export function formatPeriod(start: string, end: string | null | undefined, isCurrent?: boolean, t?: (key: string) => string, isYearly?: boolean): { start: string; end: string } {
    return {
        start: formatDateText(start, isYearly),
        end: isCurrent || !end ? (t ? t("Present") : "Aujourd'hui") : formatDateText(end, isYearly),
    };
}
