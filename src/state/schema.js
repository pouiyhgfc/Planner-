/**
 * State-vorm en migratie. Eén state-object, één schemaVersion, een
 * migratiefunctie die nooit stilzwijgend data weggooit.
 *
 * v0: items met een los veld "datum" (geen bereik), geen status.
 * v1: items met start/end-bereik, status, notitie (fase 4).
 * v2: state kreeg laatsteExport; items kregen bijgewerkt (interne metadata,
 *     geen invoerveld) voor de merge-conflictresolutie in fase 5.
 * v3: state kreeg ui (fase 8B, navigatie): actief scherm, scrollpositie per
 *     scherm, en de handmatige thema-keuze — zodat een herlaad de gebruiker
 *     nooit terugzet naar de bovenkant van een lijst of een ander scherm.
 * v4: state kreeg afgevinkteDeadlines (fase 8C, dagblad): welke deadlines
 *     zijn afgevinkt, per sleutel "date-of-start::label" — deadlines zelf
 *     hebben geen eigen id in src/data/deadlines.js of coursedates.js.
 * v5: state kreeg weekWeergave (fase 8D, scherm "Weken"): de gekozen
 *     periodelengte en het huidige vensterbegin (een maandag), zodat de
 *     periodekeuze bewaard blijft — zie FASE-8.md 8D.
 * v6: state kreeg afgevinkteMijlpalen (fase 8E, scherm "Overzicht"): welke
 *     projectmijlpalen zijn afgevinkt, per sleutel "projectId::datum::label"
 *     — mijlpalen in src/data/projects.js hebben zelf geen id. Ook
 *     eigenProjecten: door de gebruiker zelf toegevoegde projecten, met
 *     dezelfde vorm (naam, vak, mijlpalen) als src/data/projects.js.
 * v7: state kreeg pythonInschrijving (fase 8F, scherm "Vakken"): de
 *     bevestigd/afgewezen-status die de knop in de kop van Python zet — bij
 *     "afgewezen" telt het vak niet meer mee (src/lib/dayStatus.js en
 *     blocks.js kregen hiervoor een optionele pythonAfgewezen-parameter,
 *     default false, dus geen gedragswijziging voor bestaande aanroepen).
 *     Ook vakkenVeldwaarden: generieke gebruikersinvoer voor onbekende
 *     velden (zaal, docent, groepsgrootte, ...) en tellers (bijv. Python
 *     ingeleverde/totaal opdrachten), sleutel "VAKID.veldnaam".
 * v8: state kreeg tripStatusOverrides (FASE-9.md A2): welke reisvariant uit
 *     src/data/trips.js momenteel "geboekt" / "wijziging-aangevraagd" /
 *     "vervallen" is, sleutel = de variant-id uit trips.js. Ontbreekt een
 *     variant hierin, dan geldt zijn standaardstatus uit trips.js — src/lib/
 *     dayStatus.js en blocks.js kregen hiervoor een optionele
 *     tripStatusOverrides-parameter, default {}, dus geen gedragswijziging
 *     voor bestaande aanroepen.
 * v9: state kreeg eigenReizen (FASE-9.md B1 punt 5): door de gebruiker zelf
 *     toegevoegde reizen (naam, start/end, status, optioneel losse
 *     vluchten), dezelfde vorm als trips.js na eigenReisItems() in
 *     src/data/trips.js. dayStatus.js en blocks.js kregen hiervoor een
 *     optionele eigenReizen-parameter, default [], dus geen
 *     gedragswijziging voor bestaande aanroepen.
 * v10: state kreeg afgevinkteOpleveringen (FASE-9.md B3): welke items uit
 *     src/data/opleveringen.js zijn afgevinkt, per sleutel = het eigen id
 *     van het item (opleveringen hebben, anders dan deadlines/mijlpalen,
 *     altijd een eigen stabiele id — geen samengestelde sleutel nodig).
 */

import { parseYMD } from "../lib/date.js";
import { trips, TRIP_STATUSSEN } from "../data/trips.js";

export const CURRENT_SCHEMA_VERSION = 10;

const STATUS_WAARDEN = ["idee", "vast"];
export const SCHERMEN = ["maand", "weken", "overzicht", "vakken"];
const THEMA_WAARDEN = ["systeem", "licht", "donker"];
export const PERIODES = ["1w", "2w", "4w", "1m", "3m", "alle", "eigen"];
export const PYTHON_INSCHRIJVING_WAARDEN = ["onbevestigd", "bevestigd", "afgewezen"];

/**
 * @returns {{activeScreen: string, scrollPositions: Record<string, number>, thema: string}}
 */
