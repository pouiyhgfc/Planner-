/**
 * State + IndexedDB. Eén record ("state") in één object store. Geen
 * localStorage — zie CLAUDE.md §4.
 */

import { leegState, migrate, valideerItem, valideerProject, CURRENT_SCHEMA_VERSION } from "./schema.js";

const DB_NAAM = "planner";
const DB_VERSIE = 1;
const STORE_NAAM = "state";
const STATE_KEY = "state";

/**
 * @returns {Promise<IDBDatabase>}
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAAM, DB_VERSIE);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAAM);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * @returns {Promise<{schemaVersion: number, items: object[]}>}
 */
export async function laadState() {
  const db = await openDatabase();
  const opgeslagen = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAAM, "readonly");
    const req = tx.objectStore(STORE_NAAM).get(STATE_KEY);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return opgeslagen ? migrate(opgeslagen) : leegState();
}

/**
 * @param {{schemaVersion: number, items: object[]}} state
 * @returns {Promise<void>}
 */
export async function bewaarState(state) {
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAAM, "readwrite");
    tx.objectStore(STORE_NAAM).put(state, STATE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/**
 * Huidige datum als "YYYY-MM-DD" in de tijdzone van de gebruiker
 * (Asia/Taipei, zie DATA.md §0). Enige plek in de app die de systeemklok
 * leest — het resultaat gaat direct door lib/date.js voor alle verdere
 * berekeningen, nooit terug via het Date-object.
 * @returns {string}
 */
export function huidigeYMD() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
}

/**
 * @param {{schemaVersion: number, items: object[]}} state
 * @param {{naam: string, start: string, end: string, status: string, notitie: string}} veld
 * @returns {{schemaVersion: number, items: object[]}}
 */
export function voegItemToe(state, veld) {
  const item = { id: crypto.randomUUID(), bijgewerkt: huidigeYMD(), ...veld };
  valideerItem(item);
  return { ...state, items: [...state.items, item] };
}

/**
 * @param {{schemaVersion: number, items: object[]}} state
 * @param {string} id
 * @returns {{schemaVersion: number, items: object[]}}
 */
export function verwijderItem(state, id) {
  return { ...state, items: state.items.filter((item) => item.id !== id) };
}

/**
 * @param {{afgevinkteDeadlines: string[]}} state
 * @param {string} sleutel
 * @param {boolean} afgevinkt
 * @returns {{afgevinkteDeadlines: string[]}}
 */
export function zetDeadlineAfgevinkt(state, sleutel, afgevinkt) {
  const zonder = state.afgevinkteDeadlines.filter((s) => s !== sleutel);
  return { ...state, afgevinkteDeadlines: afgevinkt ? [...zonder, sleutel] : zonder };
}

/**
 * @param {{afgevinkteMijlpalen: string[]}} state
 * @param {string} sleutel
 * @param {boolean} afgevinkt
 * @returns {{afgevinkteMijlpalen: string[]}}
 */
export function zetMijlpaalAfgevinkt(state, sleutel, afgevinkt) {
  const zonder = state.afgevinkteMijlpalen.filter((s) => s !== sleutel);
  return { ...state, afgevinkteMijlpalen: afgevinkt ? [...zonder, sleutel] : zonder };
}

/**
 * @param {{eigenProjecten: object[]}} state
 * @param {{naam: string, vak: string, mijlpalen: {datum: string, label: string}[]}} veld
 * @returns {{eigenProjecten: object[]}}
 */
export function voegProjectToe(state, veld) {
  const project = { id: crypto.randomUUID(), ...veld };
  valideerProject(project);
  return { ...state, eigenProjecten: [...state.eigenProjecten, project] };
}

/**
 * @param {{eigenProjecten: object[]}} state
 * @param {string} id
 * @returns {{eigenProjecten: object[]}}
 */
export function verwijderProject(state, id) {
  return { ...state, eigenProjecten: state.eigenProjecten.filter((p) => p.id !== id) };
}

