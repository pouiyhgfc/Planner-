/**
 * Dagblad — paneel dat over het scherm schuift bij een tik op een dag in
 * "Maand" (fase 8C). Vaste kopjes in vaste volgorde; een leeg kopje wordt
 * weggelaten, niet leeg getoond (FASE-8.md 8C).
 */

import { volledigeDatum, collegeWeek } from "./datumlabels.js";
import { courses } from "../data/courses.js";
import { opleveringen } from "../data/opleveringen.js";
import { projects } from "../data/projects.js";
import { costOfRange } from "../lib/blocks.js";
import { renderPlannerForm } from "./planner.js";

/**
 * @param {{date?: string, start?: string, label: string}} deadline
 * @returns {string} stabiele sleutel — deadlines hebben zelf geen id
 */
export function deadlineSleutel(deadline) {
  return `${deadline.date ?? deadline.start}::${deadline.label}`;
}

/**
 * @param {{id: string}} project
 * @param {{datum: string, label: string}} mijlpaal
 * @returns {string} stabiele sleutel — mijlpalen hebben zelf geen id
 */
export function mijlpaalSleutel(project, mijlpaal) {
  return `${project.id}::${mijlpaal.datum}::${mijlpaal.label}`;
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
 *   afgevinkteOpleveringen: string[],
 *   afgevinkteMijlpalen: string[],
 *   eigenProjecten: object[],
 *   pythonAfgewezen: boolean,
 *   vakkenVeldwaarden: Record<string, string>,
 *   formOpenen: boolean,
 * }} data
 * @param {{
 *   onSluiten: () => void,
 *   onItemToevoegen: (veld: object) => void,
 *   onAbsentieMarkeren: () => void,
 *   onNotitieToevoegen: (tekst: string) => void,
 *   onVerwijderItem: (id: string) => void,
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onOpleveringToggle: (id: string, afgevinkt: boolean) => void,
 *   onMijlpaalToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onVeldWijzigen: (sleutel: string, waarde: string) => void,
 *   onNaarVak: (vakId: string) => void,
 * }} acties
 */
