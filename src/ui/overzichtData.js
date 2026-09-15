/**
 * Rijen en telkaart-berekeningen voor het scherm "Overzicht" (fase 8E).
 * Puur — neemt "vandaag" als parameter zodat dit testbaar is op een
 * gesimuleerde datum, net als lib/overzicht.js. Bouwt uitsluitend voort op
 * bestaande, ongewijzigde src/lib- en src/data-exports.
 */

import { diffDays } from "../lib/date.js";
import { kortDatum } from "./datumlabels.js";
import { meervoud } from "./tekst.js";
import { courseNaam } from "../data/courses.js";
import { alleVakItems, rteActionItems } from "../data/coursedates.js";
import { holidays } from "../data/holidays.js";
import { academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline } from "../data/deadlines.js";
import { projects } from "../data/projects.js";
import { opleveringen } from "../data/opleveringen.js";
import { genereerKalenderDagen } from "../lib/dayStatus.js";
import { freeBlocks } from "../lib/blocks.js";
import { alleTripItems, effectieveTripStatus } from "../data/trips.js";
import { isStipMoment } from "./maandGrid.js";
import { deadlineSleutel, mijlpaalSleutel, verborgenDeadlineSleutel, verborgenOpleveringSleutel } from "./dagblad.js";

export { mijlpaalSleutel };
export const alleDeadlineItems = [...rteActionItems, ...academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline];

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
export function aantalOpenstaandeDeadlines(vandaag, afgevinkteDeadlines, verborgenItems = []) {
  return zichtbareDeadlines(verborgenItems).filter((d) => {
    const datum = d.date ?? d.start;
    return datum >= vandaag && !afgevinkteDeadlines.includes(deadlineSleutel(d));
  }).length;
}

/**
 * Deadlines minus de items die de gebruiker heeft weggezet als niet van
 * toepassing (schema.js v12). De data blijft staan; alleen de weergave niet.
 * @param {string[]} [verborgenItems]
 * @returns {object[]}
 */
export function zichtbareDeadlines(verborgenItems = []) {
  return alleDeadlineItems.filter((d) => !verborgenItems.includes(verborgenDeadlineSleutel(d)));
}

/**
 * @param {string[]} [verborgenItems]
 * @returns {object[]}
 */
export function zichtbareOpleveringen(verborgenItems = []) {
  return opleveringen.filter((o) => !verborgenItems.includes(verborgenOpleveringSleutel(o.id)));
}

/** @param {boolean} [pythonAfgewezen] @param {Record<string, string>} [tripStatusOverrides] @param {object[]} [eigenReizen] @returns {{datum: string, inhoud: string}[]} */
export function rijenSchooldagen(pythonAfgewezen = false, tripStatusOverrides = {}, eigenReizen = []) {
  return genereerKalenderDagen(pythonAfgewezen, tripStatusOverrides, eigenReizen)
    .filter((d) => d.status === "les")
    .map((d) => ({
      datum: d.date,
      inhoud: [...new Set(d.vakken.filter((v) => v.type === "les").map((v) => courseNaam(v.course)))].join(", "),
      vak: null,
    }));
}

/**
 * FASE-9.md B1 punt 4: reizen als eigen filterchip, standaard aan. Eén rij
 * per reis (niet per dag), alleen niet-vervallen exemplaren.
 * @param {Record<string, string>} [tripStatusOverrides]
 * @param {object[]} [eigenReizen]
 * @returns {{datum: string, inhoud: string}[]}
 */
export function rijenReizen(tripStatusOverrides = {}, eigenReizen = []) {
  return alleTripItems(eigenReizen)
    .filter((t) => t.type === "vaste-boeking")
    .map((t) => ({ ...t, status: effectieveTripStatus(t, tripStatusOverrides) }))
    .filter((t) => t.status !== "vervallen")
    .map((t) => ({
      datum: t.start,
      inhoud: t.end !== t.start ? `${t.label} (${kortDatum(t.start)} t/m ${kortDatum(t.end)}) — ${t.status}` : `${t.label} — ${t.status}`,
      vak: null,
    }));
}

