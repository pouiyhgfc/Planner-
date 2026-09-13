/**
 * DOM-rendering van de dagenlijst. Alleen dit bestand raakt de DOM aan;
 * alle statuslogica komt kant-en-klaar uit lib/dayStatus.js.
 */

import { parseYMD } from "../lib/date.js";
import { genereerKalenderDagen } from "../lib/dayStatus.js";
import { cnyDrukte } from "../lib/overzicht.js";
import { seizoensdataLabel } from "../data/season.js";

const CNY = cnyDrukte();

const MAAND_NAMEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];
const WEEKDAG_NAMEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const STATUS_LABEL = {
  "vaste-boeking": "vaste boeking",
  tentamen: "tentamen",
  feestdag: "feestdag",
  "geen-les": "geen les",
  les: "les",
  vakantie: "vakantie",
  vrij: "vrij",
};
const DAGDEEL_NAMEN = ["ochtend", "middag", "avond"];

/**
 * @param {HTMLElement} root
 * @param {object[]} items eigen geplande items (schema.js-vorm)
 * @param {(id: string) => void} onVerwijderItem
 */
export function renderCalendar(root, items, onVerwijderItem) {
  const dagen = genereerKalenderDagen();
  root.textContent = "";
  root.appendChild(renderKop(dagen.length));

  let vorigeMaand = null;
  const lijst = document.createElement("div");
  lijst.className = "dagenlijst";

  for (const dag of dagen) {
    const { y, m } = parseYMD(dag.date);
    if (m !== vorigeMaand) {
      lijst.appendChild(renderMaandkop(y, m));
      vorigeMaand = m;
    }
    const itemsOpDag = items.filter((item) => dag.date >= item.start && dag.date <= item.end);
    lijst.appendChild(renderDagRij(dag, itemsOpDag, onVerwijderItem));
  }

  root.appendChild(lijst);
}

/**
 * @param {number} aantalDagen
 */
function renderKop(aantalDagen) {
  const kop = document.createElement("header");
  kop.className = "app-kop";
  kop.textContent = `Schoolkalender — ${aantalDagen} dagen`;
  return kop;
}

/**
 * @param {number} y
 * @param {number} m
 */
function renderMaandkop(y, m) {
  const kop = document.createElement("h2");
  kop.className = "maandkop";
  kop.textContent = `${MAAND_NAMEN[m - 1]} ${y} — ${seizoensdataLabel(m)}`;
  return kop;
}

/**
 * @param {ReturnType<typeof import("../lib/dayStatus.js").dayStatus>} dag
 * @param {object[]} itemsOpDag
 * @param {(id: string) => void} onVerwijderItem
 */
function renderDagRij(dag, itemsOpDag, onVerwijderItem) {
  const rij = document.createElement("div");
  rij.className = `dag-rij status-${dag.status}`;
  rij.dataset.date = dag.date;
  if (dag.weekday === 0) rij.classList.add("weekgrens");

  const datum = document.createElement("span");
  datum.className = "col-datum";
  datum.textContent = `${dag.date} ${WEEKDAG_NAMEN[dag.weekday]} · wk${dag.isoWeek}`;
  rij.appendChild(datum);

  const status = document.createElement("span");
  status.className = "col-status";
  status.textContent = STATUS_LABEL[dag.status];
  rij.appendChild(status);

  const dagdelen = document.createElement("span");
  dagdelen.className = "col-dagdelen";
  dagdelen.textContent = DAGDEEL_NAMEN.map((naam) => `${naam[0]}:${dag.dagdelen[naam].bezet ? "■" : "·"}`).join(" ");
  dagdelen.title = DAGDEEL_NAMEN.map((naam) => `${naam}: ${dag.dagdelen[naam].bezet ? dag.dagdelen[naam].redenen.join(", ") : "vrij"}`).join(" | ");
  rij.appendChild(dagdelen);

  const details = document.createElement("span");
  details.className = "col-details";
  const stukken = [];
  for (const v of dag.vakken) stukken.push(v.label);
  for (const d of dag.deadlines) stukken.push(`deadline: ${d.label}`);
  for (const b of dag.vasteBoekingen) stukken.push(b.label);
  for (const f of dag.feestdagen) stukken.push(f.label);
  for (const t of dag.mogelijkeTentamens) {
    stukken.push(t.japanStatus ? `${t.label} (${t.japanStatus})` : `${t.label} (${t.zekerheid})`);
  }
  if (dag.date >= CNY.start && dag.date <= CNY.end) stukken.push(CNY.notitie);
  details.textContent = stukken.join(" · ");
  rij.appendChild(details);

  if (itemsOpDag.length > 0) {
    const eigenItems = document.createElement("span");
    eigenItems.className = "col-eigen-items";
    for (const item of itemsOpDag) {
      const chip = document.createElement("span");
      chip.className = `item-chip item-status-${item.status}`;
      chip.textContent = `${item.naam} (${item.status})`;
      if (item.notitie) chip.title = item.notitie;

      const verwijder = document.createElement("button");
      verwijder.type = "button";
      verwijder.className = "item-verwijder";
      verwijder.textContent = "×";
      verwijder.setAttribute("aria-label", `Verwijder "${item.naam}"`);
      verwijder.addEventListener("click", () => onVerwijderItem(item.id));
      chip.appendChild(verwijder);

      eigenItems.appendChild(chip);
    }
    rij.appendChild(eigenItems);
  }

  return rij;
}