export function renderDagblad(
  root,
  { ymd, dag, eigenItems, afgevinkteDeadlines, afgevinkteOpleveringen, afgevinkteMijlpalen, eigenProjecten = [], pythonAfgewezen = false, vakkenVeldwaarden = {}, formOpenen = false },
  acties
) {
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

  // 2. Reizen (fase 9 B1)
  const reizen = dag.vasteBoekingen.filter((v) => v.type === "vaste-boeking");
  const vluchtenVandaag = dag.vasteBoekingen.filter((v) => v.type === "vlucht");
  if (reizen.length > 0 || vluchtenVandaag.length > 0) {
    root.appendChild(kopSectie("Reizen"));
    const lijst = document.createElement("ul");
    for (const reis of reizen) {
      lijst.appendChild(renderReisRij(reis, ymd, vluchtenVandaag, vakkenVeldwaarden, acties.onVeldWijzigen));
    }
    for (const vlucht of vluchtenVandaag.filter((v) => !reizen.some((r) => r.variant === v.variant))) {
      const li = document.createElement("li");
      li.textContent = `${vlucht.label} — ${vlucht.status}`;
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  const lessen = dag.vakken.filter((v) => v.type === "les");
  const tentamens = dag.vakken.filter((v) => v.type === "tentamen" || /presentat/i.test(v.label));

  // 3. Lessen — elke les een blok (FASE-9.md B4), geen platte regel: alleen
  // velden tonen die er zijn, en wat er die dag voor dat vak in- of
  // uitgegeven wordt (dag.deadlines gefilterd op vak) er meteen bij, zodat
  // je bij de les zelf ziet dat je iets mee moet nemen.
  if (lessen.length > 0) {
    root.appendChild(kopSectie("Lessen"));
    const lijst = document.createElement("ul");
    for (const les of lessen) {
      lijst.appendChild(renderLesBlok(les, week, dag.deadlines, acties.onNaarVak));
    }
    root.appendChild(lijst);
  }

  // 4. Tentamens en presentaties
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

  // 5. Opleveringen (fase 9 B3) — items met een vaste of zelf ingevulde
  // datum die op deze dag valt.
  const opleveringenVandaag = opleveringen.filter((o) => (o.datum ?? vakkenVeldwaarden[`${o.id}.datum`]) === ymd);
  if (opleveringenVandaag.length > 0) {
    root.appendChild(kopSectie("Opleveringen"));
    const lijst = document.createElement("ul");
    for (const item of opleveringenVandaag) {
      lijst.appendChild(renderOpleveringRij(item, afgevinkteOpleveringen, acties.onOpleveringToggle));
    }
    root.appendChild(lijst);
  }

  // 6. Deadlines
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

  // 7. Projecten — mijlpalen uit src/data/projects.js plus eigen projecten
  // uit de state, die op deze dag vallen.
  const alleProjecten = [...projects, ...eigenProjecten];
  const projectMijlpalenVandaag = alleProjecten.flatMap((project) => project.mijlpalen.filter((m) => m.datum === ymd).map((mijlpaal) => ({ project, mijlpaal })));
  if (projectMijlpalenVandaag.length > 0) {
    root.appendChild(kopSectie("Projecten"));
    const lijst = document.createElement("ul");
    for (const { project, mijlpaal } of projectMijlpalenVandaag) {
      lijst.appendChild(renderProjectMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen, acties.onMijlpaalToggle));
    }
    root.appendChild(lijst);
  }

  // 8. Eigen items
  if (eigenItems.length > 0) {
    root.appendChild(kopSectie("Eigen items"));
    const lijst = document.createElement("ul");
    for (const item of eigenItems) {
      lijst.appendChild(renderEigenItemRij(item, acties.onVerwijderItem));
    }
    root.appendChild(lijst);
  }

  // 9. Wat deze dag kost
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

  root.appendChild(renderActieknoppen(ymd, acties, formOpenen));
}

/**
 * Eén lesblok (FASE-9.md B4): vaknaam, tijd, zaal, weeknummer, onderwerp,
 * en — alleen als aanwezig — spreker, leesopdracht, lesvorm en wat er die
 * dag voor dit vak in- of uitgegeven wordt. Elk leeg veld wordt weggelaten,
 * nooit leeg getoond.
 * @param {object} les
 * @param {{week: number, totaal: number}|null} week
 * @param {object[]} deadlinesVandaag dag.deadlines — hier gefilterd op vak
 * @param {(vakId: string) => void} onNaarVak
 */
function renderLesBlok(les, week, deadlinesVandaag, onNaarVak) {
  const course = courseVoor(les.course);
  const li = document.createElement("li");
  li.className = "lesblok";

  const balkje = document.createElement("span");
  balkje.className = "lesblok-balkje";
  balkje.style.background = `var(--vak-${course.id.toLowerCase()}-bg)`;
  li.appendChild(balkje);

  const inhoud = document.createElement("div");
  inhoud.className = "lesblok-inhoud";

  const kopRegel = document.createElement("div");
  kopRegel.className = "lesblok-kop";
  const naam = document.createElement("span");
  naam.className = "lesblok-vak";
  naam.textContent = course.name;
  const tijd = document.createElement("span");
  tijd.className = "lesblok-tijd";
  tijd.textContent = `${course.start}–${course.end}`;
  kopRegel.appendChild(naam);
  kopRegel.appendChild(tijd);
  inhoud.appendChild(kopRegel);

  const zaal = course.room ?? "zaal onbekend";
  const metaRegel = document.createElement("p");
  metaRegel.className = "lesblok-meta";
  metaRegel.textContent = week ? `${zaal} · week ${week.week}` : zaal;
  inhoud.appendChild(metaRegel);

  const onderwerp = document.createElement("p");
  onderwerp.className = "lesblok-onderwerp";
  onderwerp.textContent = les.label;
  inhoud.appendChild(onderwerp);

  function kleinRegel(tekst) {
    const p = document.createElement("p");
    p.className = "dagblad-klein";
    p.textContent = tekst;
    inhoud.appendChild(p);
  }

  if (les.spreker) kleinRegel(`Spreker: ${les.spreker}`);
  if (les.lezen) kleinRegel(`Lezen: ${les.lezen}`);
  if (les.vorm) kleinRegel(`Vorm: ${les.vorm}`);

  const vakDeadlines = deadlinesVandaag.filter((d) => d.course === les.course);
  if (vakDeadlines.length > 0) {
    const lijst = document.createElement("ul");
    lijst.className = "lesblok-acties";
    for (const d of vakDeadlines) {
      const item = document.createElement("li");
      item.textContent = d.label;
      lijst.appendChild(item);
    }
    inhoud.appendChild(lijst);
  }

  const naarVak = document.createElement("button");
  naarVak.type = "button";
  naarVak.className = "lesblok-naar-vak";
  naarVak.textContent = "Naar vak";
  naarVak.addEventListener("click", () => onNaarVak(course.id));
  inhoud.appendChild(naarVak);

  li.appendChild(inhoud);
  return li;
}

/**
 * Eén oplevering-rij (fase 9 B3/B4) in het dagblad: naam, weging als bekend,
 * en een vinkje.
 * @param {object} item
 * @param {string[]} afgevinkteOpleveringen
 * @param {(id: string, afgevinkt: boolean) => void} onToggle
 */
function renderOpleveringRij(item, afgevinkteOpleveringen, onToggle) {
  const course = courseVoor(item.vak);
  const li = document.createElement("li");
  const label = document.createElement("label");
  const vinkje = document.createElement("input");
  vinkje.type = "checkbox";
  vinkje.checked = afgevinkteOpleveringen.includes(item.id);
  vinkje.addEventListener("change", () => onToggle(item.id, vinkje.checked));
  label.appendChild(vinkje);
  const tekst = document.createElement("span");
  const wegingTekst = item.weging !== null ? ` (${item.weging}%)` : "";
  tekst.textContent = ` ${course.name} — ${item.naam}${wegingTekst}`;
  label.appendChild(tekst);
  li.appendChild(label);
  return li;
}

/**
 * Eén projectmijlpaal-rij (fase 9 B4) in het dagblad.
 * @param {object} project
 * @param {{datum: string, label: string}} mijlpaal
 * @param {string[]} afgevinkteMijlpalen
 * @param {(sleutel: string, afgevinkt: boolean) => void} onToggle
 */
function renderProjectMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen, onToggle) {
  const sleutel = mijlpaalSleutel(project, mijlpaal);
  const li = document.createElement("li");
  const label = document.createElement("label");
  const vinkje = document.createElement("input");
  vinkje.type = "checkbox";
  vinkje.checked = afgevinkteMijlpalen.includes(sleutel);
  vinkje.addEventListener("change", () => onToggle(sleutel, vinkje.checked));
  label.appendChild(vinkje);
  const tekst = document.createElement("span");
  tekst.textContent = ` ${project.vak ? `${project.naam} (${project.vak})` : project.naam}: ${mijlpaal.label}`;
  label.appendChild(tekst);
  li.appendChild(label);
  return li;
}

