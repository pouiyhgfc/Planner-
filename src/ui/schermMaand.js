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
 *   onVeldWijzigen: (sleutel: string, waarde: string) => void,
 *   onTerugNaarScherm: (naam: string) => void,
 * }} callbacks
 * @returns {{render: (ctx: {vandaag: string, items: object[], afgevinkteDeadlines: string[], pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>, eigenReizen: object[], vakkenVeldwaarden: Record<string, string>}) => void}}
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
  let formOpenenBijVolgende = false;
  let terugNaarScherm = null;

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
    // FASE-9.md B2 punt 4: kwam je via een sprong vanuit een ander scherm
    // (bijv. Weken), dan kom je bij het sluiten daar weer terug — met
    // behouden scrollpositie via nav.js's eigen scrollPositions-logica.
    if (terugNaarScherm) {
      const scherm = terugNaarScherm;
      terugNaarScherm = null;
      tekenen();
      callbacks.onTerugNaarScherm(scherm);
      return;
    }
    tekenen();
  }

  function tekenen() {
    if (!laatsteCtx) return;
    const { vandaag, items, afgevinkteDeadlines, pythonAfgewezen, tripStatusOverrides = {}, eigenReizen = [], vakkenVeldwaarden = {} } = laatsteCtx;

    renderMaandGrid(gridEl, { jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen }, toonDag, toonMaand);

    dagbladEl.hidden = geselecteerd === null;
    if (geselecteerd !== null) {
      const eigenItems = items.filter((item) => item.start <= geselecteerd && geselecteerd <= item.end);
      const formOpenen = formOpenenBijVolgende;
      formOpenenBijVolgende = false;
      renderDagblad(
        dagbladEl,
        { ymd: geselecteerd, dag: dayStatus(geselecteerd, pythonAfgewezen, tripStatusOverrides, eigenReizen), eigenItems, afgevinkteDeadlines, pythonAfgewezen, vakkenVeldwaarden, formOpenen },
        {
          onSluiten: sluitDagblad,
          onItemToevoegen: callbacks.onItemToevoegen,
          onAbsentieMarkeren: () =>
            callbacks.onItemToevoegen({ naam: "Absentie", start: geselecteerd, end: geselecteerd, status: "vast", notitie: "" }),
          onNotitieToevoegen: (tekst) =>
            callbacks.onItemToevoegen({ naam: "Notitie", start: geselecteerd, end: geselecteerd, status: "idee", notitie: tekst }),
          onVerwijderItem: callbacks.onVerwijderItem,
          onDeadlineToggle: callbacks.onDeadlineToggle,
          onVeldWijzigen: callbacks.onVeldWijzigen,
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
   * gebruikt door "Open week" en (fase 9 B2) "Item erbij"/dagcel-tik op het
   * scherm Weken.
   * @param {string} ymd
   * @param {{formOpenen?: boolean, terugNaarScherm?: string|null}} [opties]
   *   formOpenen: opent het invoerformulier meteen (B2 punt 1).
   *   terugNaarScherm: bij sluiten van het dagblad terug naar dit scherm (B2 punt 4).
   */
  function openDag(ymd, opties = {}) {
    const { y, m } = parseYMD(ymd);
    jaar = y;
    maand = m;
    geselecteerd = ymd;
    formOpenenBijVolgende = Boolean(opties.formOpenen);
    terugNaarScherm = opties.terugNaarScherm ?? null;
    tekenen();
  }

  return { render, openDag };
}