function legeUiState() {
  return {
    activeScreen: "maand",
    scrollPositions: Object.fromEntries(SCHERMEN.map((s) => [s, 0])),
    thema: "systeem",
  };
}

/**
 * @returns {{periode: string, startWeek: string|null, eigenStart: string|null, eigenEind: string|null}}
 */
function legeWeekWeergave() {
  return { periode: "1w", startWeek: null, eigenStart: null, eigenEind: null };
}

/**
 * @returns {{schemaVersion: number, items: object[], laatsteExport: string|null, ui: object, afgevinkteDeadlines: string[], weekWeergave: object}}
 */
export function leegState() {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    items: [],
    laatsteExport: null,
    ui: legeUiState(),
    afgevinkteDeadlines: [],
    weekWeergave: legeWeekWeergave(),
    afgevinkteMijlpalen: [],
    eigenProjecten: [],
    pythonInschrijving: "onbevestigd",
    vakkenVeldwaarden: {},
    tripStatusOverrides: {},
    eigenReizen: [],
    afgevinkteOpleveringen: [],
  };
}

/**
 * Migreert een opgeslagen state naar CURRENT_SCHEMA_VERSION. Gooit nooit
 * stilzwijgend velden weg — onbekende schemaVersion is een harde fout.
 * @param {{schemaVersion: number}} state
 * @returns {{schemaVersion: number, items: object[], laatsteExport: string|null}}
 */
export function migrate(state) {
  let s = state;

  if (s.schemaVersion === 0) {
    s = {
      schemaVersion: 1,
      items: (s.items ?? []).map((item) => ({
        id: item.id,
        naam: item.naam,
        start: item.datum,
        end: item.datum,
        status: item.status ?? "idee",
        notitie: item.notitie ?? "",
      })),
    };
  }

  if (s.schemaVersion === 1) {
    s = {
      schemaVersion: 2,
      laatsteExport: s.laatsteExport ?? null,
      items: (s.items ?? []).map((item) => ({ ...item, bijgewerkt: item.bijgewerkt ?? null })),
    };
  }

  if (s.schemaVersion === 2) {
    s = {
      schemaVersion: 3,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
    };
  }

  if (s.schemaVersion === 3) {
    s = {
      schemaVersion: 4,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
    };
  }

  if (s.schemaVersion === 4) {
    s = {
      schemaVersion: 5,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
    };
  }

  if (s.schemaVersion === 5) {
    s = {
      schemaVersion: 6,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
    };
  }

  if (s.schemaVersion === 6) {
    s = {
      schemaVersion: 7,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
      pythonInschrijving: PYTHON_INSCHRIJVING_WAARDEN.includes(s.pythonInschrijving) ? s.pythonInschrijving : "onbevestigd",
      vakkenVeldwaarden: s.vakkenVeldwaarden ?? {},
    };
  }

  if (s.schemaVersion === 7) {
    s = {
      schemaVersion: 8,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
      pythonInschrijving: PYTHON_INSCHRIJVING_WAARDEN.includes(s.pythonInschrijving) ? s.pythonInschrijving : "onbevestigd",
      vakkenVeldwaarden: s.vakkenVeldwaarden ?? {},
      tripStatusOverrides: geldigeTripStatusOverrides(s.tripStatusOverrides),
    };
  }

  if (s.schemaVersion === 8) {
    s = {
      schemaVersion: 9,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
      pythonInschrijving: PYTHON_INSCHRIJVING_WAARDEN.includes(s.pythonInschrijving) ? s.pythonInschrijving : "onbevestigd",
      vakkenVeldwaarden: s.vakkenVeldwaarden ?? {},
      tripStatusOverrides: geldigeTripStatusOverrides(s.tripStatusOverrides),
      eigenReizen: s.eigenReizen ?? [],
    };
  }

  if (s.schemaVersion === 9) {
    s = {
      schemaVersion: 10,
      laatsteExport: s.laatsteExport ?? null,
      items: s.items ?? [],
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
      pythonInschrijving: PYTHON_INSCHRIJVING_WAARDEN.includes(s.pythonInschrijving) ? s.pythonInschrijving : "onbevestigd",
      vakkenVeldwaarden: s.vakkenVeldwaarden ?? {},
      tripStatusOverrides: geldigeTripStatusOverrides(s.tripStatusOverrides),
      eigenReizen: s.eigenReizen ?? [],
      afgevinkteOpleveringen: s.afgevinkteOpleveringen ?? [],
    };
  }

  if (s.schemaVersion === CURRENT_SCHEMA_VERSION) {
    return {
      ...s,
      ui: geldigeUiState(s.ui),
      afgevinkteDeadlines: s.afgevinkteDeadlines ?? [],
      weekWeergave: geldigeWeekWeergave(s.weekWeergave),
      afgevinkteMijlpalen: s.afgevinkteMijlpalen ?? [],
      eigenProjecten: s.eigenProjecten ?? [],
      pythonInschrijving: PYTHON_INSCHRIJVING_WAARDEN.includes(s.pythonInschrijving) ? s.pythonInschrijving : "onbevestigd",
      vakkenVeldwaarden: s.vakkenVeldwaarden ?? {},
      tripStatusOverrides: geldigeTripStatusOverrides(s.tripStatusOverrides),
      eigenReizen: s.eigenReizen ?? [],
      afgevinkteOpleveringen: s.afgevinkteOpleveringen ?? [],
    };
  }
  throw new Error(`onbekende schemaVersion: ${state.schemaVersion}`);
}

