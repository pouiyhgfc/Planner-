/**
 * Scherm "Weken" — fase 8D. Per week een strip van 3 rijen (ochtend/middag/
 * avond) x 7 kolommen in vakkleuren, met een periodekiezer erboven. Rekent
 * uitsluitend met lib/date.js-functies — geen new Date(), geen hardcoded
 * datums.
 */

import { addDays, dayOfWeek, diffDays, parseYMD } from "../lib/date.js";
import { appPeriod } from "../data/semester.js";
import { courseVoor } from "../data/courses.js";
import { dayStatus, dagdeelVoorTijd, DAGDEEL_NAMEN } from "../lib/dayStatus.js";
import { WEEKDAGEN, collegeWeek, kortDatum } from "./datumlabels.js";

export const PERIODE_LABELS = {
  "1w": "1 week",
  "2w": "2 weken",
  "4w": "4 weken",
  "1m": "1 maand",
  "3m": "3 maanden",
  alle: "Alles",
  eigen: "Eigen",
};

// "1 maand"/"3 maanden" zijn hier vaste weekaantallen (geen exacte
// kalendermaand-grens) — het gaat om hoeveel weekstrips onder elkaar staan,
// niet om een kalenderfeit, dus een ronde benadering (5 resp. 13 weken)
// volstaat.
const WEKEN_PER_PERIODE = { "1w": 1, "2w": 2, "4w": 4, "1m": 5, "3m": 13 };

/**
 * @param {string} ymd
 * @returns {string} maandag van de week die ymd bevat
 */
export function maandagVan(ymd) {
  return addDays(ymd, -dayOfWeek(ymd));
}

/**
 * @param {string} periode
 * @param {string|null} eigenStart
 * @param {string|null} eigenEind
 * @returns {number}
 */
export function weekAantal(periode, eigenStart, eigenEind) {
  if (periode === "alle") {
    return Math.floor(diffDays(maandagVan(appPeriod.start), appPeriod.end) / 7) + 1;
  }
  if (periode === "eigen") {
    if (!eigenStart || !eigenEind || eigenStart > eigenEind) return 1;
    return Math.floor(diffDays(maandagVan(eigenStart), eigenEind) / 7) + 1;
  }
  return WEKEN_PER_PERIODE[periode] ?? 1;
}

/**
 * @param {string} startWeek maandag
 * @param {string} periode
 * @param {string|null} eigenStart
 * @param {string|null} eigenEind
 * @returns {string[]} maandagen van de te tonen weken
 */
export function weekStarts(startWeek, periode, eigenStart, eigenEind) {
  const basis = periode === "alle" ? maandagVan(appPeriod.start) : periode === "eigen" ? maandagVan(eigenStart ?? startWeek) : startWeek;
  const n = weekAantal(periode, eigenStart, eigenEind);
  const out = [];
  for (let i = 0; i < n; i++) out.push(addDays(basis, i * 7));
  return out;
}

/**
 * @param {string} startWeek
 * @param {string} periode
 * @param {string|null} eigenStart
 * @param {string|null} eigenEind
 * @param {1|-1} richting
 * @returns {string} nieuwe startWeek
 */
export function verschuifVenster(startWeek, periode, eigenStart, eigenEind, richting) {
  return addDays(startWeek, richting * weekAantal(periode, eigenStart, eigenEind) * 7);
}

/**
 * @param {ReturnType<typeof import("../lib/dayStatus.js").dayStatus>} dag
 * @returns {Record<string, {kleurVar: string, tekst: string}|null>} per dagdeel-naam
 */
export function dagdelenMetKleur(dag) {
  // Geen aparte kleur voor vaste boekingen: "kleur codeert het vak, nooit de
  // status" (FASE-8.md 8A) geldt ook hier. Een reisdag blijft dus gewoon de
  // vakkleur tonen; de vaste boeking zelf staat al in de uitzonderingenlijst.
  const resultaat = {};
  for (const naam of DAGDEEL_NAMEN) resultaat[naam] = null;

  for (const vak of dag.vakken) {
    const course = courseVoor(vak.course);
    const naam = dagdeelVoorTijd(course.start);
    resultaat[naam] = { kleurVar: `--vak-${vak.course.toLowerCase()}-text`, tekst: `${course.name}: ${vak.label}` };
  }
  return resultaat;
}

/**
 * @param {ReturnType<typeof import("../lib/dayStatus.js").dayStatus>[]} weekDagen precies 7 dagen
 * @returns {string|null} het grootste feit van de week, of null (gewone lesweek)
 */
