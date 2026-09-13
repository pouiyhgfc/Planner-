/**
 * UI-formattering van datums en collegeweken. Puur, geen DOM. Rekent uitsluitend
 * met lib/date.js-functies en data uit src/data/ — geen new Date(), geen
 * hardcoded datums (CLAUDE.md §3/§5).
 */

import { parseYMD, dayOfWeek, diffDays } from "../lib/date.js";
import { semesterMarkers } from "../data/semester.js";
import { psyDates, agtechDates, rteDates, pythonDates } from "../data/coursedates.js";

const WEEKDAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

const LESWEKEN_TOTAAL = Math.max(...[...psyDates, ...agtechDates, ...rteDates, ...pythonDates].map((d) => d.week));

/**
 * @param {string} ymd
 * @returns {string} bijv. "wo 4 nov"
 */
export function kortDatum(ymd) {
  const { d, m } = parseYMD(ymd);
  return `${WEEKDAGEN[dayOfWeek(ymd)]} ${d} ${MAANDEN[m - 1]}`;
}

/**
 * Collegeweek van een datum binnen het lopende semester, geteld vanaf de
 * meest recente semesterstart-marker op of vóór ymd. null buiten het
 * lesweken-venster (vakantie, tentamenperiode na week 16, voor semesterstart).
 * @param {string} ymd
 * @returns {{week: number, totaal: number}|null}
 */
export function collegeWeek(ymd) {
  const start = semesterMarkers
    .filter((m) => m.type === "semesterstart" && m.date <= ymd)
    .map((m) => m.date)
    .sort()
    .at(-1);
  if (!start) return null;

  const week = Math.floor(diffDays(start, ymd) / 7) + 1;
  if (week < 1 || week > LESWEKEN_TOTAAL) return null;
  return { week, totaal: LESWEKEN_TOTAAL };
}