/**
 * @param {object|undefined} weekWeergave
 * @returns {{periode: string, startWeek: string|null, eigenStart: string|null, eigenEind: string|null}}
 */
function geldigeWeekWeergave(weekWeergave) {
  const leeg = legeWeekWeergave();
  if (!weekWeergave) return leeg;
  return {
    periode: PERIODES.includes(weekWeergave.periode) ? weekWeergave.periode : leeg.periode,
    startWeek: weekWeergave.startWeek ?? leeg.startWeek,
    eigenStart: weekWeergave.eigenStart ?? leeg.eigenStart,
    eigenEind: weekWeergave.eigenEind ?? leeg.eigenEind,
  };
}

/**
 * Vult ontbrekende ui-velden aan zonder een geldig aanwezig veld te
 * overschrijven — nodig omdat een import van een oudere export dit veld
 * kan missen (zie schema v3-migratie hierboven).
 * @param {object|undefined} ui
 * @returns {{activeScreen: string, scrollPositions: Record<string, number>, thema: string}}
 */
function geldigeUiState(ui) {
  const leeg = legeUiState();
  if (!ui) return leeg;
  return {
    activeScreen: SCHERMEN.includes(ui.activeScreen) ? ui.activeScreen : leeg.activeScreen,
    scrollPositions: { ...leeg.scrollPositions, ...ui.scrollPositions },
    thema: THEMA_WAARDEN.includes(ui.thema) ? ui.thema : leeg.thema,
  };
}

/**
 * Filtert een geïmporteerde/opgeslagen tripStatusOverrides-map op geldige
 * reisvarianten (moet bestaan in trips.js) en geldige statuswaarden — een
 * onbekende of foutieve entry wordt genegeerd, niet blind overgenomen.
 * @param {object|undefined} overrides
 * @returns {Record<string, string>}
 */
function geldigeTripStatusOverrides(overrides) {
  if (!overrides || typeof overrides !== "object") return {};
  const geldigeVarianten = new Set(trips.map((t) => t.variant));
  const resultaat = {};
  for (const [variant, status] of Object.entries(overrides)) {
    if (geldigeVarianten.has(variant) && TRIP_STATUSSEN.includes(status)) resultaat[variant] = status;
  }
  return resultaat;
}

/**
 * @param {object} item
 * @throws {Error} als het item ongeldig is
 */
export function valideerItem(item) {
  if (!item.id) throw new Error("item mist id");
  if (!item.naam) throw new Error("item mist naam");
  parseYMD(item.start);
  parseYMD(item.end);
  if (item.start > item.end) throw new Error(`start (${item.start}) ligt na end (${item.end})`);
  if (!STATUS_WAARDEN.includes(item.status)) throw new Error(`ongeldige status: ${item.status}`);
}

/**
 * @param {object} project
 * @throws {Error} als het project ongeldig is
 */
export function valideerProject(project) {
  if (!project.id) throw new Error("project mist id");
  if (!project.naam) throw new Error("project mist naam");
  if (!project.mijlpalen || project.mijlpalen.length === 0) throw new Error("project heeft geen mijlpalen");
  for (const mijlpaal of project.mijlpalen) {
    parseYMD(mijlpaal.datum);
    if (!mijlpaal.label) throw new Error("mijlpaal mist label");
  }
}

/**
 * @param {object} reis
 * @throws {Error} als de eigen reis ongeldig is
 */
export function valideerReis(reis) {
  if (!reis.id) throw new Error("reis mist id");
  if (!reis.naam) throw new Error("reis mist naam");
  parseYMD(reis.start);
  parseYMD(reis.end);
  if (reis.start > reis.end) throw new Error(`start (${reis.start}) ligt na end (${reis.end})`);
  if (!TRIP_STATUSSEN.includes(reis.status)) throw new Error(`ongeldige status: ${reis.status}`);
  for (const vlucht of reis.vluchten ?? []) {
    parseYMD(vlucht.datum);
  }
}
