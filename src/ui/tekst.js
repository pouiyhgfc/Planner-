/**
 * Tekstvorming voor de interface. Puur, geen DOM.
 */

/**
 * Enkelvoud of meervoud bij een aantal. De app schreef eerder "1 dagen vrij"
 * en behielp zich elders met "lesmoment(en)"; beide lezen als een half
 * afgemaakte zin.
 * @param {number} aantal
 * @param {string} enkelvoud
 * @param {string} meervoudsvorm
 * @returns {string} bijv. "1 dag" of "6 dagen"
 */
export function meervoud(aantal, enkelvoud, meervoudsvorm) {
  return `${aantal} ${aantal === 1 ? enkelvoud : meervoudsvorm}`;
}
