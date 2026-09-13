import { SCHERMEN } from "../state/schema.js";
import {
  laadState,
  bewaarState,
  voegItemToe,
  verwijderItem,
  vraagPersistentOpslagAan,
  bereidExportVoor,
  bereidSamenvoegingVoor,
  pasConflictKeuzesToe,
  huidigeYMD,
} from "../state/store.js";
import { absentieTotaal } from "../lib/overzicht.js";
import { initNavigatie, renderTopbar } from "./nav.js";
import { renderMaandScherm, renderWekenScherm, renderOverzichtScherm, renderVakkenScherm } from "./schermen.js";
import {
  renderThemaRegel,
  renderPersistRegel,
  renderExportRegel,
  renderConflictenPaneel,
  renderPlannerForm,
  renderEigenItemsLijst,
} from "./planner.js";

const foutEl = document.getElementById("fout-melding");
window.addEventListener("error", (e) => toonFout(e.error ?? e.message));
window.addEventListener("unhandledrejection", (e) => toonFout(e.reason));

function toonFout(fout) {
  foutEl.hidden = false;
  foutEl.textContent = `Fout: ${fout?.message ?? fout}`;
}

const topbarWeekEl = document.getElementById("topbar-week");
const topbarAbsentieEl = document.getElementById("topbar-absentie");
const instellingenKnopEl = document.getElementById("instellingen-knop");
const instellingenPaneelEl = document.getElementById("instellingen-paneel");
const instellingenSluitEl = document.getElementById("instellingen-sluit");
const themaEl = document.getElementById("thema-regel");
const persistEl = document.getElementById("persist-regel");
const exportEl = document.getElementById("export-regel");
const conflictenEl = document.getElementById("conflicten-paneel");
const formEl = document.getElementById("planner-form");
const eigenItemsEl = document.getElementById("eigen-items-lijst");

const schermEls = Object.fromEntries(SCHERMEN.map((s) => [s, document.getElementById(`scherm-${s}`)]));
const navKnopEls = [...document.querySelectorAll(".navknop")];

let state = await laadState();
let openstaandeConflicten = [];
let persistToegekend = null;

const THEMA_ATTRIBUUT = { licht: "light", donker: "dark" };

/**
 * De state bewaart de Nederlandse labelwaarden ("licht"/"donker"); styles.css
 * (fase 8A) verwacht het Engelse data-theme="light"/"dark" op <html>.
 */
function pasThemaToe(waarde) {
  const attribuut = THEMA_ATTRIBUUT[waarde];
  if (attribuut) document.documentElement.setAttribute("data-theme", attribuut);
  else document.documentElement.removeAttribute("data-theme");
}

async function wijzigUi(nieuweUi) {
  state = { ...state, ui: nieuweUi };
  await bewaarState(state);
}

async function wijzigThema(waarde) {
  pasThemaToe(waarde);
  await wijzigUi({ ...state.ui, thema: waarde });
  themaWeergeven();
}

function themaWeergeven() {
  renderThemaRegel(themaEl, state.ui.thema, wijzigThema);
}

function instellingenWeergeven() {
  themaWeergeven();
  renderPersistRegel(persistEl, persistToegekend);
  renderExportRegel(exportEl, state.laatsteExport, exporteer);
  renderConflictenPaneel(conflictenEl, openstaandeConflicten, pasConflictenToe);
  renderPlannerForm(formEl, async (veld) => {
    state = voegItemToe(state, veld);
    await bewaarState(state);
    instellingenWeergeven();
    topbarWeergeven();
  });
  renderEigenItemsLijst(eigenItemsEl, state.items, async (id) => {
    state = verwijderItem(state, id);
    await bewaarState(state);
    instellingenWeergeven();
    topbarWeergeven();
  });
}

function topbarWeergeven() {
  renderTopbar(
    { weekEl: topbarWeekEl, absentieEl: topbarAbsentieEl },
    { vandaag: huidigeYMD(), absenties: absentieTotaal(state.items) },
    () => navigatie.naarScherm("vakken")
  );
}

function downloadBestand(bestandsnaam, inhoud) {
  const blob = new Blob([inhoud], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = bestandsnaam;
  link.click();
  URL.revokeObjectURL(url);
}

async function exporteer() {
  const { state: nieuweState, bestandsnaam, inhoud } = bereidExportVoor(state);
  state = nieuweState;
  await bewaarState(state);
  downloadBestand(bestandsnaam, inhoud);
  instellingenWeergeven();
}

async function importeerBestand(bestand) {
  const tekst = await bestand.text();
  const geimporteerd = JSON.parse(tekst);
  const { items, conflicten } = bereidSamenvoegingVoor(state, geimporteerd);
  state = { ...state, items };
  await bewaarState(state);
  openstaandeConflicten = conflicten;
  instellingenWeergeven();
  topbarWeergeven();
}
exportEl.addEventListener("import-bestand", (e) => importeerBestand(e.detail));

async function pasConflictenToe(keuzes) {
  state = { ...state, items: pasConflictKeuzesToe(state.items, openstaandeConflicten, keuzes) };
  openstaandeConflicten = [];
  await bewaarState(state);
  instellingenWeergeven();
  topbarWeergeven();
}

pasThemaToe(state.ui.thema);

const navigatie = initNavigatie({
  schermEls,
  navKnopEls,
  instellingenKnopEl,
  instellingenPaneelEl,
  instellingenSluitEl,
  ui: state.ui,
  onUiWijzigen: wijzigUi,
});

renderMaandScherm(schermEls.maand);
renderWekenScherm(schermEls.weken);
renderOverzichtScherm(schermEls.overzicht);
renderVakkenScherm(schermEls.vakken);

topbarWeergeven();
instellingenWeergeven();

vraagPersistentOpslagAan().then((toegekend) => {
  persistToegekend = toegekend;
  renderPersistRegel(persistEl, persistToegekend);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
