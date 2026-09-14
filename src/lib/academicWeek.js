/**
 * Collegeweek-nummer — verplaatst uit ui/datumlabels.js (FASE-9.md B5) zodat
 * lib/weekgewicht.js dit kan hergebruiken zonder dat src/lib van src/ui
 * afhangt. ui/datumlabels.js re-exporteert collegeWeek vanaf hier, dus
 * bestaande imports elders blijven ongewijzigd werken.
 */

import { diffDays } from "./date.js";
import { semesterMarkers } from "../data/semester.js";
import { psyDates, agtechDates, rteDates, pythonDates } from "../data/coursedates.js";

const LESWEKEN_TOTAAL = Math.max(...[...psyDates, ...agtechDates, ...rteDates, ...pythonDates].map((d) => d.week));

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
