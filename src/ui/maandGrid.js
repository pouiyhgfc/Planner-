/**
 * Scherm "Maand" — fase 8C. Klassieke maandkalender, 7 kolommen (ma-zo).
 * Rekent uitsluitend met lib/date.js-functies (addDays/rangeDays/dayOfWeek/
 * toYMD) en lib/dayStatus.js — geen new Date(), geen hardcoded datums.
 */

import { toYMD, parseYMD, addDays, dayOfWeek, rangeDays } from "../lib/date.js";
import { dayStatus } from "../lib/dayStatus.js";
import { freeBlocks } from "../lib/blocks.js";
import { zwareMomentenOpDag, weekgewicht } from "../lib/weekgewicht.js";
import { appPeriod } from "../data/semester.js";
import { courses, courseVoor } from "../data/courses.js";
import { WEEKDAGEN, maandNaam } from "./datumlabels.js";

const AFKORTING = { PSY: "PSY", PY: "PY", AGTECH: "AGT", RTE: "RTE", CHI: "CHI" };
const ZWAAR_DREMPEL = 3;
const KALENDER_WEERGAVEN = [
  { id: "compact", label: "Compact" },
  { id: "uitgebreid", label: "Uitgebreid" },
];

/**
 * FASE-9.md B5 punt 2: het korte woord voor één zwaar moment, bijv.
 * "midterm", "mondeling", "presentatie". CHI-tentamens hebben een eigen
 * `onderdeel`-veld (mondeling/schriftelijk/presentatie, uit A1) — dat wint;
 * anders wordt het label zelf gebruikt om midterm/final/exam te herkennen.
 * @param {object} item
 * @returns {string}
 */
function kortMomentType(item) {
  if (item.type === "tentamen") {
    if (item.onderdeel) return item.onderdeel;
    if (/midterm/i.test(item.label)) return "midterm";
    if (/final/i.test(item.label)) return "final";
    if (/comprehensive|exam/i.test(item.label)) return "exam";
    return "tentamen";
  }
  return "presentatie";
}

/**
 * FASE-9.md B5 punt 2: één regel tekst voor een dag, alleen bij een
 * tentamen, presentatie of harde deadline — anders null (geen tekst bij
 * gewone lesdagen). Bij precies één zwaar moment: vak-afkorting plus het
 * korte type ("PSY midterm"). Bij twee of meer: het aantal plus een generiek
 * woord, "specifiek" als alle zware momenten van hetzelfde soort zijn
 * (bijv. "2 tentamens"), anders "zware momenten".
 * @param {ReturnType<typeof dayStatus>} dag
 * @returns {string|null}
 */
export function zwareRegelTekst(dag) {
  const { tentamens, presentaties, deadlines, totaal } = zwareMomentenOpDag(dag);
  if (totaal === 0) return null;
  if (totaal === 1) {
    const item = tentamens[0] ?? presentaties[0];
    if (item) return `${AFKORTING[item.course] ?? item.course} ${kortMomentType(item)}`;
    return deadlines[0].course ? `${AFKORTING[deadlines[0].course] ?? deadlines[0].course} deadline` : "Deadline";
  }
  const woord =
    tentamens.length === totaal ? "tentamens" : presentaties.length === totaal ? "presentaties" : deadlines.length === totaal ? "deadlines" : "zware momenten";
  return `${totaal} ${woord}`;
}

/**
 * FASE-9.md B5 punt 3: de onderwerpen van een dag, afgekort tot de labels
 * zelf, chronologisch, voor de "uitgebreide" weergave. null als er niets is.
 * @param {ReturnType<typeof dayStatus>} dag
 * @returns {string|null}
 */
export function onderwerpenTekst(dag) {
  const vakken = gesorteerdOpTijd(dag.vakken);
  if (vakken.length === 0) return null;
  return vakken.map((v) => v.label).join(" · ");
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
 *   items: object[], pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>,
 *   eigenReizen: object[], kalenderWeergave: "compact"|"uitgebreid",
 * }} opts
 * @param {(ymd: string) => void} onDagKlik
 * @param {(jaar: number, maand: number) => void} onNavigeren
 * @param {(waarde: "compact"|"uitgebreid") => void} onWeergaveWijzigen
 */
