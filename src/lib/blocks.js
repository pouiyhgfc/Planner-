/**
 * Vrije-blokken-motor. Puur op data, geen UI, geen Date-object.
 *
 * Een kalenderdag is "hard" (nooit te missen: tentamen, vaste boeking,
 * RTE-deadline-actie of een semesterstart-dag), "les-only" (te missen tegen
 * een kostprijs) of "vrij". isFree/freeBlocks werken op deze drie categorieën
 * op hele-dag-niveau.
 *
 * Eén verfijning zit in blocksWithCost: als de dag ná een vrije reeks alléén
 * 's avonds bezet is (vanaf 18:25, zoals General Chinese), telt de ochtend/
 * middag van die dag nog gratis mee. Dat reproduceert DATA.md's "vrijdag
 * 00:00 → maandag 18:25 = 3,5 dag" zonder Chinees te hoeven missen.
 */

import { rangeDays, diffDays } from "./date.js";
import { appPeriod, semesterMarkers } from "../data/semester.js";
import { courses } from "../data/courses.js";
import { psyDates, agtechDates, rteDates, pythonDates, chineseLessons, rteActionItems } from "../data/coursedates.js";
import { trips, effectieveTripStatus } from "../data/trips.js";

const alleLesItems = [...psyDates, ...agtechDates, ...rteDates, ...pythonDates, ...chineseLessons];
const AVOND_BEGIN = "18:25";

function courseVoor(id) {
  return courses.find((c) => c.id === id);
}

/**
 * @param {string} ymd
 * @param {{date?: string|null, start?: string, end?: string}} item
 */
function valtOpDatum(ymd, item) {
  if (item.date) return item.date === ymd;
  if (item.start && item.end) return ymd >= item.start && ymd <= item.end;
  return false;
}

/**
 * @param {{course: string}[]} items
 * @returns {boolean} true als alle items pas vanaf AVOND_BEGIN beginnen
 */
function heeftAlleenAvondLes(items) {
  return items.length > 0 && items.every((v) => courseVoor(v.course).start >= AVOND_BEGIN);
}

/**
 * @param {string} ymd
 * @param {boolean} [pythonAfgewezen] Python-inschrijving afgewezen (fase 8F) — telt dan niet mee.
 * @param {Record<string, string>} [tripStatusOverrides] FASE-9.md A2 — alleen een
 *   reisvariant met effectieve status "geboekt" blokkeert de dag hard;
 *   "wijziging-aangevraagd" telt niet mee (geen gedragswijziging bij default {}).
 * @returns {{kind: "hard"|"les-only"|"vrij", items: object[]}}
 */
function classifyDay(ymd, pythonAfgewezen = false, tripStatusOverrides = {}) {
  if (trips.some((t) => valtOpDatum(ymd, t) && effectieveTripStatus(t, tripStatusOverrides) === "geboekt")) return { kind: "hard", items: [] };
  if (semesterMarkers.some((m) => m.type === "semesterstart" && m.date === ymd)) return { kind: "hard", items: [] };

  const vakken = alleLesItems.filter((v) => v.date === ymd && !(pythonAfgewezen && v.course === "PY"));
  const tentamens = vakken.filter((v) => v.type === "tentamen");
  if (tentamens.length > 0) return { kind: "hard", items: tentamens };

  const acties = rteActionItems.filter((d) => d.date === ymd);
  if (acties.length > 0) return { kind: "hard", items: acties };

  const lessen = vakken.filter((v) => v.type === "les");
  if (lessen.length > 0) return { kind: "les-only", items: lessen };

  return { kind: "vrij", items: [] };
}

/**
 * @param {string} ymd
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 * @returns {boolean} geen les, tentamen, deadline-actie of vaste boeking die dag. Feestdag en vakantie tellen als vrij.
 */
export function isFree(ymd, pythonAfgewezen = false, tripStatusOverrides = {}) {
  return classifyDay(ymd, pythonAfgewezen, tripStatusOverrides).kind === "vrij";
}

/**
 * @param {string} start
 * @param {string} end
 */
function bevatRisicoperiode(start, end) {
  return rangeDays(start, end).some((d) => semesterMarkers.some((m) => m.type === "risicoperiode" && valtOpDatum(d, m)));
}

