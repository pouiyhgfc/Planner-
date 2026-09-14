/**
 * Harde deadlines. chinaVisaFreeDeadline (§5) en flexWeekAnnouncement
 * (§2 kalender-opmerking 1) zijn de twee die fase 6 expliciet gebruikt.
 * academicDeadlines bevat de overige deadline/admin-regels uit de
 * kalendertabel in §2, zodat geen enkel item uit DATA.md wordt weggelaten.
 *
 * harde (FASE-9.md B5): telt dit item mee als "harde deadline" voor het
 * weekgewicht (src/lib/weekgewicht.js)? chinaVisaFreeDeadline/
 * flexWeekAnnouncementDeadline/japanUitersteTerugkomstDeadline zijn dat
 * altijd — concrete, op Idries toegespitste grenzen. academicDeadlines zijn
 * dat NIET: het zijn NTU-brede administratieve kalenderdata (vakkeuze,
 * vak-toevoegen/laten-vallen, course withdrawal) die voor iedere student
 * gelden en niets zeggen over hoe zwaar een specifieke lesweek is — anders
 * zou bijv. de 15 dagen lange "Midterm course survey"-periode elke dag
 * binnen dat venster laten meetellen als een eigen "zwaar moment".
 */

const BRON_KALENDER = "NTUcalendar115行事曆 (3216e Administrative Meeting)";

export const chinaVisaFreeDeadline = {
  date: "2026-12-31",
  label: "Visumvrije regeling China verloopt (24:00)",
  regeling: {
    geldigTot: "2026-12-31, 24:00",
    maxVerblijf: "30 dagen, gerekend vanaf 00:00 de dag ná inreis",
    inreisvoorwaarde: "Alleen de inreisdatum moet binnen het venster vallen; de 30 dagen lopen daarna door",
    toegestaneDoelen: "zaken, toerisme, familie/vrienden, uitwisseling, transit. Werk en studie uitgesloten",
  },
  harde: true,
  bron: "Gemini-rapport (geen bron-URL)",
  zekerheid: "TE VERIFIËREN",
};

export const flexWeekAnnouncementDeadline = {
  date: "2026-11-28",
  label: "Flexibele week bevestigd? (uiterlijk eind week 12)",
  harde: true,
  bron: BRON_KALENDER,
  zekerheid: "ZEKER",
};

/**
 * Harde grens uit FASE-9.md A2: een reis moet afgelopen zijn vóór de RTE
 * technical visit + Assignment #7 (2026-11-19, DATA.md §3.3) — een excursie
 * is niet in te halen. Staat los van welke Japan-boekingsvariant actief is
 * (DATA.md §4.1).
 */
export const japanUitersteTerugkomstDeadline = {
  date: "2026-11-19",
  label: "Uiterste terugkomst (RTE technical visit + Assignment #7 — niet in te halen)",
  harde: true,
  bron: "FASE-9.md A2 (opgave Idries)",
  zekerheid: "ZEKER",
};

/** Overige deadline/admin-regels uit DATA.md §2, niet elders ondergebracht. */
export const academicDeadlines = [
  { date: "2026-09-19", type: "deadline", label: "Laatste dag online vakken laten vallen", harde: false, bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-09-21", type: "deadline", label: "Laatste dag online vakken toevoegen", harde: false, bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-09-23", end: "2026-09-24", type: "deadline", label: "Bevestiging vakkeuze (vanaf 10:00)", harde: false, bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { start: "2026-10-19", end: "2026-11-02", type: "admin", label: "Midterm course survey", harde: false, bron: BRON_KALENDER, zekerheid: "ZEKER" },
  { date: "2026-12-11", type: "deadline", label: "Laatste dag course withdrawal (17:00)", harde: false, bron: BRON_KALENDER, zekerheid: "ZEKER" },
];
