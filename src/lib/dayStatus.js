/**
 * Statusbepaling per dag — de kern van fase 2. Puur op data uit src/data/*,
 * geen DOM, geen Date-object.
 */

import { rangeDays, dayOfWeek, isoWeek } from "./date.js";
import { appPeriod, semesterMarkers } from "../data/semester.js";
import { holidays } from "../data/holidays.js";
import { courses } from "../data/courses.js";
import { psyDates, agtechDates, rteDates, chineseLessons, chineseExamSlots, rteActionItems } from "../data/coursedates.js";
import { trips } from "../data/trips.js";
import { chinaVisaFreeDeadline, flexWeekAnnouncementDeadline, academicDeadlines } from "../data/deadlines.js";

const alleVakItems = [...psyDates, ...agtechDates, ...rteDates, ...chineseLessons, ...chineseExamSlots];
const alleDeadlineItems = [...rteActionItems, ...academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline];

const DAGDEEL_NAMEN = ["ochtend", "middag", "avond"];
const OCHTEND_EINDE = "12:10";
const MIDDAG_EINDE = "18:00";

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
function dagdeelVoorTijd(hhmm) {
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
 * @returns {object} status van één dag
 */
export function dayStatus(ymd) {
  const weekday = dayOfWeek(ymd);
  const { isoYear, week } = isoWeek(ymd);

  const vasteBoekingen = trips.filter((t) => valtOpDatum(ymd, t));
  const vakken = alleVakItems.filter((v) => valtOpDatum(ymd, v));
  const deadlines = alleDeadlineItems.filter((d) => valtOpDatum(ymd, d));
  const feestdagen = holidays.filter((h) => valtOpDatum(ymd, h));
  const vakantie = semesterMarkers.some((m) => m.type === "vakantie" && valtOpDatum(ymd, m));
  const tentamenperiode = semesterMarkers.some((m) => m.type === "tentamenperiode" && valtOpDatum(ymd, m));
  const risicoperiode = semesterMarkers.some((m) => m.type === "risicoperiode" && valtOpDatum(ymd, m));

  const heeftVasteBoeking = vasteBoekingen.length > 0;
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
      dagdelen[naam].redenen.push(...vasteBoekingen.map((v) => v.label));
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
 * @returns {ReturnType<typeof dayStatus>[]} status van alle 181 dagen in de app-periode
 */
export function genereerKalenderDagen() {
  return rangeDays(appPeriod.start, appPeriod.end).map(dayStatus);
}
