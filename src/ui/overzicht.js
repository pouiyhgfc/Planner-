/**
 * Overzichtspaneel van fase 6. Alleen DOM-rendering; alle cijfers komen
 * kant-en-klaar uit lib/overzicht.js.
 */

import { chinaAftelling, flexWeekStatus, resterendeBlokken, absentieTotaal } from "../lib/overzicht.js";

/**
 * @param {HTMLElement} root
 * @param {string} vandaag
 * @param {object[]} items
 */
export function renderOverzichtPaneel(root, vandaag, items) {
  root.className = "overzicht-paneel";
  root.textContent = "";

  root.appendChild(renderChinaRegel(vandaag));
  root.appendChild(renderFlexWeekRegel(vandaag));
  root.appendChild(renderBlokkenLijst(vandaag));
  root.appendChild(renderAbsentieRegel(items));
}

/**
 * @param {string} vandaag
 */
function renderChinaRegel(vandaag) {
  const china = chinaAftelling(vandaag);
  const regel = document.createElement("div");
  regel.className = "overzicht-regel";
  regel.textContent =
    china.dagenResterend >= 0
      ? `China visumvrij: nog ${china.dagenResterend} dagen (${china.zekerheid}) — ${china.label}`
      : `China visumvrij: deadline verstreken (${china.zekerheid}) — ${china.label}`;
  return regel;
}

/**
 * @param {string} vandaag
 */
function renderFlexWeekRegel(vandaag) {
  const flex = flexWeekStatus(vandaag);
  const regel = document.createElement("div");
  regel.className = "overzicht-regel";
  if (flex.gepasseerd) {
    regel.classList.add("overzicht-waarschuwing");
    regel.textContent = `Flexibele week: deadline gepasseerd — ${flex.label}`;
  } else {
    regel.textContent = `Flexibele week: nog ${flex.dagenTotDeadline} dagen — ${flex.label}`;
  }
  return regel;
}

/**
 * @param {string} vandaag
 */
function renderBlokkenLijst(vandaag) {
  const blokken = resterendeBlokken(vandaag);
  const lijst = document.createElement("ol");
  lijst.className = "overzicht-blokken";
  lijst.appendChild(regelItem(`${blokken.drieËnHalf}× blok van 3,5 dag zonder absentie`));
  lijst.appendChild(regelItem(`${blokken.vijfMetEenAbsentie}× blok van 5 dagen bij 1 absentie`));
  lijst.appendChild(regelItem(`${blokken.langBlokInVakantie}× blok van ≥7 dagen in de wintervakantie`));
  return lijst;
}

/**
 * @param {object[]} items
 */
function renderAbsentieRegel(items) {
  const totaal = absentieTotaal(items);
  const regel = document.createElement("div");
  regel.className = "overzicht-regel overzicht-absenties";
  const entries = Object.entries(totaal);
  regel.textContent =
    entries.length > 0
      ? `Al ingeplande absenties (vast): ${entries.map(([vak, n]) => `${vak}: ${n}×`).join(", ")}`
      : "Al ingeplande absenties (vast): geen";
  return regel;
}

/**
 * @param {string} tekst
 */
function regelItem(tekst) {
  const li = document.createElement("li");
  li.textContent = tekst;
  return li;
}
