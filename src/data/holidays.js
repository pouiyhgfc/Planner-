/**
 * Feestdagen en geen-lesdagen uit DATA.md §2. Zekerheid ZEKER voor alle
 * regels in die tabel.
 */

import { rangeDays } from "../lib/date.js";

const BRON_KALENDER = "NTUcalendar115行事曆 (3216e Administrative Meeting)";

export const holidays = [
  { date: "2026-09-25", type: "feestdag", label: "Moon Festival", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-09-28", type: "feestdag", label: "Teachers' Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-10-09", type: "feestdag", label: "Inhaalvrije dag voor National Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-10-10", type: "feestdag", label: "National Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-10-25", type: "feestdag", label: "Taiwan Retrocession Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-10-26", type: "feestdag", label: "Inhaalvrije dag voor Retrocession Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-11-20", end: "2026-11-21", type: "geen-les", label: "University Games — geen lessen", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-12-25", type: "feestdag", label: "Constitution Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-01-01", type: "feestdag", label: "National Founding Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-04", type: "feestdag", label: "Avond vóór Chinees Nieuwjaarsavond", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-05", type: "feestdag", label: "Chinees Nieuwjaarsavond", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2027-02-06", end: "2027-02-08", type: "feestdag", label: "Chinees Nieuwjaar", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-09", type: "feestdag", label: "Inhaalvrije dag CNY dag 1", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-10", type: "feestdag", label: "Inhaalvrije dag CNY dag 2", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-28", type: "feestdag", label: "Peace Memorial Day", bron: BRON_KALENDER, zekerheid: "ZEKER" },
];

/**
 * Alle feestdag/geen-les datums als platte lijst van "YYYY-MM-DD" (ranges
 * uitgeklapt). Gebruikt door de General Chinese-generator in coursedates.js.
 * @returns {string[]}
 */
export function holidayDates() {
  const dates = [];
  for (const h of holidays) {
    if (h.date) {
      dates.push(h.date);
    } else {
      dates.push(...rangeDays(h.start, h.end));
    }
  }
  return dates;
}
