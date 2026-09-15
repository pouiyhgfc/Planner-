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

/**
 * Korte vaknaam voor plekken waar de volledige naam niet past: een
 * dagvakje, een chip in een lijst, de legenda. Stond eerder alleen in
 * maandGrid.js, terwijl het overal in de interface van pas komt.
 */
const AFKORTINGEN = { PSY: "PSY", PY: "PY", AGTECH: "AGT", RTE: "RTE", CHI: "CHI" };

/**
 * @param {string} vakId
 * @returns {string} de afkorting, of het id zelf als er geen afkorting is
 */
export function vakAfkorting(vakId) {
  return AFKORTINGEN[vakId] ?? vakId;
}

/**
 * De CSS-variabelen van een vak. Kleur codeert het vak, nooit de status
 * (FASE-8.md 8A).
 * @param {string} vakId
 * @returns {{achtergrond: string, tekst: string}}
 */
export function vakKleuren(vakId) {
  const naam = vakId.toLowerCase();
  return { achtergrond: `var(--vak-${naam}-bg)`, tekst: `var(--vak-${naam}-text)` };
}
