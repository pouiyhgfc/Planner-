/**
 * NTU academische kalender 2026-2027. Bron: DATA.md §0 en §2
 * (NTUcalendar115行事曆, bekrachtigd op de 3216e Administrative Meeting).
 * Alle markers hier zijn zekerheid ZEKER, zoals in DATA.md §2 vermeld.
 */

const BRON_KALENDER = "NTUcalendar115行事曆 (3216e Administrative Meeting)";

export const appPeriod = {
  start: "2026-09-01",
  end: "2027-02-28",
  days: 181,
  bron: "DATA.md §0",
  zekerheid: "ZEKER",
};

export const timezone = {
  user: "Asia/Taipei",
  offset: "UTC+8",
  dst: false,
  bron: "DATA.md §0",
  zekerheid: "ZEKER",
};

/** Week 12 van de kalender — deadline voor aankondiging van de flexibele week valt aan het eind hiervan. */
export const week12 = {
  start: "2026-11-22",
  end: "2026-11-28",
  bron: BRON_KALENDER,
  zekerheid: "ZEKER",
};

export const semesterMarkers = [
  { date: "2026-09-07", type: "semesterstart", label: "Lessen fall semester beginnen", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-12-18", type: "semestereinde-lessen", label: "Laatste lesdag fall semester", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-10-26", end: "2026-10-30", type: "tentamenperiode", label: "Officiële midterm-tentamenperiode", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-12-21", end: "2026-12-25", type: "tentamenperiode", label: "Officiële eindtentamenperiode", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-12-28", end: "2026-12-31", type: "risicoperiode", label: "Flexibele week — docenten mogen inhaallessen of tentamens plannen", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-12-28", end: "2027-02-19", type: "vakantie", label: "Wintervakantie", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-01-31", type: "admin", label: "Fall semester eindigt formeel", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-01", type: "admin", label: "Spring semester begint formeel (administratief)", bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2027-02-22", type: "semesterstart", label: "Lessen spring semester beginnen", bron: BRON_KALENDER, zekerheid: "ZEKER" },
];

/**
 * Kalenderregels zonder eigen datum (DATA.md §2, kalender-opmerking 1 en 2).
 * De harde deadline uit opmerking 1 (2026-11-28) staat als item in deadlines.js.
 */
export const calendarNotes = [
  {
    text: "Valt een lesdag op een feestdag, dan mogen docenten inhaallessen, tentamens of activiteiten plannen op andere weekdagen of in de flexibele week (week 16+1). Docenten moeten dit uiterlijk aan het eind van week 12 aankondigen.",
    bron: BRON_KALENDER,
    zekerheid: "ZEKER",
  },
  {
    text: "Lesuitval door natuurramp (tyfoon) volgt de aankondiging van de gemeente Taipei; of er wordt ingehaald bepaalt elke docent zelf.",
    bron: BRON_KALENDER,
    zekerheid: "ZEKER",
  },
];
