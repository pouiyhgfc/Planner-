/**
 * DOM-rendering van de dagenlijst. Alleen dit bestand raakt de DOM aan;
 * alle statuslogica komt kant-en-klaar uit lib/dayStatus.js.
 */

import { parseYMD } from "../lib/date.js";
import { genereerKalenderDagen } from "../lib/dayStatus.js";

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
 */
export function renderCalendar(root) {
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
    lijst.appendChild(renderDagRij(dag));
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
  kop.textContent = `${MAAND_NAMEN[m - 1]} ${y}`;
  return kop;
}

/**
 * @param {ReturnType<typeof import("../lib/dayStatus.js").dayStatus>} dag
 */
function renderDagRij(dag) {
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
  details.textContent = stukken.join(" · ");
  rij.appendChild(details);

  return rij;
}
