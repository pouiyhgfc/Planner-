/**
 * UI-formattering van datums en collegeweken. Puur, geen DOM. Rekent uitsluitend
 * met lib/date.js-functies en data uit src/data/ — geen new Date(), geen
 * hardcoded datums (CLAUDE.md §3/§5).
 */

import { parseYMD, dayOfWeek } from "../lib/date.js";
import { collegeWeek } from "../lib/academicWeek.js";

export { collegeWeek };

export const WEEKDAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MAANDEN_VOL = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/**
 * @param {string} ymd
 * @returns {string} bijv. "wo 4 nov"
 */
export function kortDatum(ymd) {
  const { d, m } = parseYMD(ymd);
  return `${WEEKDAGEN[dayOfWeek(ymd)]} ${d} ${MAANDEN[m - 1]}`;
}

/**
 * @param {string} ymd
 * @returns {string} bijv. "woensdag 4 november 2026"
 */
export function volledigeDatum(ymd) {
  const { y, d, m } = parseYMD(ymd);
  const VOLLE_WEEKDAGEN = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
  return `${VOLLE_WEEKDAGEN[dayOfWeek(ymd)]} ${d} ${MAANDEN_VOL[m - 1]} ${y}`;
}

/**
 * @param {number} m 1..12
 * @returns {string}
 */
export function maandNaam(m) {
  return MAANDEN_VOL[m - 1];
}