/** @param {boolean} [pythonAfgewezen] @returns {{datum: string, inhoud: string}[]} */
export function rijenTentamens(pythonAfgewezen = false) {
  return alleVakItems
    .filter((v) => v.type === "tentamen" && !(pythonAfgewezen && v.course === "PY"))
    // De vaknaam zat vroeger in de tekst; hij staat nu als gekleurde chip
    // voor de rij, en in de per-vak-weergave ook al in het kopje erboven.
    .map((v) => ({ datum: v.date, inhoud: v.label, vak: v.course }));
}

/** @param {string[]} [verborgenItems] @returns {{datum: string, inhoud: string, deadline: object, vak: string|null}[]} */
export function rijenDeadlines(verborgenItems = []) {
  return zichtbareDeadlines(verborgenItems).map((d) => ({
    datum: d.date ?? d.start,
    inhoud: d.end && d.end !== d.start ? `${d.label} (${kortDatum(d.start)} t/m ${kortDatum(d.end)})` : d.label,
    deadline: d,
    vak: d.course ?? null,
  }));
}

/** @param {string[]} afgevinkteMijlpalen @returns {{datum: string, inhoud: string, project: object, mijlpaal: object, vak: string|null}[]} */
export function rijenProjecten() {
  const rijen = [];
  for (const project of projects) {
    for (const mijlpaal of project.mijlpalen) {
      rijen.push({ datum: mijlpaal.datum, inhoud: `${project.naam}: ${mijlpaal.label}`, project, mijlpaal, vak: project.vak ?? null });
    }
  }
  return rijen;
}

/**
 * FASE-9.md B3: opleveringen met bekende (of zelf ingevulde) datum, zodat ze
 * in de chronologische lijst kunnen staan — een item zonder datum en zonder
 * ingevulde waarde in vakkenVeldwaarden hoort thuis op het scherm Vakken
 * (waar "onbekend" zichtbaar blijft), niet in een datumlijst.
 * @param {Record<string, string>} [vakkenVeldwaarden]
 * @returns {{datum: string, inhoud: string, oplevering: object, vak: string}[]}
 */
export function rijenOpleveringen(vakkenVeldwaarden = {}, verborgenItems = []) {
  return zichtbareOpleveringen(verborgenItems)
    .map((o) => ({ o, datum: o.datum ?? vakkenVeldwaarden[`${o.id}.datum`] ?? null }))
    .filter(({ datum }) => datum !== null)
    .map(({ o, datum }) => ({
      datum,
      inhoud: o.weging !== null ? `${o.naam} (${o.weging}%)` : o.naam,
      oplevering: o,
      vak: o.vak,
    }));
}

/** @returns {{datum: string, inhoud: string, vak: null}[]} */
export function rijenFeestdagen() {
  return holidays
    .filter((h) => h.type === "feestdag")
    .map((h) => ({
      datum: h.date ?? h.start,
      inhoud: h.end && h.end !== h.start ? `${h.label} (${kortDatum(h.start)} t/m ${kortDatum(h.end)})` : h.label,
      vak: null,
    }));
}

/** @param {object[]} items @returns {{datum: string, inhoud: string, item: object, vak: null}[]} */
export function rijenEigenItems(items) {
  return items.map((item) => ({
    datum: item.start,
    inhoud: `${item.naam} (${item.status})${item.start !== item.end ? ` t/m ${kortDatum(item.end)}` : ""}`,
    item,
    vak: null,
  }));
}

/** @param {boolean} [pythonAfgewezen] @param {Record<string, string>} [tripStatusOverrides] @param {object[]} [eigenReizen] @returns {{datum: string, inhoud: string, vak: null}[]} */
export function rijenVrijeBlokken(pythonAfgewezen = false, tripStatusOverrides = {}, eigenReizen = []) {
  return freeBlocks(pythonAfgewezen, tripStatusOverrides, eigenReizen).map((b) => ({ datum: b.start, inhoud: `${meervoud(b.length, "dag", "dagen")} vrij (t/m ${kortDatum(b.end)})`, vak: null }));
}
