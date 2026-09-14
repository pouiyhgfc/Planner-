/**
 * Rijen en telkaart-berekeningen voor het scherm "Overzicht" (fase 8E).
 * Puur — neemt "vandaag" als parameter zodat dit testbaar is op een
 * gesimuleerde datum, net als lib/overzicht.js. Bouwt uitsluitend voort op
 * bestaande, ongewijzigde src/lib- en src/data-exports.
 */

import { diffDays } from "../lib/date.js";
import { courses } from "../data/courses.js";
import { psyDates, agtechDates, rteDates, pythonDates, chineseLessons, rteActionItems } from "../data/coursedates.js";
import { holidays } from "../data/holidays.js";
import { academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline } from "../data/deadlines.js";
import { projects } from "../data/projects.js";
import { genereerKalenderDagen } from "../lib/dayStatus.js";
import { freeBlocks } from "../lib/blocks.js";
import { isStipMoment } from "./maandGrid.js";
import { deadlineSleutel } from "./dagblad.js";

const alleVakItems = [...psyDates, ...agtechDates, ...rteDates, ...pythonDates, ...chineseLessons];
export const alleDeadlineItems = [...rteActionItems, ...academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline];

function courseNaam(id) {
  return courses.find((c) => c.id === id)?.name ?? id;
}

/**
 * @param {{id: string}} project
 * @param {{datum: string, label: string}} mijlpaal
 * @returns {string}
 */
export function mijlpaalSleutel(project, mijlpaal) {
  return `${project.id}::${mijlpaal.datum}::${mijlpaal.label}`;
}

/**
 * @param {string} vandaag
 * @param {boolean} [pythonAfgewezen]
 * @returns {{datum: string, dagenResterend: number, inhoud: string}|null}
 */
export function volgendeTentamenOfPresentatie(vandaag, pythonAfgewezen = false) {
  const kandidaten = alleVakItems.filter((v) => v.date >= vandaag && isStipMoment(v) && !(pythonAfgewezen && v.course === "PY"));
  if (kandidaten.length === 0) return null;
  const eerstvolgende = kandidaten.reduce((a, b) => (a.date <= b.date ? a : b));
  return {
    datum: eerstvolgende.date,
    dagenResterend: diffDays(vandaag, eerstvolgende.date),
    inhoud: `${courseNaam(eerstvolgende.course)} — ${eerstvolgende.label}`,
  };
}

/**
 * @param {string} vandaag
 * @param {string[]} afgevinkteDeadlines
 * @returns {number}
 */
export function aantalOpenstaandeDeadlines(vandaag, afgevinkteDeadlines) {
  return alleDeadlineItems.filter((d) => {
    const datum = d.date ?? d.start;
    return datum >= vandaag && !afgevinkteDeadlines.includes(deadlineSleutel(d));
  }).length;
}

/** @param {boolean} [pythonAfgewezen] @param {Record<string, string>} [tripStatusOverrides] @returns {{datum: string, inhoud: string}[]} */
export function rijenSchooldagen(pythonAfgewezen = false, tripStatusOverrides = {}) {
  return genereerKalenderDagen(pythonAfgewezen, tripStatusOverrides)
    .filter((d) => d.status === "les")
    .map((d) => ({
      datum: d.date,
      inhoud: [...new Set(d.vakken.filter((v) => v.type === "les").map((v) => courseNaam(v.course)))].join(", "),
    }));
}

/** @param {boolean} [pythonAfgewezen] @returns {{datum: string, inhoud: string}[]} */
export function rijenTentamens(pythonAfgewezen = false) {
  return alleVakItems
    .filter((v) => v.type === "tentamen" && !(pythonAfgewezen && v.course === "PY"))
    .map((v) => ({ datum: v.date, inhoud: `${courseNaam(v.course)} — ${v.label}` }));
}

/** @returns {{datum: string, inhoud: string, deadline: object}[]} */
export function rijenDeadlines() {
  return alleDeadlineItems.map((d) => ({
    datum: d.date ?? d.start,
    inhoud: d.end && d.end !== d.start ? `${d.label} (${d.start} t/m ${d.end})` : d.label,
    deadline: d,
  }));
}

/** @param {string[]} afgevinkteMijlpalen @returns {{datum: string, inhoud: string, project: object, mijlpaal: object}[]} */
export function rijenProjecten() {
  const rijen = [];
  for (const project of projects) {
    for (const mijlpaal of project.mijlpalen) {
      rijen.push({ datum: mijlpaal.datum, inhoud: `${project.naam}: ${mijlpaal.label}`, project, mijlpaal });
    }
  }
  return rijen;
}

/** @returns {{datum: string, inhoud: string}[]} */
export function rijenFeestdagen() {
  return holidays
    .filter((h) => h.type === "feestdag")
    .map((h) => ({
      datum: h.date ?? h.start,
      inhoud: h.end && h.end !== h.start ? `${h.label} (${h.start} t/m ${h.end})` : h.label,
    }));
}

/** @param {object[]} items @returns {{datum: string, inhoud: string, item: object}[]} */
export function rijenEigenItems(items) {
  return items.map((item) => ({
    datum: item.start,
    inhoud: `${item.naam} (${item.status})${item.start !== item.end ? ` t/m ${item.end}` : ""}`,
    item,
  }));
}

/** @param {boolean} [pythonAfgewezen] @param {Record<string, string>} [tripStatusOverrides] @returns {{datum: string, inhoud: string}[]} */
export function rijenVrijeBlokken(pythonAfgewezen = false, tripStatusOverrides = {}) {
  return freeBlocks(pythonAfgewezen, tripStatusOverrides).map((b) => ({ datum: b.start, inhoud: `${b.length} dagen vrij (t/m ${b.end})` }));
}