export function renderMaandScherm(root, opts, onDagKlik, onNavigeren, onWeergaveWijzigen) {
  const { jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides = {}, eigenReizen = [], kalenderWeergave = "compact" } = opts;
  root.textContent = "";

  root.appendChild(renderHeader(jaar, maand, vandaag, onNavigeren));
  root.appendChild(renderWeergaveToggle(kalenderWeergave, onWeergaveWijzigen));
  root.appendChild(renderGrid(jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen, kalenderWeergave, onDagKlik));
  root.appendChild(renderLegenda());
}

/**
 * FASE-9.md B5 punt 3: schakelaar compact/uitgebreid boven de kalender.
 * @param {"compact"|"uitgebreid"} huidig
 * @param {(waarde: "compact"|"uitgebreid") => void} onWijzigen
 */
function renderWeergaveToggle(huidig, onWijzigen) {
  const rij = document.createElement("div");
  rij.className = "maand-weergave-toggle";
  for (const w of KALENDER_WEERGAVEN) {
    const knop = document.createElement("button");
    knop.type = "button";
    knop.className = "tap-target weergave-knop";
    knop.textContent = w.label;
    knop.setAttribute("aria-current", huidig === w.id ? "true" : "false");
    knop.addEventListener("click", () => onWijzigen(w.id));
    rij.appendChild(knop);
  }
  return rij;
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

function renderGrid(jaar, maand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen, kalenderWeergave, onDagKlik) {
  const weken = maandWeken(jaar, maand);
  const frag = document.createDocumentFragment();

  const dagkoppen = document.createElement("div");
  dagkoppen.className = "maand-dagkoppen";
  const gewichtSpacer = document.createElement("span");
  dagkoppen.appendChild(gewichtSpacer);
  for (const naam of WEEKDAGEN) {
    const kop = document.createElement("span");
    kop.textContent = naam;
    dagkoppen.appendChild(kop);
  }
  frag.appendChild(dagkoppen);

  let lesmomenten = 0;
  let tentamens = 0;

  for (const week of weken) {
    const weekrij = document.createElement("div");
    weekrij.className = "maand-weekrij";

    // FASE-9.md B5 punt 1: weekgewicht — weeknummer plus het aantal zware
    // momenten (tentamens, presentaties, harde deadlines) die kalenderweek,
    // ongeacht welke maand hier getoond wordt (dus incl. buiten-maand-dagen).
    const gewicht = weekgewicht(week[0], pythonAfgewezen, tripStatusOverrides, eigenReizen);
    weekrij.appendChild(renderWeekgewicht(gewicht));

    for (const ymd of week) {
      const { m } = parseYMD(ymd);
      const buitenPeriode = ymd < appPeriod.start || ymd > appPeriod.end;
      const buitenMaand = m !== maand;
      weekrij.appendChild(
        renderDagvak(ymd, buitenPeriode, buitenMaand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen, kalenderWeergave, onDagKlik, (dag) => {
          if (buitenMaand || buitenPeriode) return;
          lesmomenten += dag.vakken.filter((v) => v.type === "les").length;
          tentamens += dag.vakken.filter((v) => v.type === "tentamen").length;
        })
      );
    }
    frag.appendChild(weekrij);
  }

  const eersteDag = toYMD({ y: jaar, m: maand, d: 1 });
  const laatsteDag = laatsteDagVanMaand(jaar, maand);
  const vrijeBlokken = freeBlocks(pythonAfgewezen, tripStatusOverrides, eigenReizen).filter((b) => b.start >= eersteDag && b.start <= laatsteDag).length;

  const telling = document.createElement("p");
  telling.className = "maand-telling";
  telling.textContent = `${lesmomenten} lesmomenten · ${tentamens} tentamens · ${vrijeBlokken} vrije blokken beginnen deze maand`;
  frag.appendChild(telling);

  return frag;
}

/**
 * FASE-9.md B5 punt 1: smalle kolom links van elke weekrij. 0 blijft leeg,
 * niet "0"; drie of meer zware momenten krijgt een rand in --danger-border.
 * Geen collegeweek van toepassing (vakantie, buiten het semester) → leeg.
 * @param {ReturnType<typeof weekgewicht>} gewicht
 */
function renderWeekgewicht(gewicht) {
  const el = document.createElement("div");
  el.className = "maand-weekgewicht";
  if (gewicht.week === null) return el;

  const weekEl = document.createElement("span");
  weekEl.className = "maand-weekgewicht-week";
  weekEl.textContent = String(gewicht.week);
  el.appendChild(weekEl);

  if (gewicht.totaal > 0) {
    const getalEl = document.createElement("span");
    getalEl.className = "maand-weekgewicht-getal";
    getalEl.textContent = String(gewicht.totaal);
    el.appendChild(getalEl);
    if (gewicht.totaal >= ZWAAR_DREMPEL) el.classList.add("zwaar");
  }

  return el;
}

function renderDagvak(ymd, buitenPeriode, buitenMaand, vandaag, geselecteerd, items, pythonAfgewezen, tripStatusOverrides, eigenReizen, kalenderWeergave, onDagKlik, telMee) {
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

  const dag = dayStatus(ymd, pythonAfgewezen, tripStatusOverrides, eigenReizen);
  telMee(dag);

  if (dag.status === "feestdag" || dag.status === "geen-les") knop.classList.add("status-gemarkeerd");
  if (ymd === vandaag) knop.dataset.vandaag = "true";
  if (ymd === geselecteerd) knop.classList.add("geselecteerd");

  renderReisElementen(knop, dag, ymd);

  const streepjes = document.createElement("span");
  streepjes.className = "dagvak-streepjes";
  for (const vak of gesorteerdOpTijd(dag.vakken)) {
    const el = document.createElement("span");
    el.className = isStipMoment(vak) ? "stip" : "streepje";
    el.style.backgroundColor = `var(--vak-${vak.course.toLowerCase()}-text)`;
    streepjes.appendChild(el);
  }
  knop.appendChild(streepjes);

  // FASE-9.md B5 punt 2/3: compact toont alleen de zware-momentenregel
  // (leeg bij een gewone lesdag); uitgebreid toont elke dag de onderwerpen.
  const regelTekst = kalenderWeergave === "uitgebreid" ? onderwerpenTekst(dag) : zwareRegelTekst(dag);
  if (regelTekst) {
    const regel = document.createElement("span");
    regel.className = "dagvak-regel";
    regel.textContent = regelTekst;
    knop.appendChild(regel);
  }

  const heeftEigenItem = items.some((item) => item.start <= ymd && ymd <= item.end);
  if (heeftEigenItem) {
    const balk = document.createElement("span");
    balk.className = "dagvak-eigen-balk";
    knop.appendChild(balk);
  }

  knop.addEventListener("click", () => onDagKlik(ymd));
  return knop;
}

/**
 * Reisband (fase 9 B1): een doorlopende band over de volle breedte voor elke
 * dag binnen een reis (`--accent-bg`/`--accent-border` — geen vakkleur, geen
 * `--purple-*`, dat is Python), afgeronde hoek op de eerste/laatste reisdag,
 * streepjesrand bij status "wijziging-aangevraagd". Een losse vlucht (geen
 * bijbehorend bereik die dag) krijgt een gevulde ruit, geen emoji.
 * @param {HTMLElement} knop
 * @param {ReturnType<typeof dayStatus>} dag
 * @param {string} ymd
 */
function renderReisElementen(knop, dag, ymd) {
  const boeking = dag.vasteBoekingen.find((v) => v.type === "vaste-boeking");
  if (boeking) {
    const band = document.createElement("span");
    band.className = "dagvak-reis-band";
    if (boeking.start === ymd) band.classList.add("reis-eerste");
    if (boeking.end === ymd) band.classList.add("reis-laatste");
    if (boeking.status === "wijziging-aangevraagd") band.classList.add("reis-aangevraagd");
    knop.appendChild(band);
  }

  if (dag.vasteBoekingen.some((v) => v.type === "vlucht")) {
    const ruit = document.createElement("span");
    ruit.className = "dagvak-reis-vlucht";
    knop.appendChild(ruit);
  }
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

  const reisLi = document.createElement("li");
  const reisSwatch = document.createElement("span");
  reisSwatch.className = "legenda-swatch legenda-swatch-reis";
  reisLi.appendChild(reisSwatch);
  const reisTekst = document.createElement("span");
  reisTekst.textContent = "Reis — band over de volle breedte, streepjesrand = wijziging aangevraagd, ruit = losse vlucht";
  reisLi.appendChild(reisTekst);
  lijst.appendChild(reisLi);

  return lijst;
}