function grootsteFeit(weekDagen) {
  const tentamens = weekDagen.flatMap((d) => d.vakken.filter((v) => v.type === "tentamen"));
  if (tentamens.length > 0) return `Tentamen: ${courseVoor(tentamens[0].course).name}`;

  const reizen = weekDagen.flatMap((d) => d.vasteBoekingen.filter((v) => v.type === "vaste-boeking"));
  if (reizen.length > 0) return reizen[0].label;

  const presentaties = weekDagen.flatMap((d) => d.vakken.filter((v) => v.type === "les" && /presentat/i.test(v.label)));
  if (presentaties.length > 0) return `Presentatie: ${courseVoor(presentaties[0].course).name}`;

  const deadlines = weekDagen.flatMap((d) => d.deadlines);
  if (deadlines.length > 0) return deadlines.length === 1 ? deadlines[0].label : `${deadlines.length} deadlines`;

  const feestdagen = weekDagen.flatMap((d) => d.feestdagen);
  if (feestdagen.length > 0) return feestdagen[0].label;

  if (weekDagen.every((d) => d.status === "vakantie")) return "Vakantie";

  return null;
}

/**
 * @param {ReturnType<typeof import("../lib/dayStatus.js").dayStatus>[]} weekDagen
 * @returns {{label: string}[]} uitzonderingen: feestdagen, tentamens, deadlines, vaste boekingen
 */
function uitzonderingen(weekDagen) {
  const regels = [];
  for (const dag of weekDagen) {
    const kort = kortDatum(dag.date);
    for (const f of dag.feestdagen) regels.push(`${kort}: ${f.label}`);
    for (const v of dag.vakken.filter((v) => v.type === "tentamen")) regels.push(`${kort}: ${courseVoor(v.course).name} — ${v.label}`);
    for (const d of dag.deadlines) regels.push(`${kort}: ${d.label}`);
    for (const b of dag.vasteBoekingen) regels.push(`${kort}: ${b.label}`);
  }
  return regels;
}

/**
 * @param {HTMLElement} root
 * @param {string} weekMaandag
 * @param {boolean} pythonAfgewezen
 * @param {Record<string, string>} tripStatusOverrides
 * @param {object[]} eigenReizen
 * @param {(ymd: string) => void} onOpenWeek
 * @param {(ymd: string) => void} onItemErbij
 * @param {(ymd: string) => void} onDagKlik
 */
