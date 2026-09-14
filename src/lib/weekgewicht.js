/**
 * Hoe zwaar een dag/week is (FASE-9.md B5): het aantal tentamens,
 * presentaties en harde deadlines. Puur — bouwt voort op dayStatus.js,
 * geen DOM.
 *
 * "Presentatie" = een dag.vakken-item met een presentatie-label dat geen
 * tentamen is (een tentamen met een presentatie-onderdeel, zoals CHI's
 * "Midterm — presentatie", telt als tentamen — anders dubbel geteld).
 * "Harde deadline" = een dag.deadlines-item met harde: true — zie de
 * toelichting bij academicDeadlines in src/data/deadlines.js voor waarom
 * niet elke deadline meetelt (NTU-brede kalenderdata versus een concrete,
 * op Idries toegespitste grens).
 */

import { addDays, rangeDays } from "./date.js";
import { collegeWeek } from "./academicWeek.js";
import { dayStatus } from "./dayStatus.js";

/**
 * @param {ReturnType<typeof dayStatus>} dag
 * @returns {{tentamens: object[], presentaties: object[], deadlines: object[], totaal: number}}
 */
export function zwareMomentenOpDag(dag) {
  const tentamens = dag.vakken.filter((v) => v.type === "tentamen");
  const presentaties = dag.vakken.filter((v) => v.type !== "tentamen" && /presentat/i.test(v.label));
  const deadlines = dag.deadlines.filter((d) => d.harde);
  return { tentamens, presentaties, deadlines, totaal: tentamens.length + presentaties.length + deadlines.length };
}

/**
 * @param {string} maandag "YYYY-MM-DD", moet een maandag zijn
 * @param {boolean} [pythonAfgewezen]
 * @param {Record<string, string>} [tripStatusOverrides]
 * @param {object[]} [eigenReizen]
 * @returns {{week: number|null, tentamens: number, presentaties: number, deadlines: number, totaal: number}}
 */
export function weekgewicht(maandag, pythonAfgewezen = false, tripStatusOverrides = {}, eigenReizen = []) {
  let tentamens = 0;
  let presentaties = 0;
  let deadlines = 0;
  for (const ymd of rangeDays(maandag, addDays(maandag, 6))) {
    const z = zwareMomentenOpDag(dayStatus(ymd, pythonAfgewezen, tripStatusOverrides, eigenReizen));
    tentamens += z.tentamens.length;
    presentaties += z.presentaties.length;
    deadlines += z.deadlines.length;
  }
  const week = collegeWeek(maandag);
  return { week: week ? week.week : null, tentamens, presentaties, deadlines, totaal: tentamens + presentaties + deadlines };
}
