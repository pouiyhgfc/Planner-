/**
 * Statusbepaling per dag — de kern van fase 2. Puur op data uit src/data/*,
 * geen DOM, geen Date-object.
 */

import { rangeDays, dayOfWeek, isoWeek } from "./date.js";
import { appPeriod, semesterMarkers } from "../data/semester.js";
import { holidays } from "../data/holidays.js";
import { courses } from "../data/courses.js";
import { alleVakItems, rteActionItems } from "../data/coursedates.js";
import { alleTripItems, effectieveTripStatus } from "../data/trips.js";
import { chinaVisaFreeDeadline, flexWeekAnnouncementDeadline, academicDeadlines, japanUitersteTerugkomstDeadline } from "../data/deadlines.js";

const alleDeadlineItems = [...rteActionItems, ...academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline, japanUitersteTerugkomstDeadline];

export const DAGDEEL_NAMEN = ["ochtend", "middag", "avond"];
const OCHTEND_EINDE = "12:10";
const MIDDAG_EINDE = "18:25";

/**
 * @param {string} ymd
 * @param {{date?: string|null, start?: string, end?: string}} item
 * @returns {boolean}
 */
function valtOpDatum(ymd, item) {
  if (item.date) return item.date === ymd;
  if (item.start && item.end) return ymd >= item.start && ymd <= item.end;
  return false;
}

/**
 * @param {string} hhmm
 * @returns {"ochtend"|"middag"|"avond"}
 */
export function dagdeelVoorTijd(hhmm) {
  if (hhmm < OCHTEND_EINDE) return "ochtend";
  if (hhmm < MIDDAG_EINDE) return "middag";
  return "avond";
}

function legeDagdelen() {
  const d = {};
  for (const naam of DAGDEEL_NAMEN) d[naam] = { bezet: false, redenen: [] };
  return d;
}

/**
 * @param {string} ymd
 * @param {boolean} [pythonAfgewezen] Python-inschrijving afgewezen op het scherm "Vakken"
 *   (fase 8F) — het vak telt dan niet meer mee. Standaard false: geen gedragswijziging
 *   voor bestaande aanroepen.
 * @param {Record<string, string>} [tripStatusOverrides] state.tripStatusOverrides
 *   (FASE-9.md A2) — overschrijft de standaardstatus van een reisvariant, bijv.
 *   nadat de gebruiker een omboeking bevestigt. Standaard {}: elke reisvariant
 *   gebruikt dan zijn eigen status-veld uit trips.js, dus geen gedragswijziging
 *   voor bestaande aanroepen.
 * @param {object[]} [eigenReizen] state.eigenReizen (FASE-9.md B1 punt 5) —
 *   door de gebruiker zelf toegevoegde reizen, dezelfde vorm als trips.js
 *   na eigenReisItems(). Standaard []: geen gedragswijziging voor bestaande aanroepen.
 * @returns {object} status van één dag
 */
export function dayStatus(ymd, pythonAfgewezen = false, tripStatusOverrides = {}, eigenReizen = []) {
  const weekday = dayOfWeek(ymd);
  const { isoYear, week } = isoWeek(ymd);

  // Alle niet-vervallen reisitems zijn zichtbaar (FASE-9.md A2 punt 3), maar
  // alleen "geboekt" telt mee voor de dagstatus en de bezette dagdelen —
  // "wijziging-aangevraagd" is een vergelijking, geen vervanging (A2 punt 5).
  const vasteBoekingen = alleTripItems(eigenReizen)
    .filter((t) => valtOpDatum(ymd, t))
    .map((t) => ({ ...t, status: effectieveTripStatus(t, tripStatusOverrides) }))
    .filter((t) => t.status !== "vervallen");
  const geboekteBoekingen = vasteBoekingen.filter((t) => t.status === "geboekt");
  const vakken = alleVakItems.filter((v) => valtOpDatum(ymd, v) && !(pythonAfgewezen && v.course === "PY"));
  const deadlines = alleDeadlineItems.filter((d) => valtOpDatum(ymd, d));
  const feestdagen = holidays.filter((h) => valtOpDatum(ymd, h));
  const vakantie = semesterMarkers.some((m) => m.type === "vakantie" && valtOpDatum(ymd, m));
  const tentamenperiode = semesterMarkers.some((m) => m.type === "tentamenperiode" && valtOpDatum(ymd, m));
  const risicoperiode = semesterMarkers.some((m) => m.type === "risicoperiode" && valtOpDatum(ymd, m));

  const heeftVasteBoeking = geboekteBoekingen.length > 0;
  const heeftTentamen = vakken.some((v) => v.type === "tentamen");
  const heeftFeestdag = feestdagen.some((h) => h.type === "feestdag");
  const heeftGeenLes = feestdagen.some((h) => h.type === "geen-les");
  const heeftLes = vakken.some((v) => v.type === "les");

  // Voorrangsorde bij samenloop: vaste boeking > tentamen > feestdag/geen-les > les > vakantie > vrij.
  let status;
  if (heeftVasteBoeking) status = "vaste-boeking";
  else if (heeftTentamen) status = "tentamen";
  else if (heeftFeestdag) status = "feestdag";
  else if (heeftGeenLes) status = "geen-les";
  else if (heeftLes) status = "les";
  else if (vakantie) status = "vakantie";
  else status = "vrij";

  const dagdelen = legeDagdelen();
  if (heeftVasteBoeking) {
    for (const naam of DAGDEEL_NAMEN) {
      dagdelen[naam].bezet = true;
      dagdelen[naam].redenen.push(...geboekteBoekingen.map((v) => v.label));
    }
  } else {
    for (const v of vakken) {
      const course = courses.find((c) => c.id === v.course);
      if (!course) continue;
      const deel = dagdeelVoorTijd(course.start);
      dagdelen[deel].bezet = true;
      dagdelen[deel].redenen.push(`${course.name}: ${v.label}`);
    }
  }

  return {
    date: ymd,
    weekday,
    isoYear,
    isoWeek: week,
    status,
    dagdelen,
    vakken,
    deadlines,
    vasteBoekingen,
    feestdagen,
    tentamenperiode,
    risicoperiode,
  };
}

/**
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 * @param {object[]} [eigenReizen]
 * @returns {ReturnType<typeof dayStatus>[]} status van alle 181 dagen in de app-periode
 */
export function genereerKalenderDagen(pythonAfgewezen = false, tripStatusOverrides = {}, eigenReizen = []) {
  return rangeDays(appPeriod.start, appPeriod.end).map((ymd) => dayStatus(ymd, pythonAfgewezen, tripStatusOverrides, eigenReizen));
}
