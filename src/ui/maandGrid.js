/**
 * Scherm "Maand" — fase 8C. Klassieke maandkalender, 7 kolommen (ma-zo).
 * Rekent uitsluitend met lib/date.js-functies (addDays/rangeDays/dayOfWeek/
 * toYMD) en lib/dayStatus.js — geen new Date(), geen hardcoded datums.
 */

import { toYMD, parseYMD, addDays, dayOfWeek, rangeDays } from "../lib/date.js";
import { dayStatus } from "../lib/dayStatus.js";
import { freeBlocks } from "../lib/blocks.js";
import { appPeriod } from "../data/semester.js";
import { courses } from "../data/courses.js";
import { WEEKDAGEN, maandNaam } from "./datumlabels.js";

const AFKORTING = { PSY: "PSY", PY: "PY", AGTECH: "AGT", RTE: "RTE", CHI: "CHI" };

function courseVoor(id) {
  return courses.find((c) => c.id === id);
}

/**
 * @param {number} jaar
 * @param {number} maand 1..12
 * @returns {{y: number, m: number}}
 */
function volgendeMaand(jaar, maand) {
  return maand === 12 ? { y: jaar + 1, m: 1 } : { y: jaar, m: maand + 1 };
}

/**
 * @param {number} jaar
 * @param {number} maand 1..12
 * @returns {{y: number, m: number}}
 */
function vorigeMaand(jaar, maand) {
  return maand === 1 ? { y: jaar - 1, m: 12 } : { y: jaar, m: maand - 1 };
}

/**
 * @param {number} jaar
 * @param {number} maand 1..12
 * @returns {string} laatste dag van de maand, "YYYY-MM-DD"
 */
function laatsteDagVanMaand(jaar, maand) {
  const { y, m } = volgendeMaand(jaar, maand);
  return addDays(toYMD({ y, m, d: 1 }), -1);
}

/**
 * Rijen van 7 dagen die de opgegeven maand volledig dekken, inclusief de
 * dagen uit de vorige/volgende maand die de eerste/laatste week opvullen.
 * @param {number} jaar
 * @param {number} maand 1..12
 * @returns {string[][]}
 */
export function maandWeken(jaar, maand) {
  const eersteDag = toYMD({ y: jaar, m: maand, d: 1 });
  const laatsteDag = laatsteDagVanMaand(jaar, maand);
  const gridStart = addDays(eersteDag, -dayOfWeek(eersteDag));
  const gridEind = addDays(laatsteDag, 6 - dayOfWeek(laatsteDag));
  const alleDagen = rangeDays(gridStart, gridEind);
  const weken = [];
  for (let i = 0; i < alleDagen.length; i += 7) weken.push(alleDagen.slice(i, i + 7));
  return weken;
}

/**
 * @param {{course: string, type: string, label: string}} vakItem
 * @returns {boolean} tentamen of presentatie krijgt een stip i.p.v. een streepje
 */
export function isStipMoment(vakItem) {
  return vakItem.type === "tentamen" || /presentat/i.test(vakItem.label);
}

/**
 * @param {{date: string}[]} vakken op één dag
 * @returns {object[]} gesorteerd op starttijd van het vak, ochtend eerst
 */
function gesorteerdOpTijd(vakken) {
  return [...vakken].sort((a, b) => courseVoor(a.course).start.localeCompare(courseVoor(b.course).start));
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   jaar: number, maand: number, vandaag: string, geselecteerd: string|null,
 *   items: object[], pythonAfgewezen: boolean,
 * }} opts
 * @param {(ymd: string) => void} onDagKlik
 * @param {(jaar: number, maand: number) => void} onNavigeren
 */
export function renderMaandScherm(root, opts, onDagKlik, onNavigeren) {
  const { jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen } = opts;
  root.textContent = "";

  root.appendChild(renderHeader(jaar, maand, vandaag, onNavigeren));
  root.appendChild(renderGrid(jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, onDagKlik));
  root.appendChild(renderLegenda());
}

function renderHeader(jaar, maand, vandaag, onNavigeren) {
  const wrap = document.createElement("div");
  wrap.className = "maand-header";

  const rij = document.createElement("div");
  rij.className = "maand-header-rij";

  const vorige = document.createElement("button");
  vorige.type = "button";
  vorige.className = "tap-target maand-pijl";
  vorige.textContent = "‹";
  vorige.setAttribute("aria-label", "Vorige maand");
  const { y: vy, m: vm } = vorigeMaand(jaar, maand);
  vorige.disabled = laatsteDagVanMaand(vy, vm) < appPeriod.start;
  vorige.addEventListener("click", () => onNavigeren(vy, vm));

  const kop = document.createElement("h2");
  kop.className = "maand-naam";
  kop.textContent = `${maandNaam(maand)} ${jaar}`;

  const volgende = document.createElement("button");
  volgende.type = "button";
  volgende.className = "tap-target maand-pijl";
  volgende.textContent = "›";
  volgende.setAttribute("aria-label", "Volgende maand");
  const { y: ny, m: nm } = volgendeMaand(jaar, maand);
  volgende.disabled = toYMD({ y: ny, m: nm, d: 1 }) > appPeriod.end;
  volgende.addEventListener("click", () => onNavigeren(ny, nm));

  const vandaagKnop = document.createElement("button");
  vandaagKnop.type = "button";
  vandaagKnop.className = "tap-target maand-vandaag-knop";
  vandaagKnop.textContent = "Vandaag";
  vandaagKnop.addEventListener("click", () => {
    const { y, m } = parseYMD(vandaag);
    onNavigeren(y, m);
  });

  rij.appendChild(vorige);
  rij.appendChild(kop);
  rij.appendChild(volgende);
  rij.appendChild(vandaagKnop);
  wrap.appendChild(rij);

  return wrap;
}

