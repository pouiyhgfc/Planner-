/**
 * Dagblad — paneel dat over het scherm schuift bij een tik op een dag in
 * "Maand" (fase 8C). Vaste kopjes in vaste volgorde; een leeg kopje wordt
 * weggelaten, niet leeg getoond (FASE-8.md 8C).
 */

import { volledigeDatum, collegeWeek } from "./datumlabels.js";
import { courses } from "../data/courses.js";
import { costOfRange } from "../lib/blocks.js";
import { renderPlannerForm } from "./planner.js";

/**
 * @param {{date?: string, start?: string, label: string}} deadline
 * @returns {string} stabiele sleutel — deadlines hebben zelf geen id
 */
export function deadlineSleutel(deadline) {
  return `${deadline.date ?? deadline.start}::${deadline.label}`;
}

function courseVoor(id) {
  return courses.find((c) => c.id === id);
}

function kopSectie(titel) {
  const kop = document.createElement("h3");
  kop.className = "dagblad-kop";
  kop.textContent = titel;
  return kop;
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   ymd: string,
 *   dag: ReturnType<typeof import("../lib/dayStatus.js").dayStatus>,
 *   eigenItems: object[],
 *   afgevinkteDeadlines: string[],
 *   pythonAfgewezen: boolean,
 * }} data
 * @param {{
 *   onSluiten: () => void,
 *   onItemToevoegen: (veld: object) => void,
 *   onAbsentieMarkeren: () => void,
 *   onNotitieToevoegen: (tekst: string) => void,
 *   onVerwijderItem: (id: string) => void,
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 * }} acties
 */
