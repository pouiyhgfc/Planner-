/**
 * Berekeningen voor het scherm "Vakken" (fase 8F). Puur — bouwt voort op
 * bestaande src/lib- en src/data-exports, geen nieuwe kalenderlogica.
 */

import { courses } from "../data/courses.js";
import { psyDates, agtechDates, rteDates, pythonDates, chineseLessons } from "../data/coursedates.js";
import { costOfRange } from "../lib/blocks.js";

const LESOVERZICHT_PER_VAK = {
  PSY: psyDates,
  AGTECH: agtechDates,
  RTE: rteDates,
  PY: pythonDates,
  CHI: chineseLessons,
};

/**
 * @param {string} vakId
 * @returns {object[]} alle lesmomenten van dat vak, chronologisch
 */
export function lesoverzicht(vakId) {
  return [...(LESOVERZICHT_PER_VAK[vakId] ?? [])].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Alle al geplande ("vast") absenties die sessies van vakId raken.
 * @param {string} vakId
 * @param {object[]} items eigen items uit de state
 * @param {boolean} [pythonAfgewezen]
 * @returns {{date: string, label: string}[]}
 */
export function gemisteSessies(vakId, items, pythonAfgewezen = false) {
  const resultaat = [];
  for (const item of items) {
    if (item.status !== "vast") continue;
    const { items: gemist } = costOfRange(item.start, item.end, pythonAfgewezen);
    for (const v of gemist) {
      if (v.course === vakId) resultaat.push({ date: v.date, label: v.label });
    }
  }
  return resultaat.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Chinees heeft twee onafhankelijke absentiegrenzen (DATA.md §3.4) die niet
 * met elkaar verrekend mogen worden: een uren-vrijstelling met puntenaftrek
 * erna, en een fractie-faaldrempel over het aantal sessies.
 * @param {object[]} items
 * @returns {{
 *   gemisteSessies: number, totaalSessies: number,
 *   urenGebruikt: number, vrijstellingUren: number, urenBovenVrijstelling: number, aftrek: number,
 *   fractieGemist: number, drempelFractie: number, drempelAantal: number, drempelBereikt: boolean,
 * }}
 */
export function chineseAbsentieStand(items) {
  const chi = courses.find((c) => c.id === "CHI");
  const { puntenaftrek, faaldrempel } = chi.absentieregels;

  const gemist = gemisteSessies("CHI", items);
  const totaalSessies = chineseLessons.length;
  const urenGebruikt = gemist.length * puntenaftrek.uurPerSessie;
  const urenBovenVrijstelling = Math.max(0, urenGebruikt - puntenaftrek.vrijstellingUren);
  const aftrek = urenBovenVrijstelling * puntenaftrek.aftrekPerUurBovenVrijstelling;

  const fractieGemist = totaalSessies > 0 ? gemist.length / totaalSessies : 0;

  return {
    gemisteSessies: gemist.length,
    totaalSessies,
    urenGebruikt,
    vrijstellingUren: puntenaftrek.vrijstellingUren,
    urenBovenVrijstelling,
    aftrek,
    fractieGemist,
    drempelFractie: faaldrempel.drempelFractieSessies,
    drempelAantal: faaldrempel.drempelOngeoorloofdeAbsenties,
    drempelBereikt: fractieGemist > faaldrempel.drempelFractieSessies || gemist.length >= faaldrempel.drempelOngeoorloofdeAbsenties,
  };
}
