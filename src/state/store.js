/**
 * State + IndexedDB. Eén record ("state") in één object store. Geen
 * localStorage — zie CLAUDE.md §4.
 */

import { leegState, migrate, valideerItem } from "./schema.js";

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
 * @param {{schemaVersion: number, items: object[]}} state
 * @param {{naam: string, start: string, end: string, status: string, notitie: string}} veld
 * @returns {{schemaVersion: number, items: object[]}}
 */
export function voegItemToe(state, veld) {
  const item = { id: crypto.randomUUID(), ...veld };
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