export function renderDagblad(root, { ymd, dag, eigenItems, afgevinkteDeadlines, pythonAfgewezen = false }, acties) {
  root.textContent = "";

  const kop = document.createElement("div");
  kop.className = "dagblad-kop-rij";
  const sluit = document.createElement("button");
  sluit.type = "button";
  sluit.className = "tap-target";
  sluit.textContent = "Sluiten";
  sluit.addEventListener("click", acties.onSluiten);
  kop.appendChild(sluit);
  root.appendChild(kop);

  // 1. Datum
  const week = collegeWeek(ymd);
  const datumTekst = week ? `${volledigeDatum(ymd)} · week ${week.week}` : volledigeDatum(ymd);
  const datumEl = document.createElement("p");
  datumEl.className = "dagblad-datum";
  datumEl.textContent = datumTekst;
  root.appendChild(datumEl);

  const lessen = dag.vakken.filter((v) => v.type === "les");
  const tentamens = dag.vakken.filter((v) => v.type === "tentamen" || /presentat/i.test(v.label));

  // 2. Lessen
  if (lessen.length > 0) {
    root.appendChild(kopSectie("Lessen"));
    const lijst = document.createElement("ul");
    for (const les of lessen) {
      const course = courseVoor(les.course);
      const li = document.createElement("li");
      const zaal = course.room ?? "zaal onbekend";
      const spreker = les.spreker ? ` (${les.spreker})` : "";
      li.textContent = `${course.name} — ${course.start}–${course.end} — ${zaal} — ${les.label}${spreker}`;
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 3. Tentamens en presentaties
  if (tentamens.length > 0) {
    root.appendChild(kopSectie("Tentamens en presentaties"));
    const lijst = document.createElement("ul");
    for (const t of tentamens) {
      const course = courseVoor(t.course);
      const li = document.createElement("li");
      const naamRegel = document.createElement("div");
      naamRegel.textContent = `${course.name} — ${t.label}`;
      li.appendChild(naamRegel);
      const regelsRegel = document.createElement("div");
      regelsRegel.className = "dagblad-klein";
      regelsRegel.textContent = course.beoordeling.tekst;
      li.appendChild(regelsRegel);
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 4. Deadlines
  if (dag.deadlines.length > 0) {
    root.appendChild(kopSectie("Deadlines"));
    const lijst = document.createElement("ul");
    for (const deadline of dag.deadlines) {
      const sleutel = deadlineSleutel(deadline);
      const li = document.createElement("li");
      const label = document.createElement("label");
      const vinkje = document.createElement("input");
      vinkje.type = "checkbox";
      vinkje.checked = afgevinkteDeadlines.includes(sleutel);
      vinkje.addEventListener("change", () => acties.onDeadlineToggle(sleutel, vinkje.checked));
      label.appendChild(vinkje);
      const tekst = document.createElement("span");
      tekst.textContent = ` ${deadline.label}`;
      label.appendChild(tekst);
      li.appendChild(label);
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 5. Projecten — nog geen projectdata (volgt in fase 8E), dus altijd leeg.

  // 6. Eigen items
  if (eigenItems.length > 0) {
    root.appendChild(kopSectie("Eigen items"));
    const lijst = document.createElement("ul");
    for (const item of eigenItems) {
      lijst.appendChild(renderEigenItemRij(item, acties.onVerwijderItem));
    }
    root.appendChild(lijst);
  }

  // 7. Wat deze dag kost
  const { perVak } = costOfRange(ymd, ymd, pythonAfgewezen);
  const vakken = Object.entries(perVak);
  if (vakken.length > 0) {
    root.appendChild(kopSectie("Wat deze dag kost"));
    const lijst = document.createElement("ul");
    for (const [vak, n] of vakken) {
      const li = document.createElement("li");
      li.textContent = `${vak}: ${n} lesmoment(en) gemist bij absentie`;
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  root.appendChild(renderActieknoppen(ymd, acties));
}

function renderEigenItemRij(item, onVerwijderen) {
  const li = document.createElement("li");
  li.className = "eigen-item-rij";

  const tekst = document.createElement("span");
  const bereik = item.start === item.end ? "" : ` (${item.start} → ${item.end})`;
  tekst.textContent = `${item.naam}${bereik} — ${item.status}${item.notitie ? ` — ${item.notitie}` : ""}`;
  li.appendChild(tekst);

  const verwijder = document.createElement("button");
  verwijder.type = "button";
  verwijder.textContent = "Verwijderen";
  let bevestigen = false;
  verwijder.addEventListener("click", () => {
    if (!bevestigen) {
      bevestigen = true;
      verwijder.textContent = "Zeker weten?";
      return;
    }
    onVerwijderen(item.id);
  });
  li.appendChild(verwijder);

  return li;
}

function renderActieknoppen(ymd, acties) {
  const wrap = document.createElement("div");
  wrap.className = "dagblad-acties";

  const toevoegKnop = document.createElement("button");
  toevoegKnop.type = "button";
  toevoegKnop.className = "tap-target";
  toevoegKnop.textContent = "Item toevoegen";

  const absentieKnop = document.createElement("button");
  absentieKnop.type = "button";
  absentieKnop.className = "tap-target";
  absentieKnop.textContent = "Absentie markeren";
  absentieKnop.addEventListener("click", acties.onAbsentieMarkeren);

  const notitieKnop = document.createElement("button");
  notitieKnop.type = "button";
  notitieKnop.className = "tap-target";
  notitieKnop.textContent = "Notitie";

  wrap.appendChild(toevoegKnop);
  wrap.appendChild(absentieKnop);
  wrap.appendChild(notitieKnop);

  const invoegPlek = document.createElement("div");
  wrap.appendChild(invoegPlek);

  toevoegKnop.addEventListener("click", () => {
    invoegPlek.textContent = "";
    renderPlannerForm(
      invoegPlek,
      (veld) => {
        acties.onItemToevoegen(veld);
        invoegPlek.textContent = "";
      },
      { start: ymd, end: ymd }
    );
  });

  notitieKnop.addEventListener("click", () => {
    invoegPlek.textContent = "";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Notitietekst";
    const bevestig = document.createElement("button");
    bevestig.type = "button";
    bevestig.textContent = "Notitie opslaan";
    bevestig.addEventListener("click", () => {
      if (!input.value) return;
      acties.onNotitieToevoegen(input.value);
      invoegPlek.textContent = "";
    });
    invoegPlek.appendChild(input);
    invoegPlek.appendChild(bevestig);
  });

  return wrap;
}
