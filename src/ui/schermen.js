/**
 * Schermlichaam van de laatste hoofdtab. Maand (8C), Weken (8D) en
 * Overzicht (8E) hebben inmiddels hun eigen module; Vakken volgt in 8F en
 * toont tot die tijd eerlijk welke fase het vult, geen nepdata.
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
export function renderVakkenScherm(root) {
  root.textContent = "";
  root.appendChild(schermLichaam("Vakken", "Vakkaarten en detailpagina's volgen in fase 8F."));
}
