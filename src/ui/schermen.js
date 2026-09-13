/**
 * Schermlichamen van de vier hoofdtabs. Fase 8B levert alleen de
 * navigatieschil; de echte inhoud komt in 8C (Maand), 8D (Weken),
 * 8E (Overzicht) en 8F (Vakken). Tot die tijd toont elk scherm eerlijk
 * welke fase het vult, geen nepdata.
 */

function schermLichaam(titel, toelichting) {
  const frag = document.createDocumentFragment();
  const kop = document.createElement("h2");
  kop.className = "scherm-kop";
  kop.textContent = titel;
  const sub = document.createElement("p");
  sub.className = "scherm-toelichting";
  sub.textContent = toelichting;
  frag.appendChild(kop);
  frag.appendChild(sub);
  return frag;
}

/** @param {HTMLElement} root */
export function renderMaandScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Maand", "Maandkalender met dagblad volgt in fase 8C."));
}

/** @param {HTMLElement} root */
export function renderWekenScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Weken", "Weekstrips met periodekiezer volgen in fase 8D."));
}

/** @param {HTMLElement} root */
export function renderOverzichtScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Overzicht", "Gefilterde lijst, telkaarten en projecten volgen in fase 8E."));
}

/** @param {HTMLElement} root */
export function renderVakkenScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Vakken", "Vakkaarten en detailpagina's volgen in fase 8F."));
}
