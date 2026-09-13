/**
 * State-vorm en migratie. Eén state-object, één schemaVersion, een
 * migratiefunctie die nooit stilzwijgend data weggooit.
 *
 * v0: items met een los veld "datum" (geen bereik), geen status.
 * v1: items met start/end-bereik, status, notitie (fase 4).
 * v2: state kreeg laatsteExport; items kregen bijgewerkt (interne metadata,
 *     geen invoerveld) voor de merge-conflictresolutie in fase 5.
 */

import { parseYMD } from "../lib/date.js";

export const CURRENT_SCHEMA_VERSION = 2;

const STATUS_WAARDEN = ["idee", "vast"];

/**
 * @returns {{schemaVersion: number, items: object[], laatsteExport: string|null}}
 */
export function leegState() {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, items: [], laatsteExport: null };
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

  if (s.schemaVersion === CURRENT_SCHEMA_VERSION) return s;
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
