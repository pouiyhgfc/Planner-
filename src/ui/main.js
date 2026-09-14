import { SCHERMEN } from "../state/schema.js";
import {
  laadState,
  bewaarState,
  voegItemToe,
  verwijderItem,
  zetDeadlineAfgevinkt,
  zetMijlpaalAfgevinkt,
  voegProjectToe,
  verwijderProject,
  vraagPersistentOpslagAan,
  bereidExportVoor,
  bereidSamenvoegingVoor,
  pasConflictKeuzesToe,
  huidigeYMD,
} from "../state/store.js";
import { absentieTotaal } from "../lib/overzicht.js";
import { initNavigatie, renderTopbar } from "./nav.js";
import { initMaandScherm } from "./schermMaand.js";
import { initWekenScherm } from "./schermWeken.js";
import { initOverzichtScherm } from "./schermOverzicht.js";
import { renderVakkenScherm } from "./schermen.js";
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
  renderPlannerForm(formEl, (veld) => voegItemEnHerteken(veld));
  renderEigenItemsLijst(eigenItemsEl, state.items, (id) => verwijderItemEnHerteken(id));
}

function topbarWeergeven() {
  renderTopbar(
    { weekEl: topbarWeekEl, absentieEl: topbarAbsentieEl },
    { vandaag: huidigeYMD(), absenties: absentieTotaal(state.items) },
    () => navigatie.naarScherm("vakken")
  );
}

function maandWeergeven() {
  maandScherm.render({ vandaag: huidigeYMD(), items: state.items, afgevinkteDeadlines: state.afgevinkteDeadlines });
}

function wekenWeergeven() {
  wekenScherm.render({ weekWeergave: state.weekWeergave, vandaag: huidigeYMD() });
}

async function wijzigWeekWeergave(nieuweWeekWeergave) {
  state = { ...state, weekWeergave: nieuweWeekWeergave };
  await bewaarState(state);
  wekenWeergeven();
}

function openWeekInMaand(ymd) {
  navigatie.naarScherm("maand");
  maandScherm.openDag(ymd);
}

function overzichtWeergeven() {
  overzichtScherm.render({
    vandaag: huidigeYMD(),
    items: state.items,
    afgevinkteDeadlines: state.afgevinkteDeadlines,
    afgevinkteMijlpalen: state.afgevinkteMijlpalen,
    eigenProjecten: state.eigenProjecten,
  });
}

async function voegProjectEnHerteken(veld) {
  state = voegProjectToe(state, veld);
  await bewaarState(state);
  overzichtWeergeven();
}

async function verwijderProjectEnHerteken(id) {
  state = verwijderProject(state, id);
  await bewaarState(state);
  overzichtWeergeven();
}

async function zetMijlpaalEnHerteken(sleutel, afgevinkt) {
  state = zetMijlpaalAfgevinkt(state, sleutel, afgevinkt);
  await bewaarState(state);
  overzichtWeergeven();
}

async function voegItemEnHerteken(veld) {
  state = voegItemToe(state, veld);
  await bewaarState(state);
  instellingenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}

async function verwijderItemEnHerteken(id) {
  state = verwijderItem(state, id);
  await bewaarState(state);
  instellingenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}

async function zetDeadlineEnHerteken(sleutel, afgevinkt) {
  state = zetDeadlineAfgevinkt(state, sleutel, afgevinkt);
  await bewaarState(state);
  maandWeergeven();
  overzichtWeergeven();
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
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}
exportEl.addEventListener("import-bestand", (e) => importeerBestand(e.detail));

async function pasConflictenToe(keuzes) {
  state = { ...state, items: pasConflictKeuzesToe(state.items, openstaandeConflicten, keuzes) };
  openstaandeConflicten = [];
  await bewaarState(state);
  instellingenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
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

const maandScherm = initMaandScherm(schermEls.maand, {
  onItemToevoegen: voegItemEnHerteken,
  onVerwijderItem: verwijderItemEnHerteken,
  onDeadlineToggle: zetDeadlineEnHerteken,
});

const wekenScherm = initWekenScherm(schermEls.weken, {
  onWeekWeergaveWijzigen: wijzigWeekWeergave,
  onOpenWeek: openWeekInMaand,
  onItemToevoegen: voegItemEnHerteken,
});

const overzichtScherm = initOverzichtScherm(schermEls.overzicht, {
  onDeadlineToggle: zetDeadlineEnHerteken,
  onMijlpaalToggle: zetMijlpaalEnHerteken,
  onProjectToevoegen: voegProjectEnHerteken,
  onProjectVerwijderen: verwijderProjectEnHerteken,
});

renderVakkenScherm(schermEls.vakken);

topbarWeergeven();
instellingenWeergeven();
maandWeergeven();
wekenWeergeven();
overzichtWeergeven();

vraagPersistentOpslagAan().then((toegekend) => {
  persistToegekend = toegekend;
  renderPersistRegel(persistEl, persistToegekend);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
