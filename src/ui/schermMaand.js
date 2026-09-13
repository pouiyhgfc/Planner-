/**
 * Orkestratie van het scherm "Maand" (fase 8C): houdt de weergegeven maand
 * en de geselecteerde dag bij (transiënt, niet in de state — alleen
 * activeScreen/scroll/thema worden bewaard, zie schema.js v3) en wisselt
 * tussen de maandkalender en het dagblad.
 */

import { parseYMD } from "../lib/date.js";
import { dayStatus } from "../lib/dayStatus.js";
import { renderMaandScherm as renderMaandGrid } from "./maandGrid.js";
import { renderDagblad } from "./dagblad.js";

/**
 * @param {HTMLElement} root
 * @param {{
 *   onItemToevoegen: (veld: object) => void,
 *   onVerwijderItem: (id: string) => void,
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 * }} callbacks
 * @returns {{render: (ctx: {vandaag: string, items: object[], afgevinkteDeadlines: string[]}) => void}}
 */
export function initMaandScherm(root, callbacks) {
  const gridEl = document.createElement("div");
  gridEl.className = "maand-inhoud";
  const dagbladEl = document.createElement("div");
  dagbladEl.className = "dagblad-paneel";
  dagbladEl.hidden = true;
  root.appendChild(gridEl);
  root.appendChild(dagbladEl);

  let jaar = null;
  let maand = null;
  let geselecteerd = null;
  let laatsteCtx = null;

  function toonMaand(j, m) {
    jaar = j;
    maand = m;
    tekenen();
  }

  function toonDag(ymd) {
    geselecteerd = ymd;
    tekenen();
  }

  function sluitDagblad() {
    geselecteerd = null;
    tekenen();
  }

  function tekenen() {
    if (!laatsteCtx) return;
    const { vandaag, items, afgevinkteDeadlines } = laatsteCtx;

    renderMaandGrid(gridEl, { jaar, maand, vandaag, geselecteerd, items }, toonDag, toonMaand);

    dagbladEl.hidden = geselecteerd === null;
    if (geselecteerd !== null) {
      const eigenItems = items.filter((item) => item.start <= geselecteerd && geselecteerd <= item.end);
      renderDagblad(
        dagbladEl,
        { ymd: geselecteerd, dag: dayStatus(geselecteerd), eigenItems, afgevinkteDeadlines },
        {
          onSluiten: sluitDagblad,
          onItemToevoegen: callbacks.onItemToevoegen,
          onAbsentieMarkeren: () =>
            callbacks.onItemToevoegen({ naam: "Absentie", start: geselecteerd, end: geselecteerd, status: "vast", notitie: "" }),
          onNotitieToevoegen: (tekst) =>
            callbacks.onItemToevoegen({ naam: "Notitie", start: geselecteerd, end: geselecteerd, status: "idee", notitie: tekst }),
          onVerwijderItem: callbacks.onVerwijderItem,
          onDeadlineToggle: callbacks.onDeadlineToggle,
        }
      );
    }
  }

  function render(ctx) {
    laatsteCtx = ctx;
    if (jaar === null) {
      const { y, m } = parseYMD(ctx.vandaag);
      jaar = y;
      maand = m;
    }
    tekenen();
  }

  /**
   * Springt naar de maand van ymd en opent meteen het dagblad van die dag —
   * gebruikt door "Open week" op het scherm Weken (fase 8D).
   * @param {string} ymd
   */
  function openDag(ymd) {
    const { y, m } = parseYMD(ymd);
    jaar = y;
    maand = m;
    geselecteerd = ymd;
    tekenen();
  }

  return { render, openDag };
}
