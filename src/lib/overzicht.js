/**
 * Deadlines, waarschuwingen en het overzichtspaneel van fase 6. Alles
 * berekend uit data + de vrije-blokken-motor, niets hardcoded. Elke
 * functie neemt "vandaag" als parameter (een YMD-string) zodat dit
 * testbaar is op een gesimuleerde datum — de systeemklok wordt hier
 * nergens gelezen (dat gebeurt alleen in state/store.js).
 */

import { diffDays } from "./date.js";
import { semesterMarkers } from "../data/semester.js";
import { holidays } from "../data/holidays.js";
import { chinaVisaFreeDeadline, flexWeekAnnouncementDeadline } from "../data/deadlines.js";
import { blocksWithCost, costOfRange } from "./blocks.js";

/**
 * @param {string} vandaag
 * @returns {{dagenResterend: number, label: string, zekerheid: string}}
 */
export function chinaAftelling(vandaag) {
  return {
    dagenResterend: diffDays(vandaag, chinaVisaFreeDeadline.date),
    label: chinaVisaFreeDeadline.label,
    zekerheid: chinaVisaFreeDeadline.zekerheid,
  };
}

/**
 * @param {string} vandaag
 * @returns {{dagenTotDeadline: number, gepasseerd: boolean, label: string}}
 */
export function flexWeekStatus(vandaag) {
  const dagenTotDeadline = diffDays(vandaag, flexWeekAnnouncementDeadline.date);
  return { dagenTotDeadline, gepasseerd: dagenTotDeadline < 0, label: flexWeekAnnouncementDeadline.label };
}

const CNY_NOTITIE = "vervoer en hotels extreem druk";

/**
 * Datumbereik van Chinees Nieuwjaar, afgeleid uit holidays.js (niet
 * hardcoded), met de vaste notitie uit PLAN.md fase 6.
 * @returns {{start: string, end: string, notitie: string}}
 */
export function cnyDrukte() {
  const cnyHolidays = holidays.filter((h) => h.label.includes("Nieuwjaar") || h.label.includes("CNY"));
  const datums = cnyHolidays.flatMap((h) => (h.date ? [h.date] : [h.start, h.end]));
  const start = datums.reduce((a, b) => (b < a ? b : a));
  const end = datums.reduce((a, b) => (b > a ? b : a));
  return { start, end, notitie: CNY_NOTITIE };
}

/**
 * @param {string} start
 * @param {string} end
 */
function overlaptVakantie(start, end) {
  return semesterMarkers.some((m) => m.type === "vakantie" && start <= m.end && end >= m.start);
}

/**
 * De eerste drie regels van het overzichtspaneel: aantal resterende
 * blokken per categorie, geteld vanaf (en met) vandaag. Gebruikt
 * blocksWithCost(0) (niet freeBlocks) voor de 0-absentie-blokken, want
 * alleen blocksWithCost past de dagdeel-trim toe die "3,5 dag" oplevert
 * (zie lib/blocks.js) — freeBlocks() geeft hier alleen hele dagen (3).
 * @param {string} vandaag
 * @returns {{drieËnHalf: number, vijfMetEenAbsentie: number, langBlokInVakantie: number}}
 */
export function resterendeBlokken(vandaag) {
  const nulAbsenties = blocksWithCost(0);

  const drieËnHalf = nulAbsenties.filter((b) => b.length === 3.5 && b.start >= vandaag).length;

  const vijfMetEenAbsentie = blocksWithCost(1).filter(
    (b) => b.length === 5 && b.budgetGebruikt === 1 && b.start >= vandaag
  ).length;

  const langBlokInVakantie = nulAbsenties.filter(
    (b) => b.length >= 7 && b.start >= vandaag && overlaptVakantie(b.start, b.end)
  ).length;

  return { drieËnHalf, vijfMetEenAbsentie, langBlokInVakantie };
}

/**
 * Vierde en belangrijkste regel: lopend totaal van absenties per vak door
 * al geplande items met status "vast". Items met status "idee" tellen
 * niet mee — dat is nog geen commitment.
 * @param {{start: string, end: string, status: string}[]} items
 * @returns {Record<string, number>}
 */
export function absentieTotaal(items) {
  const totaal = {};
  for (const item of items) {
    if (item.status !== "vast") continue;
    const { perVak } = costOfRange(item.start, item.end);
    for (const [vak, n] of Object.entries(perVak)) {
      totaal[vak] = (totaal[vak] ?? 0) + n;
    }
  }
  return totaal;
}
