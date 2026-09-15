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
  zetKalenderWeergave,
  zetTripStatus,
  voegReisToe,
  verwijderReis,
  wijzigItem,
  wijzigReis,
  zetItemVerborgen,
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
import { verborgenOmschrijving } from "./verborgen.js";
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
  renderVerborgenLijst,
  renderInstallRegel,
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
const installEl = document.getElementById("install-regel");
const exportEl = document.getElementById("export-regel");
const conflictenEl = document.getElementById("conflicten-paneel");
const reisstatusEl = document.getElementById("reisstatus-paneel");
const reisFormEl = document.getElementById("reis-form");
const eigenReizenEl = document.getElementById("eigen-reizen-lijst");
const formEl = document.getElementById("planner-form");
const eigenItemsEl = document.getElementById("eigen-items-lijst");
const verborgenEl = document.getElementById("verborgen-lijst");
const reisUitklapEl = document.getElementById("reis-uitklap");
const itemUitklapEl = document.getElementById("item-uitklap");

const schermEls = Object.fromEntries(SCHERMEN.map((s) => [s, document.getElementById(`scherm-${s}`)]));
const navKnopEls = [...document.querySelectorAll(".navknop")];

let state = await laadState();
let openstaandeConflicten = [];
let persistToegekend = null;
// Chrome bewaart het installatie-aanbod niet: je moet het event vasthouden en
// later zelf prompt() aanroepen, anders is de kans verkeken.
let installPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
  instellingenWeergeven();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  instellingenWeergeven();
});

async function installeren() {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  instellingenWeergeven();
}
// Welk eigen item of welke eigen reis op dit moment bewerkt wordt; null =
// het formulier staat in "toevoegen"-stand.
let bewerktItemId = null;
let bewerkteReisId = null;

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
  renderInstallRegel(
    installEl,
    { beschikbaar: installPrompt !== null, geinstalleerd: window.matchMedia("(display-mode: standalone)").matches },
    installeren
  );
  renderPersistRegel(persistEl, persistToegekend);
  renderExportRegel(exportEl, state.laatsteExport, exporteer);
  renderConflictenPaneel(conflictenEl, openstaandeConflicten, pasConflictenToe);
  renderReisstatusPaneel(reisstatusEl, state.tripStatusOverrides, (variant, nieuweStatus) => zetTripStatusEnHerteken(variant, nieuweStatus));
  renderVerborgenLijst(
    verborgenEl,
    state.verborgenItems.map((sleutel) => ({ sleutel, omschrijving: verborgenOmschrijving(sleutel) })),
    (sleutel) => verbergEnHerteken(sleutel, false)
  );
}

/**
 * @param {HTMLDetailsElement} el
 * @param {boolean} openen alleen afdwingen, nooit dichtklappen wat de
 *   gebruiker zelf heeft opengezet
 * @param {string} titel
 */
function zetUitklap(el, openen, titel) {
  if (openen) el.open = true;
  el.querySelector("summary").textContent = titel;
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
    afgevinkteOpleveringen: state.afgevinkteOpleveringen,
    afgevinkteMijlpalen: state.afgevinkteMijlpalen,
    eigenProjecten: state.eigenProjecten,
    pythonAfgewezen: pythonAfgewezen(),
    tripStatusOverrides: state.tripStatusOverrides,
    eigenReizen: state.eigenReizen,
    vakkenVeldwaarden: state.vakkenVeldwaarden,
    kalenderWeergave: state.kalenderWeergave,
    verborgenItems: state.verborgenItems,
  });
}

/**
 * Alle zes de weergaven opnieuw tekenen. Stond eerder vijf keer als dezelfde
 * reeks aanroepen uitgeschreven, met per plek net een andere volgorde of een
 * vergeten scherm.
 */
function allesWeergeven() {
  instellingenWeergeven();
  topbarWeergeven();
  maandWeergeven();
  wekenWeergeven();
  overzichtWeergeven();
  vakkenWeergeven();
}

function startItemBewerken(id) {
  bewerktItemId = id;
  overzichtWeergeven();
  itemUitklapEl.scrollIntoView({ block: "nearest" });
}

function startReisBewerken(id) {
  bewerkteReisId = id;
  overzichtWeergeven();
  reisUitklapEl.scrollIntoView({ block: "nearest" });
}

/** Opslaan is toevoegen óf bijwerken, afhankelijk van wat er in bewerking is. */
async function itemOpslaan(veld) {
  state = bewerktItemId ? wijzigItem(state, bewerktItemId, veld) : voegItemToe(state, veld);
  bewerktItemId = null;
  await bewaarState(state);
  allesWeergeven();
}

async function reisOpslaan(veld) {
  state = bewerkteReisId ? wijzigReis(state, bewerkteReisId, veld) : voegReisToe(state, veld);
  bewerkteReisId = null;
  await bewaarState(state);
  allesWeergeven();
}

/**
 * Een vast item (deadline of oplevering) wegzetten als niet van toepassing,
 * of die keuze terugdraaien. De data in src/data/ blijft ongemoeid.
 * @param {string} sleutel
 * @param {boolean} verborgen
 */
async function verbergEnHerteken(sleutel, verborgen = true) {
  state = zetItemVerborgen(state, sleutel, verborgen);
  await bewaarState(state);
  allesWeergeven();
}

