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
  zetPythonInschrijving,
  zetVakVeld,
  zetOpleveringAfgevinkt,
  zetTripStatus,
  voegReisToe,
  verwijderReis,
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
import { initVakkenScherm } from "./schermVakken.js";
import {
  renderThemaRegel,
  renderPersistRegel,
  renderExportRegel,
  renderConflictenPaneel,
  renderReisstatusPaneel,
  renderReisForm,
  renderEigenReizenLijst,
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
const reisstatusEl = document.getElementById("reisstatus-paneel");
const reisFormEl = document.getElementById("reis-form");
const eigenReizenEl = document.getElementById("eigen-reizen-lijst");
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
  renderReisstatusPaneel(reisstatusEl, state.tripStatusOverrides, (variant, nieuweStatus) => zetTripStatusEnHerteken(variant, nieuweStatus));
  renderReisForm(reisFormEl, (veld) => voegReisEnHerteken(veld));
  renderEigenReizenLijst(eigenReizenEl, state.eigenReizen, (id) => verwijderReisEnHerteken(id));
  renderPlannerForm(formEl, (veld) => voegItemEnHerteken(veld));
  renderEigenItemsLijst(eigenItemsEl, state.items, (id) => verwijderItemEnHerteken(id));
}

function pythonAfgewezen() {
  return state.pythonInschrijving === "afgewezen";
}

function topbarWeergeven() {
  renderTopbar(
    { weekEl: topbarWeekEl, absentieEl: topbarAbsentieEl },
    { vandaag: huidigeYMD(), absenties: absentieTotaal(state.items, pythonAfgewezen()) },
    () => navigatie.naarScherm("vakken")
  );
}

function maandWeergeven() {
  maandScherm.render({
    vandaag: huidigeYMD(),
    items: state.items,
    afgevinkteDeadlines: state.afgevinkteDeadlines,
    pythonAfgewezen: pythonAfgewezen(),
    tripStatusOverrides: state.tripStatusOverrides,
    eigenReizen: state.eigenReizen,
    vakkenVeldwaarden: state.vakkenVeldwaarden,
  });
}

function wekenWeergeven() {
  wekenScherm.render({
    weekWeergave: state.weekWeergave,
    vandaag: huidigeYMD(),
    pythonAfgewezen: pythonAfgewezen(),
    tripStatusOverrides: state.tripStatusOverrides,
    eigenReizen: state.eigenReizen,
  });
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

/**
 * FASE-9.md B2: "Item erbij" (met het invoerformulier al open) en de
 * tikbare dagcellen in de weekstrip openen allebei het dagblad van de
 * gekozen dag op Maand, en keren bij sluiten terug naar Weken.
 * @param {string} ymd
 * @param {{formOpenen: boolean}} opties
 */
function dagKiezenVanuitWeken(ymd, opties) {
  navigatie.naarScherm("maand");
  maandScherm.openDag(ymd, { formOpenen: opties.formOpenen, terugNaarScherm: "weken" });
}

function overzichtWeergeven() {
  overzichtScherm.render({
    vandaag: huidigeYMD(),
    items: state.items,
    afgevinkteDeadlines: state.afgevinkteDeadlines,
    afgevinkteMijlpalen: state.afgevinkteMijlpalen,
    afgevinkteOpleveringen: state.afgevinkteOpleveringen,
    eigenProjecten: state.eigenProjecten,
    pythonAfgewezen: pythonAfgewezen(),
    tripStatusOverrides: state.tripStatusOverrides,
    eigenReizen: state.eigenReizen,
    vakkenVeldwaarden: state.vakkenVeldwaarden,
  });
}

function vakkenWeergeven() {
  vakkenScherm.render({
    items: state.items,
    afgevinkteDeadlines: state.afgevinkteDeadlines,
    afgevinkteOpleveringen: state.afgevinkteOpleveringen,
    pythonInschrijving: state.pythonInschrijving,
    vakkenVeldwaarden: state.vakkenVeldwaarden,
  });
}

async function zetOpleveringEnHerteken(id, afgevinkt) {
  state = zetOpleveringAfgevinkt(state, id, afgevinkt);
  await bewaarState(state);
  overzichtWeergeven();
  vakkenWeergeven();
}

async function zetVakVeldEnHerteken(sleutel, waarde) {
  state = zetVakVeld(state, sleutel, waarde);
  await bewaarState(state);
  vakkenWeergeven();
  maandWeergeven();
  overzichtWeergeven();
}

async function zetTripStatusEnHerteken(variant, nieuweStatus) {
  state = zetTripStatus(state, variant, nieuweStatus);
  await bewaarState(state);
  instellingenWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}

async function voegReisEnHerteken(veld) {
  state = voegReisToe(state, veld);
  await bewaarState(state);
  instellingenWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}

async function verwijderReisEnHerteken(id) {
  state = verwijderReis(state, id);
  await bewaarState(state);
  instellingenWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
}

async function zetPythonInschrijvingEnHerteken(waarde) {
  state = zetPythonInschrijving(state, waarde);
  await bewaarState(state);
  vakkenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
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
  vakkenWeergeven();
}

async function verwijderItemEnHerteken(id) {
  state = verwijderItem(state, id);
  await bewaarState(state);
  instellingenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
  vakkenWeergeven();
}

async function zetDeadlineEnHerteken(sleutel, afgevinkt) {
  state = zetDeadlineAfgevinkt(state, sleutel, afgevinkt);
  await bewaarState(state);
  maandWeergeven();
  overzichtWeergeven();
  vakkenWeergeven();
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
  vakkenWeergeven();
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
  vakkenWeergeven();
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
  onVeldWijzigen: zetVakVeldEnHerteken,
  onTerugNaarScherm: (naam) => navigatie.naarScherm(naam),
});

const wekenScherm = initWekenScherm(schermEls.weken, {
  onWeekWeergaveWijzigen: wijzigWeekWeergave,
  onOpenWeek: openWeekInMaand,
  onDagKiezen: dagKiezenVanuitWeken,
});

const overzichtScherm = initOverzichtScherm(schermEls.overzicht, {
  onDeadlineToggle: zetDeadlineEnHerteken,
  onMijlpaalToggle: zetMijlpaalEnHerteken,
  onProjectToevoegen: voegProjectEnHerteken,
  onProjectVerwijderen: verwijderProjectEnHerteken,
  onOpleveringToggle: zetOpleveringEnHerteken,
});

const vakkenScherm = initVakkenScherm(schermEls.vakken, {
  onVeldWijzigen: zetVakVeldEnHerteken,
  onInschrijvingWijzigen: zetPythonInschrijvingEnHerteken,
  onDeadlineToggle: zetDeadlineEnHerteken,
  onOpleveringToggle: zetOpleveringEnHerteken,
});

topbarWeergeven();
instellingenWeergeven();
maandWeergeven();
wekenWeergeven();
overzichtWeergeven();
vakkenWeergeven();

vraagPersistentOpslagAan().then((toegekend) => {
  persistToegekend = toegekend;
  renderPersistRegel(persistEl, persistToegekend);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
