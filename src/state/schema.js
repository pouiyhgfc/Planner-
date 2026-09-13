/**
 * State-vorm en migratie. Eén state-object, één schemaVersion, een
 * migratiefunctie die nooit stilzwijgend data weggooit.
 */

import { parseYMD } from "../lib/date.js";

export const CURRENT_SCHEMA_VERSION = 1;

const STATUS_WAARDEN = ["idee", "vast"];

/**
 * @returns {{schemaVersion: number, items: object[]}}
 */
export function leegState() {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, items: [] };
}

/**
 * Migreert een opgeslagen state naar CURRENT_SCHEMA_VERSION. Gooit nooit
 * stilzwijgend velden weg — onbekende schemaVersion is een harde fout.
 * @param {{schemaVersion: number, items: object[]}} state
 * @returns {{schemaVersion: number, items: object[]}}
 */
export function migrate(state) {
  if (state.schemaVersion === CURRENT_SCHEMA_VERSION) return state;

  if (state.schemaVersion === 0) {
    // v0 kende alleen een los veld "datum" (geen bereik) en geen status.
    return {
      schemaVersion: 1,
      items: (state.items ?? []).map((item) => ({
        id: item.id,
        naam: item.naam,
        start: item.datum,
        end: item.datum,
        status: item.status ?? "idee",
        notitie: item.notitie ?? "",
      })),
    };
  }

  throw new Error(`onbekende schemaVersion: ${state.schemaVersion}`);
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