async function zetKalenderWeergaveEnHerteken(waarde) {
  state = zetKalenderWeergave(state, waarde);
  await bewaarState(state);
  maandWeergeven();
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
 * FASE-9.md B4: het lesblok in het dagblad heeft een tikdoel "Naar vak" dat
 * rechtstreeks naar de detailpagina van dat vak springt.
 * @param {string} vakId
 */
function naarVak(vakId) {
  navigatie.naarScherm("vakken");
  vakkenScherm.openVak(vakId);
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

/**
 * Hetzelfde vanuit Overzicht: het ⋯-menu en de knop "Item toevoegen" openen
 * het dagblad van die dag en komen bij sluiten terug op Overzicht.
 * @param {string} ymd
 * @param {{formOpenen: boolean}} opties
 */
function dagKiezenVanuitOverzicht(ymd, opties) {
  navigatie.naarScherm("maand");
  maandScherm.openDag(ymd, { formOpenen: opties.formOpenen, terugNaarScherm: "overzicht" });
}

/**
 * Je eigen items en reizen stonden onder Instellingen, waar je ze niet zoekt:
 * het zijn geen instellingen maar inhoud. Ze staan nu onder de lijst op
 * Overzicht, op het scherm waar je ze ook ziet staan.
 */
function eigenBeheerWeergeven() {
  const bewerktItem = state.items.find((i) => i.id === bewerktItemId) ?? null;
  renderPlannerForm(formEl, (veld) => itemOpslaan(veld), bewerktItem ? { item: bewerktItem } : undefined);
  // Het formulier zit in een ingeklapt blok; bij bewerken moet het openstaan,
  // anders lijkt "Bewerken" niets te doen.
  zetUitklap(itemUitklapEl, Boolean(bewerktItem), bewerktItem ? "Item bewerken" : "Item toevoegen");
  renderEigenItemsLijst(eigenItemsEl, state.items, (id) => verwijderItemEnHerteken(id), (id) => startItemBewerken(id));

  const bewerkteReis = state.eigenReizen.find((r) => r.id === bewerkteReisId) ?? null;
  renderReisForm(reisFormEl, (veld) => reisOpslaan(veld), bewerkteReis);
  zetUitklap(reisUitklapEl, Boolean(bewerkteReis), bewerkteReis ? "Reis bewerken" : "Reis toevoegen");
  renderEigenReizenLijst(eigenReizenEl, state.eigenReizen, (id) => verwijderReisEnHerteken(id), (id) => startReisBewerken(id));
}

function overzichtWeergeven() {
  eigenBeheerWeergeven();
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
    verborgenItems: state.verborgenItems,
  });
}

function vakkenWeergeven() {
  vakkenScherm.render({
    items: state.items,
    afgevinkteDeadlines: state.afgevinkteDeadlines,
    afgevinkteOpleveringen: state.afgevinkteOpleveringen,
    pythonInschrijving: state.pythonInschrijving,
    vakkenVeldwaarden: state.vakkenVeldwaarden,
    verborgenItems: state.verborgenItems,
  });
}

async function zetOpleveringEnHerteken(id, afgevinkt) {
  state = zetOpleveringAfgevinkt(state, id, afgevinkt);
  await bewaarState(state);
  overzichtWeergeven();
  vakkenWeergeven();
  maandWeergeven();
}

async function zetVakVeldEnHerteken(sleutel, waarde) {
  state = zetVakVeld(state, sleutel, waarde);
  await bewaarState(state);
  vakkenWeergeven();
  maandWeergeven();
  overzichtWeergeven();
  instellingenWeergeven();
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
  maandWeergeven();
}

async function voegItemEnHerteken(veld) {
  state = voegItemToe(state, veld);
  await bewaarState(state);
  allesWeergeven();
}

async function verwijderItemEnHerteken(id) {
  state = verwijderItem(state, id);
  await bewaarState(state);
  allesWeergeven();
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
  allesWeergeven();
}
exportEl.addEventListener("import-bestand", (e) => importeerBestand(e.detail));

async function pasConflictenToe(keuzes) {
  state = { ...state, items: pasConflictKeuzesToe(state.items, openstaandeConflicten, keuzes) };
  openstaandeConflicten = [];
  await bewaarState(state);
  allesWeergeven();
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
  onZelfdeScherm: (naam) => {
    if (naam === "maand") maandScherm.naarBovenkant();
    if (naam === "vakken") vakkenScherm.naarBovenkant();
  },
});

const maandScherm = initMaandScherm(schermEls.maand, {
  onItemToevoegen: voegItemEnHerteken,
  onVerwijderItem: verwijderItemEnHerteken,
  onDeadlineToggle: zetDeadlineEnHerteken,
  onOpleveringToggle: zetOpleveringEnHerteken,
  onMijlpaalToggle: zetMijlpaalEnHerteken,
  onVeldWijzigen: zetVakVeldEnHerteken,
  onTerugNaarScherm: (naam) => navigatie.naarScherm(naam),
  onNaarVak: naarVak,
  onKalenderWeergaveWijzigen: zetKalenderWeergaveEnHerteken,
  onVerbergen: (sleutel) => verbergEnHerteken(sleutel),
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
  onVerbergen: (sleutel) => verbergEnHerteken(sleutel),
  onItemVerwijderen: verwijderItemEnHerteken,
  onItemBewerken: startItemBewerken,
  onDagKiezen: dagKiezenVanuitOverzicht,
});

// #eigen-beheer staat in index.html binnen het overzichtscherm en zou dus
// vóór de lijst komen; initOverzichtScherm hangt zijn eigen delen erachter.
// Opnieuw aanhangen zet het blok onderaan, waar het hoort.
schermEls.overzicht.appendChild(document.getElementById("eigen-beheer"));

const vakkenScherm = initVakkenScherm(schermEls.vakken, {
  onVeldWijzigen: zetVakVeldEnHerteken,
  onInschrijvingWijzigen: zetPythonInschrijvingEnHerteken,
  onDeadlineToggle: zetDeadlineEnHerteken,
  onOpleveringToggle: zetOpleveringEnHerteken,
  onVerbergen: (sleutel) => verbergEnHerteken(sleutel),
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