/**
 * Alle maximale aaneengesloten reeksen vrije hele dagen (geen dagdeel-trim).
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 * @returns {{start: string, end: string, length: number, bevatRisicoperiode: boolean}[]}
 */
export function freeBlocks(pythonAfgewezen = false, tripStatusOverrides = {}) {
  const dagen = rangeDays(appPeriod.start, appPeriod.end);
  const blokken = [];
  let start = null;
  for (let i = 0; i < dagen.length; i++) {
    if (isFree(dagen[i], pythonAfgewezen, tripStatusOverrides)) {
      if (start === null) start = dagen[i];
      if (i === dagen.length - 1) blokken.push(maakVrijBlok(start, dagen[i]));
      continue;
    }
    if (start !== null) {
      blokken.push(maakVrijBlok(start, dagen[i - 1]));
      start = null;
    }
  }
  return blokken;
}

function maakVrijBlok(start, end) {
  return { start, end, length: diffDays(start, end) + 1, bevatRisicoperiode: bevatRisicoperiode(start, end) };
}

/**
 * Blokken die ontstaan als je bereid bent tot maxMissedClassDays lesdagen te
 * missen. Elk blok begint bij een vrije dag en wordt zo ver mogelijk naar
 * voren verlengd door les-only dagen "op te kopen", tot het budget op is of
 * een harde dag wordt geraakt.
 * @param {number} maxMissedClassDays
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 * @returns {{start: string, end: string, length: number, budgetGebruikt: number, gemisteLessen: object[], bevatRisicoperiode: boolean}[]}
 */
export function blocksWithCost(maxMissedClassDays, pythonAfgewezen = false, tripStatusOverrides = {}) {
  const dagen = rangeDays(appPeriod.start, appPeriod.end);
  const blokken = [];
  let i = 0;
  while (i < dagen.length) {
    if (!isFree(dagen[i], pythonAfgewezen, tripStatusOverrides)) {
      i++;
      continue;
    }
    const blok = verlengVanaf(dagen, i, maxMissedClassDays, pythonAfgewezen, tripStatusOverrides);
    blokken.push(blok);
    i = dagen.indexOf(blok.end) + 1;
  }
  return blokken;
}

/**
 * @param {string[]} dagen
 * @param {number} startIdx
 * @param {number} budget
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 */
function verlengVanaf(dagen, startIdx, budget, pythonAfgewezen = false, tripStatusOverrides = {}) {
  const start = dagen[startIdx];
  let end = start;
  let length = 0;
  let budgetGebruikt = 0;
  const gemisteLessen = [];
  let idx = startIdx;

  while (idx < dagen.length) {
    const ymd = dagen[idx];
    const info = classifyDay(ymd, pythonAfgewezen, tripStatusOverrides);

    if (info.kind === "vrij") {
      end = ymd;
      length += 1;
      idx++;
      continue;
    }

    if (info.kind === "les-only") {
      if (budgetGebruikt < budget) {
        budgetGebruikt += 1;
        for (const v of info.items) gemisteLessen.push({ course: v.course, date: v.date, label: v.label });
        end = ymd;
        length += 1;
        idx++;
        continue;
      }
      if (heeftAlleenAvondLes(info.items)) {
        end = ymd;
        length += 0.5;
      }
      break;
    }

    break; // hard
  }

  return { start, end, length, budgetGebruikt, gemisteLessen, bevatRisicoperiode: bevatRisicoperiode(start, end) };
}

/**
 * Kosten van een al vastliggend datumbereik (bijv. een geboekte reis): welke
 * lesmomenten (les én tentamen) vallen erbinnen, en hoeveel per vak.
 * @param {string} start
 * @param {string} end
 * @param {boolean} [pythonAfgewezen]
 * @returns {{items: object[], perVak: Record<string, number>}}
 */
export function costOfRange(start, end, pythonAfgewezen = false) {
  const dagenInRange = new Set(rangeDays(start, end));
  const items = alleLesItems.filter((v) => dagenInRange.has(v.date) && !(pythonAfgewezen && v.course === "PY"));
  const perVak = {};
  for (const v of items) perVak[v.course] = (perVak[v.course] || 0) + 1;
  return { items, perVak };
}
