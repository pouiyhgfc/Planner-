/**
 * Navigatieschil van fase 8B: topbar, onderste tabbalk en het
 * instellingenpaneel. Beheert welk scherm actief is en de scrollpositie per
 * scherm; beide staan in de state en overleven een herlaad. Geen enkele
 * actie hier reset de scroll van een scherm dat niet gewijzigd is.
 */

import { SCHERMEN } from "../state/schema.js";
import { kortDatum, collegeWeek } from "./datumlabels.js";

const SCROLL_BEWAAR_VERTRAGING_MS = 400;

/**
 * @param {{
 *   schermEls: Record<string, HTMLElement>,
 *   navKnopEls: HTMLElement[],
 *   instellingenKnopEl: HTMLElement,
 *   instellingenPaneelEl: HTMLElement,
 *   instellingenSluitEl: HTMLElement,
 *   ui: {activeScreen: string, scrollPositions: Record<string, number>},
 *   onUiWijzigen: (nieuweUi: object) => void,
 * }} opts
 * @returns {{naarScherm: (naam: string) => void}}
 */
export function initNavigatie(opts) {
  const { schermEls, navKnopEls, instellingenKnopEl, instellingenPaneelEl, instellingenSluitEl, onUiWijzigen } = opts;
  let ui = opts.ui;
  let scrollTimer = null;

  function toonScherm(naam) {
    for (const s of SCHERMEN) schermEls[s].hidden = s !== naam;
    for (const knop of navKnopEls) knop.setAttribute("aria-current", knop.dataset.scherm === naam ? "true" : "false");
    schermEls[naam].scrollTop = ui.scrollPositions[naam] ?? 0;
  }

  function wisselScherm(naam) {
    toonScherm(naam);
    if (naam === ui.activeScreen) return;
    ui = { ...ui, activeScreen: naam };
    onUiWijzigen(ui);
  }

  for (const knop of navKnopEls) {
    knop.addEventListener("click", () => wisselScherm(knop.dataset.scherm));
  }

  for (const naam of SCHERMEN) {
    schermEls[naam].addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      const positie = schermEls[naam].scrollTop;
      scrollTimer = setTimeout(() => {
        ui = { ...ui, scrollPositions: { ...ui.scrollPositions, [naam]: positie } };
        onUiWijzigen(ui);
      }, SCROLL_BEWAAR_VERTRAGING_MS);
    });
  }

  instellingenKnopEl.addEventListener("click", () => {
    instellingenPaneelEl.hidden = false;
  });
  instellingenSluitEl.addEventListener("click", () => {
    instellingenPaneelEl.hidden = true;
  });

  toonScherm(ui.activeScreen);

  return { naarScherm: wisselScherm };
}

/**
 * @param {{weekEl: HTMLElement, absentieEl: HTMLElement}} els
 * @param {{vandaag: string, absenties: Record<string, number>}} data
 * @param {() => void} onAbsentieTik
 */
export function renderTopbar({ weekEl, absentieEl }, { vandaag, absenties }, onAbsentieTik) {
  weekEl.textContent = "";
  const datumSpan = document.createElement("span");
  datumSpan.className = "topbar-datum";
  datumSpan.textContent = kortDatum(vandaag);
  weekEl.appendChild(datumSpan);

  const weekInfo = collegeWeek(vandaag);
  if (weekInfo) {
    const weekSpan = document.createElement("span");
    weekSpan.className = "topbar-week";
    weekSpan.textContent = `week ${weekInfo.week} van ${weekInfo.totaal}`;
    weekEl.appendChild(weekSpan);
  }

  absentieEl.textContent = "";
  const knop = document.createElement("button");
  knop.type = "button";
  knop.className = "tap-target absentie-knop";
  const entries = Object.entries(absenties).filter(([, n]) => n > 0);
  if (entries.length === 0) {
    knop.textContent = "geen absenties";
  } else {
    const totaal = entries.reduce((som, [, n]) => som + n, 0);
    knop.textContent = `${entries.map(([vak, n]) => `${vak} ${n}`).join(" · ")} · totaal ${totaal}`;
  }
  knop.addEventListener("click", onAbsentieTik);
  absentieEl.appendChild(knop);
}