function renderWeekkaart(root, weekMaandag, pythonAfgewezen, tripStatusOverrides, eigenReizen, onOpenWeek, onItemErbij, onDagKlik) {
  const dagen = [];
  for (let i = 0; i < 7; i++) dagen.push(dayStatus(addDays(weekMaandag, i), pythonAfgewezen, tripStatusOverrides, eigenReizen));

  const kaart = document.createElement("div");
  kaart.className = "card weekkaart";

  const kop = document.createElement("div");
  kop.className = "weekkaart-kop";
  const weekEind = addDays(weekMaandag, 6);
  const week = collegeWeek(weekMaandag) ?? collegeWeek(weekEind);
  const titel = document.createElement("div");
  titel.className = "weekkaart-titelblok";
  // Eén weeknummer, niet twee: de kaart noemde zowel het ISO-weeknummer als
  // de collegeweek, wat naast elkaar verwarrend leest. De collegeweek is wat
  // telt; valt de week buiten het semester, dan is er alleen het ISO-nummer.
  const titelRegel = document.createElement("span");
  titelRegel.className = "weekkaart-titel";
  titelRegel.textContent = week ? `week ${week.week} van ${week.totaal}` : `week ${dagen[0].isoWeek}`;
  titel.appendChild(titelRegel);

  const periodeRegel = document.createElement("span");
  periodeRegel.className = "weekkaart-collegeweek";
  periodeRegel.textContent = `${kortDatum(weekMaandag)} t/m ${kortDatum(weekEind)}`;
  titel.appendChild(periodeRegel);
  kop.appendChild(titel);

  // De badge vat de week samen, de uitzonderingenlijst eronder geeft dezelfde
  // dingen mét datum. Is er precies één uitzondering, dan zeggen ze letterlijk
  // hetzelfde en staat het twee keer in dezelfde kaart; dan wint de lijst,
  // want die noemt ook de dag.
  const uitz = uitzonderingen(dagen);
  const feit = grootsteFeit(dagen);
  if (feit && uitz.length !== 1) {
    const badge = document.createElement("span");
    badge.className = "weekkaart-badge";
    badge.textContent = feit;
    kop.appendChild(badge);
  }
  kaart.appendChild(kop);

  const grid = document.createElement("div");
  grid.className = "weekkaart-grid";

  const legeHoek = document.createElement("span");
  grid.appendChild(legeHoek);
  // FASE-9.md B2 punt 3: elke dagcel is zelf tikbaar en opent het dagblad van
  // die dag — de kortste route, zonder eerst "Item erbij" te hoeven kiezen.
  for (const [i, naam] of WEEKDAGEN.entries()) {
    const ymd = dagen[i].date;
    const { d } = parseYMD(ymd);
    const knop = document.createElement("button");
    knop.type = "button";
    knop.className = "tap-target weekkaart-dagkop";
    knop.textContent = `${naam} ${d}`;
    knop.addEventListener("click", () => onDagKlik(ymd));
    grid.appendChild(knop);
  }

  for (const dagdeelNaam of DAGDEEL_NAMEN) {
    const label = document.createElement("span");
    label.className = "weekkaart-dagdeelkop";
    label.textContent = dagdeelNaam[0];
    grid.appendChild(label);
    for (const dag of dagen) {
      const cel = document.createElement("span");
      cel.className = "weekkaart-cel";
      const info = dagdelenMetKleur(dag)[dagdeelNaam];
      if (info) cel.style.backgroundColor = `var(${info.kleurVar})`;
      grid.appendChild(cel);
    }
  }

  // Reisband (fase 9 B1 punt 3): een extra rij onder de 3×7-strip, alleen als
  // deze week een reis raakt.
  if (dagen.some((d) => d.vasteBoekingen.some((v) => v.type === "vaste-boeking"))) {
    const reisLabel = document.createElement("span");
    reisLabel.className = "weekkaart-dagdeelkop";
    grid.appendChild(reisLabel);
    for (const dag of dagen) {
      const cel = document.createElement("span");
      cel.className = "weekkaart-reis-cel";
      const reis = dag.vasteBoekingen.find((v) => v.type === "vaste-boeking");
      if (reis) {
        cel.classList.add("bezet");
        if (reis.start === dag.date) cel.classList.add("reis-eerste");
        if (reis.end === dag.date) cel.classList.add("reis-laatste");
        if (reis.status === "wijziging-aangevraagd") cel.classList.add("reis-aangevraagd");
      }
      grid.appendChild(cel);
    }
  }
  kaart.appendChild(grid);

  if (uitz.length > 0) {
    const lijst = document.createElement("ul");
    lijst.className = "weekkaart-uitzonderingen";
    for (const regel of uitz) {
      const li = document.createElement("li");
      li.textContent = regel;
      lijst.appendChild(li);
    }
    kaart.appendChild(lijst);
  }

  const knoppen = document.createElement("div");
  knoppen.className = "weekkaart-knoppen";
  const openKnop = document.createElement("button");
  openKnop.type = "button";
  openKnop.className = "tap-target";
  openKnop.textContent = "Open week";
  openKnop.addEventListener("click", () => onOpenWeek(weekMaandag));

  // FASE-9.md B2 punt 1: "Item erbij" gaf altijd de maandag door, ook als je
  // een andere dag bedoelde. Eerst een dagkiezer met alle zeven dagen van
  // déze week; de gekozen dag opent het dagblad met het formulier al open.
  const dagkiezerEl = document.createElement("div");
  dagkiezerEl.className = "weekkaart-dagkiezer";
  dagkiezerEl.hidden = true;
  for (const dag of dagen) {
    const { d } = parseYMD(dag.date);
    const dagKnop = document.createElement("button");
    dagKnop.type = "button";
    dagKnop.className = "tap-target";
    dagKnop.textContent = `${WEEKDAGEN[dag.weekday]} ${d}`;
    dagKnop.addEventListener("click", () => onItemErbij(dag.date));
    dagkiezerEl.appendChild(dagKnop);
  }

  const erbijKnop = document.createElement("button");
  erbijKnop.type = "button";
  erbijKnop.className = "tap-target";
  erbijKnop.textContent = "Item erbij";
  erbijKnop.addEventListener("click", () => {
    dagkiezerEl.hidden = !dagkiezerEl.hidden;
  });
  knoppen.appendChild(openKnop);
  knoppen.appendChild(erbijKnop);
  kaart.appendChild(knoppen);
  kaart.appendChild(dagkiezerEl);

  root.appendChild(kaart);
}

/**
 * @param {HTMLElement} root
 * @param {{startWeeks: string[], pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>, eigenReizen: object[]}} data
 * @param {(ymd: string) => void} onOpenWeek
 * @param {(ymd: string) => void} onItemErbij
 * @param {(ymd: string) => void} onDagKlik
 */
export function renderWeekstrips(root, { startWeeks, pythonAfgewezen, tripStatusOverrides = {}, eigenReizen = [] }, onOpenWeek, onItemErbij, onDagKlik) {
  root.textContent = "";
  for (const weekMaandag of startWeeks) {
    renderWeekkaart(root, weekMaandag, pythonAfgewezen, tripStatusOverrides, eigenReizen, onOpenWeek, onItemErbij, onDagKlik);
  }
}
