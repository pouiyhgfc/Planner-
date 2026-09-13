/**
 * Seizoensdata uit DATA.md §7 — volledig ONBEKEND. Tabel 5 van het
 * onderzoeksrapport kwam voor elke maand en regio leeg terug. Het veld
 * bestaat hier zodat het later gevuld kan worden; tot die tijd toont de
 * app "seizoensdata ontbreekt", nooit een schatting (CLAUDE.md §5).
 */

/** @type {Record<number, string|null>} maand (1-12) -> seizoensdata, of null als onbekend */
export const seizoensdataPerMaand = {
  1: null,
  2: null,
  9: null,
  10: null,
  11: null,
  12: null,
};

/**
 * @param {number} maand 1-12
 * @returns {string}
 */
export function seizoensdataLabel(maand) {
  return seizoensdataPerMaand[maand] ?? "seizoensdata ontbreekt";
}
