/**
 * Schermlichamen van de resterende hoofdtabs. Maand (8C) en Weken (8D)
 * hebben inmiddels hun eigen module; Overzicht en Vakken volgen in 8E/8F
 * en tonen tot die tijd eerlijk welke fase ze vult, geen nepdata.
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
export function renderOverzichtScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Overzicht", "Gefilterde lijst, telkaarten en projecten volgen in fase 8E."));
}

/** @param {HTMLElement} root */
export function renderVakkenScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Vakken", "Vakkaarten en detailpagina's volgen in fase 8F."));
}