/**
 * @param {{pythonInschrijving: string}} state
 * @param {"onbevestigd"|"bevestigd"|"afgewezen"} waarde
 * @returns {{pythonInschrijving: string}}
 */
export function zetPythonInschrijving(state, waarde) {
  return { ...state, pythonInschrijving: waarde };
}

/**
 * @param {{vakkenVeldwaarden: Record<string, string>}} state
 * @param {string} sleutel bijv. "AGTECH.room" of "PY.opdrachtenIngeleverd"
 * @param {string} waarde
 * @returns {{vakkenVeldwaarden: Record<string, string>}}
 */
export function zetVakVeld(state, sleutel, waarde) {
  return { ...state, vakkenVeldwaarden: { ...state.vakkenVeldwaarden, [sleutel]: waarde } };
}

/**
 * Vraagt persistente opslag aan. Logt de uitkomst; de app werkt ongeacht
 * het antwoord (CLAUDE.md §4/§8).
 * @returns {Promise<boolean|null>} null als de API niet bestaat
 */
export async function vraagPersistentOpslagAan() {
  if (!navigator.storage?.persist) {
    console.log("navigator.storage.persist() niet beschikbaar in deze browser");
    return null;
  }
  const toegekend = await navigator.storage.persist();
  console.log(`navigator.storage.persist() → ${toegekend}`);
  return toegekend;
}

/**
 * @param {{schemaVersion: number, items: object[]}} state
 * @returns {{state: {schemaVersion: number, items: object[], laatsteExport: string}, bestandsnaam: string, inhoud: string}}
 */
export function bereidExportVoor(state) {
  const datum = huidigeYMD();
  const nieuweState = { ...state, laatsteExport: datum };
  return {
    state: nieuweState,
    bestandsnaam: `planner-export-${datum}.json`,
    inhoud: JSON.stringify(nieuweState, null, 2),
  };
}

/**
 * Voegt een geïmporteerde state samen met de huidige — overschrijft nooit
 * blind. Items met een onbekend id worden toegevoegd; identieke items
 * worden genegeerd; verschillende items met hetzelfde id komen als
 * conflict terug voor een keuze door de gebruiker.
 * @param {{schemaVersion: number, items: object[]}} huidig
 * @param {object} geimporteerdRuw
 * @returns {{items: object[], conflicten: {huidig: object, geimporteerd: object}[]}}
 */
export function bereidSamenvoegingVoor(huidig, geimporteerdRuw) {
  if (geimporteerdRuw.schemaVersion === undefined) throw new Error("geïmporteerd bestand mist schemaVersion");
  const geimporteerd = migrate(geimporteerdRuw);

  const huidigeById = new Map(huidig.items.map((item) => [item.id, item]));
  const items = [...huidig.items];
  const conflicten = [];

  for (const item of geimporteerd.items) {
    valideerItem(item);
    const bestaand = huidigeById.get(item.id);
    if (!bestaand) {
      items.push(item);
    } else if (JSON.stringify(bestaand) !== JSON.stringify(item)) {
      conflicten.push({ huidig: bestaand, geimporteerd: item });
    }
  }

  return { items, conflicten };
}

/**
 * Past de keuzes uit een conflictenlijst toe op de samengevoegde items.
 * @param {object[]} items
 * @param {{huidig: object, geimporteerd: object}[]} conflicten
 * @param {Record<string, "huidig"|"geimporteerd">} keuzes sleutel = conflict-item id
 * @returns {object[]}
 */
export function pasConflictKeuzesToe(items, conflicten, keuzes) {
  let resultaat = [...items];
  for (const conflict of conflicten) {
    const keuze = keuzes[conflict.huidig.id] ?? "huidig";
    const gekozen = keuze === "geimporteerd" ? conflict.geimporteerd : conflict.huidig;
    resultaat = resultaat.map((item) => (item.id === gekozen.id ? gekozen : item));
  }
  return resultaat;
}