function renderGrid(jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, onDagKlik) {
  const weken = maandWeken(jaar, maand);
  const frag = document.createDocumentFragment();

  const dagkoppen = document.createElement("div");
  dagkoppen.className = "maand-dagkoppen";
  for (const naam of WEEKDAGEN) {
    const kop = document.createElement("span");
    kop.textContent = naam;
    dagkoppen.appendChild(kop);
  }
  frag.appendChild(dagkoppen);

  const grid = document.createElement("div");
  grid.className = "maand-grid";

  let lesmomenten = 0;
  let tentamens = 0;

  for (const week of weken) {
    for (const ymd of week) {
      const { m } = parseYMD(ymd);
      const buitenPeriode = ymd < appPeriod.start || ymd > appPeriod.end;
      const buitenMaand = m !== maand;
      grid.appendChild(
        renderDagvak(ymd, buitenPeriode, buitenMaand, vandaag, geselecteerd, items, pythonAfgewezen, onDagKlik, (dag) => {
          if (buitenMaand || buitenPeriode) return;
          lesmomenten += dag.vakken.filter((v) => v.type === "les").length;
          tentamens += dag.vakken.filter((v) => v.type === "tentamen").length;
        })
      );
    }
  }
  frag.appendChild(grid);

  const eersteDag = toYMD({ y: jaar, m: maand, d: 1 });
  const laatsteDag = laatsteDagVanMaand(jaar, maand);
  const vrijeBlokken = freeBlocks(pythonAfgewezen).filter((b) => b.start >= eersteDag && b.start <= laatsteDag).length;

  const telling = document.createElement("p");
  telling.className = "maand-telling";
  telling.textContent = `${lesmomenten} lesmomenten · ${tentamens} tentamens · ${vrijeBlokken} vrije blokken beginnen deze maand`;
  frag.appendChild(telling);

  return frag;
}

function renderDagvak(ymd, buitenPeriode, buitenMaand, vandaag, geselecteerd, items, pythonAfgewezen, onDagKlik, telMee) {
  const { d } = parseYMD(ymd);
  const knop = document.createElement("button");
  knop.type = "button";
  knop.className = "dagvak";
  knop.dataset.datum = ymd;

  const cijfer = document.createElement("span");
  cijfer.className = "dagvak-cijfer";
  cijfer.textContent = String(d);
  knop.appendChild(cijfer);

  if (buitenMaand) knop.classList.add("buiten-maand");

  if (buitenPeriode) {
    knop.disabled = true;
    knop.classList.add("buiten-periode");
    return knop;
  }

  const dag = dayStatus(ymd, pythonAfgewezen);
  telMee(dag);

  if (dag.status === "feestdag" || dag.status === "geen-les") knop.classList.add("status-gemarkeerd");
  if (ymd === vandaag) knop.dataset.vandaag = "true";
  if (ymd === geselecteerd) knop.classList.add("geselecteerd");

  const streepjes = document.createElement("span");
  streepjes.className = "dagvak-streepjes";
  for (const vak of gesorteerdOpTijd(dag.vakken)) {
    const el = document.createElement("span");
    el.className = isStipMoment(vak) ? "stip" : "streepje";
    el.style.backgroundColor = `var(--vak-${vak.course.toLowerCase()}-text)`;
    streepjes.appendChild(el);
  }
  knop.appendChild(streepjes);

  const heeftEigenItem = items.some((item) => item.start <= ymd && ymd <= item.end);
  if (heeftEigenItem) {
    const balk = document.createElement("span");
    balk.className = "dagvak-eigen-balk";
    knop.appendChild(balk);
  }

  knop.addEventListener("click", () => onDagKlik(ymd));
  return knop;
}

function renderLegenda() {
  const lijst = document.createElement("ul");
  lijst.className = "maand-legenda";
  for (const c of courses) {
    const li = document.createElement("li");

    const swatch = document.createElement("span");
    swatch.className = "legenda-swatch";
    swatch.style.backgroundColor = `var(--vak-${c.id.toLowerCase()}-text)`;
    li.appendChild(swatch);

    const tekst = document.createElement("span");
    const dagen = c.weekdays.map((w) => WEEKDAGEN[w]).join(" + ");
    tekst.textContent = `${AFKORTING[c.id]} — ${c.name} — ${dagen} ${c.start}–${c.end}`;
    li.appendChild(tekst);

    lijst.appendChild(li);
  }
  return lijst;
}
