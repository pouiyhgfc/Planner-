/**
 * Orkestratie van het scherm "Maand" (fase 8C): houdt de weergegeven maand
 * en de geselecteerde dag bij (transiënt, niet in de state — alleen
 * activeScreen/scroll/thema worden bewaard, zie schema.js v3) en wisselt
 * tussen de maandkalender en het dagblad.
 */

import { parseYMD, addDays } from "../lib/date.js";
import { appPeriod } from "../data/semester.js";
import { dayStatus } from "../lib/dayStatus.js";
import { weekgewicht } from "../lib/weekgewicht.js";
import { renderMaandScherm as renderMaandGrid } from "./maandGrid.js";
import { maandagVan } from "./wekenGrid.js";
import { meervoud } from "./tekst.js";
import { renderDagblad } from "./dagblad.js";

/**
 * @param {HTMLElement} root
 * @param {{
 *   onItemToevoegen: (veld: object) => void,
 *   onVerwijderItem: (id: string) => void,
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onOpleveringToggle: (id: string, afgevinkt: boolean) => void,
 *   onMijlpaalToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onVeldWijzigen: (sleutel: string, waarde: string) => void,
 *   onTerugNaarScherm: (naam: string) => void,
 *   onNaarVak: (vakId: string) => void,
 *   onKalenderWeergaveWijzigen: (waarde: "compact"|"uitgebreid") => void,
 *   onVerbergen: (sleutel: string) => void,
 * }} callbacks
 * @returns {{render: (ctx: {vandaag: string, items: object[], afgevinkteDeadlines: string[], afgevinkteOpleveringen: string[], afgevinkteMijlpalen: string[], eigenProjecten: object[], pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>, eigenReizen: object[], vakkenVeldwaarden: Record<string, string>, kalenderWeergave: "compact"|"uitgebreid"}) => void}}
 */
export function initMaandScherm(root, callbacks) {
  const weekbalkEl = document.createElement("p");
  weekbalkEl.className = "maand-weekbalk";
  const gridEl = document.createElement("div");
  gridEl.className = "maand-inhoud";
  const dagbladEl = document.createElement("div");
  dagbladEl.className = "dagblad-paneel";
  dagbladEl.hidden = true;
  root.appendChild(weekbalkEl);
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

  /**
   * Bladeren binnen het dagblad. Loopt de nieuwe dag in een andere maand,
   * dan schuift de kalender eronder mee, zodat sluiten je op de juiste maand
   * achterlaat.
   * @param {number} dagen
   */
  function verschuifDag(dagen) {
    const nieuw = addDays(geselecteerd, dagen);
    if (nieuw < appPeriod.start || nieuw > appPeriod.end) return;
    const { y, m } = parseYMD(nieuw);
    jaar = y;
    maand = m;
    geselecteerd = nieuw;
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
    const {
      vandaag,
      items,
      afgevinkteDeadlines,
      afgevinkteOpleveringen,
      afgevinkteMijlpalen,
      eigenProjecten = [],
      pythonAfgewezen,
      tripStatusOverrides = {},
      eigenReizen = [],
      vakkenVeldwaarden = {},
      kalenderWeergave = "compact",
      verborgenItems = [],
    } = laatsteCtx;

    // FASE-9.md B5 punt 4: weekbalk boven de kalender voor de week van de
    // geselecteerde dag, of vandaag als er niets geselecteerd is.
    renderWeekbalk(weekbalkEl, geselecteerd ?? vandaag, pythonAfgewezen, tripStatusOverrides, eigenReizen);

    renderMaandGrid(
      gridEl,
      { jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen, kalenderWeergave },
      toonDag,
      toonMaand,
      callbacks.onKalenderWeergaveWijzigen
    );

    dagbladEl.hidden = geselecteerd === null;
    if (geselecteerd !== null) {
      const eigenItems = items.filter((item) => item.start <= geselecteerd && geselecteerd <= item.end);
      const formOpenen = formOpenenBijVolgende;
      formOpenenBijVolgende = false;
      renderDagblad(
        dagbladEl,
        {
          ymd: geselecteerd,
          dag: dayStatus(geselecteerd, pythonAfgewezen, tripStatusOverrides, eigenReizen),
          eigenItems,
          afgevinkteDeadlines,
          afgevinkteOpleveringen,
          afgevinkteMijlpalen,
          eigenProjecten,
          pythonAfgewezen,
          vakkenVeldwaarden,
          verborgenItems,
          formOpenen,
        },
        {
          onSluiten: sluitDagblad,
          onItemToevoegen: callbacks.onItemToevoegen,
          onAbsentieMarkeren: () =>
            callbacks.onItemToevoegen({ naam: "Absentie", start: geselecteerd, end: geselecteerd, status: "vast", notitie: "" }),
          onNotitieToevoegen: (tekst) =>
            callbacks.onItemToevoegen({ naam: "Notitie", start: geselecteerd, end: geselecteerd, status: "idee", notitie: tekst }),
          onVerwijderItem: callbacks.onVerwijderItem,
          onDeadlineToggle: callbacks.onDeadlineToggle,
          onOpleveringToggle: callbacks.onOpleveringToggle,
          onMijlpaalToggle: callbacks.onMijlpaalToggle,
          onVeldWijzigen: callbacks.onVeldWijzigen,
          onNaarVak: callbacks.onNaarVak,
          onDagVerschuiven: verschuifDag,
          onVerbergen: callbacks.onVerbergen,
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

  /**
   * Zet dit scherm terug in zijn beginstand: dagblad dicht. Gebruikt als je
   * nog een keer op de al actieve tab tikt. Anders dan sluitDagblad() springt
   * dit niet terug naar het scherm waar je vandaan kwam — je bent hier juist
   * naartoe aan het navigeren.
   */
  function naarBovenkant() {
    if (geselecteerd === null) return;
    geselecteerd = null;
    terugNaarScherm = null;
    tekenen();
  }

  return { render, openDag, naarBovenkant };
}

/**
 * FASE-9.md B5 punt 4: weeknummer plus de zware momenten van die week als
 * korte opsomming, onder de topbalk. Geen collegeweek van toepassing
 * (vakantie, buiten het semester) → balk verbergen.
 * @param {HTMLElement} el
 * @param {string} ankerYmd de geselecteerde dag, of vandaag
 * @param {boolean} pythonAfgewezen
 * @param {Record<string, string>} tripStatusOverrides
 * @param {object[]} eigenReizen
 */
function renderWeekbalk(el, ankerYmd, pythonAfgewezen, tripStatusOverrides, eigenReizen) {
  const gewicht = weekgewicht(maandagVan(ankerYmd), pythonAfgewezen, tripStatusOverrides, eigenReizen);
  if (gewicht.week === null) {
    el.hidden = true;
    return;
  }
  el.hidden = false;

  const delen = [];
  if (gewicht.tentamens > 0) delen.push(meervoud(gewicht.tentamens, "tentamen", "tentamens"));
  if (gewicht.presentaties > 0) delen.push(meervoud(gewicht.presentaties, "presentatie", "presentaties"));
  if (gewicht.deadlines > 0) delen.push(meervoud(gewicht.deadlines, "deadline", "deadlines"));
  const opsomming = delen.length > 0 ? delen.join(", ") : "geen zware momenten";

  el.textContent = `Week ${gewicht.week} — ${opsomming}`;
}