/**
 * Eén reisrij (fase 9 B1): label, of het de eerste/laatste/enige/
 * tussenliggende dag is, de status, en de vlucht als die op deze dag valt.
 * Eigen reizen (bron "eigen invoer") krijgen een klein onderscheid; een reis
 * met onbekendeVelden (bijv. Filipijnen — vluchtnummer/luchthavens/
 * overnachtingen) krijgt invulbare velden, geen gok.
 * @param {object} reis
 * @param {string} ymd
 * @param {object[]} vluchtenVandaag
 * @param {Record<string, string>} vakkenVeldwaarden
 * @param {(sleutel: string, waarde: string) => void} onVeldWijzigen
 */
function renderReisRij(reis, ymd, vluchtenVandaag, vakkenVeldwaarden, onVeldWijzigen) {
  const li = document.createElement("li");

  const positie =
    reis.start === reis.end ? "enige dag" : reis.start === ymd ? "eerste dag" : reis.end === ymd ? "laatste dag" : "tussenliggende dag";
  const herkomst = reis.bron === "eigen invoer" ? " (eigen invoer)" : "";
  const naamRegel = document.createElement("div");
  naamRegel.textContent = `${reis.label} — ${positie} — ${reis.status}${herkomst}`;
  li.appendChild(naamRegel);

  const vluchtVandaag = vluchtenVandaag.find((v) => v.variant === reis.variant);
  if (vluchtVandaag) {
    const vluchtRegel = document.createElement("div");
    vluchtRegel.className = "dagblad-klein";
    vluchtRegel.textContent = vluchtVandaag.label;
    li.appendChild(vluchtRegel);
  }

  if (reis.onbekendeVelden?.length > 0) {
    li.appendChild(renderOnbekendeVeldenForm(reis, vakkenVeldwaarden, onVeldWijzigen));
  }

  return li;
}

function renderOnbekendeVeldenForm(reis, vakkenVeldwaarden, onVeldWijzigen) {
  const wrap = document.createElement("div");
  wrap.className = "dagblad-onbekende-velden";
  for (const veld of reis.onbekendeVelden) {
    const sleutel = `${reis.variant}.${veld}`;
    const label = document.createElement("label");
    label.textContent = `${veld}: `;
    const input = document.createElement("input");
    input.type = "text";
    input.value = vakkenVeldwaarden[sleutel] ?? "";
    input.placeholder = "ONBEKEND";
    input.addEventListener("change", () => onVeldWijzigen(sleutel, input.value));
    label.appendChild(input);
    wrap.appendChild(label);
  }
  return wrap;
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

function renderActieknoppen(ymd, acties, formOpenen) {
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

  function openToevoegForm() {
    invoegPlek.textContent = "";
    renderPlannerForm(
      invoegPlek,
      (veld) => {
        acties.onItemToevoegen(veld);
        invoegPlek.textContent = "";
      },
      { start: ymd, end: ymd }
    );
  }

  toevoegKnop.addEventListener("click", openToevoegForm);
  // FASE-9.md B2 punt 1: "Item erbij" vanuit Weken opent het dagblad met dit
  // formulier al open, zodat het kiezen van een dag ook meteen de invoer opent.
  if (formOpenen) openToevoegForm();

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
