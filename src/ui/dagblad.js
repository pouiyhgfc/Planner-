/**
 * Dagblad — paneel dat over het scherm schuift bij een tik op een dag in
 * "Maand" (fase 8C). Vaste kopjes in vaste volgorde; een leeg kopje wordt
 * weggelaten, niet leeg getoond (FASE-8.md 8C).
 */

import { volledigeDatum, kortDatum, collegeWeek } from "./datumlabels.js";
import { meervoud } from "./tekst.js";
import { courseVoor } from "../data/courses.js";
import { bevestigKnop } from "./knoppen.js";

import { projects } from "../data/projects.js";
import { zichtbareOpleveringen } from "./overzichtData.js";
import { appPeriod } from "../data/semester.js";
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

/**
 * Sleutels voor state.verborgenItems (schema.js v12). De soort staat vooraan
 * zodat een deadline en een oplevering nooit dezelfde sleutel kunnen
 * opleveren.
 * @param {object} deadline
 * @returns {string}
 */
export function verborgenDeadlineSleutel(deadline) {
  return `deadline::${deadlineSleutel(deadline)}`;
}

/**
 * @param {string} id een src/data/opleveringen.js item-id
 * @returns {string}
 */
export function verborgenOpleveringSleutel(id) {
  return `oplevering::${id}`;
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
 *   verborgenItems: string[],
 *   formOpenen: boolean,
 *   formBereik: {start: string, end: string}|null,
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
 *   onDagVerschuiven: (dagen: number) => void,
 *   onVerbergen: (sleutel: string) => void,
 * }} acties
 */
export function renderDagblad(
  root,
  { ymd, dag, eigenItems, afgevinkteDeadlines, afgevinkteOpleveringen, afgevinkteMijlpalen, eigenProjecten = [], pythonAfgewezen = false, vakkenVeldwaarden = {}, verborgenItems = [], formOpenen = false, formBereik = null },
  acties
) {
  root.textContent = "";

  // 1. Datum — op dezelfde regel als Sluiten; die knop stond eerder alleen
  // op een eigen regel met de datum eronder, wat een halve schermhoogte
  // kostte voordat de inhoud begon.
  const week = collegeWeek(ymd);
  const kop = document.createElement("div");
  kop.className = "dagblad-kop-rij";

  const datumEl = document.createElement("p");
  datumEl.className = "dagblad-datum";
  datumEl.textContent = week ? `${volledigeDatum(ymd)} · week ${week.week}` : volledigeDatum(ymd);
  kop.appendChild(datumEl);

  // Een dag verder kijken kostte eerst sluiten, de juiste maand zoeken en een
  // nieuw vakje aantikken. De pijlen lopen door over maandgrenzen heen en
  // stoppen bij de randen van de app-periode.
  const bladeren = document.createElement("div");
  bladeren.className = "dagblad-bladeren";
  const vorige = document.createElement("button");
  vorige.type = "button";
  vorige.className = "tap-target dagblad-pijl";
  vorige.textContent = "‹";
  vorige.setAttribute("aria-label", "Vorige dag");
  vorige.disabled = ymd <= appPeriod.start;
  vorige.addEventListener("click", () => acties.onDagVerschuiven(-1));
  const volgende = document.createElement("button");
  volgende.type = "button";
  volgende.className = "tap-target dagblad-pijl";
  volgende.textContent = "›";
  volgende.setAttribute("aria-label", "Volgende dag");
  volgende.disabled = ymd >= appPeriod.end;
  volgende.addEventListener("click", () => acties.onDagVerschuiven(1));
  bladeren.appendChild(vorige);
  bladeren.appendChild(volgende);
  kop.appendChild(bladeren);

  const sluit = document.createElement("button");
  sluit.type = "button";
  sluit.className = "tap-target";
  sluit.textContent = "Sluiten";
  sluit.addEventListener("click", acties.onSluiten);
  kop.appendChild(sluit);

  root.appendChild(kop);

  // 2. Vrij — feestdagen en geen-lesdagen stonden nergens in het dagblad:
  // 10 oktober "National Day" was een leeg dagblad. Vakantie krijgt geen
  // eigen regel: dat zijn 46 aaneengesloten dagen, de dagstatus zegt dat al.
  if (dag.feestdagen.length > 0) {
    root.appendChild(kopSectie("Vrij"));
    const lijst = document.createElement("ul");
    for (const vrij of dag.feestdagen) {
      const li = document.createElement("li");
      li.textContent = vrij.type === "geen-les" ? `${vrij.label} — geen lessen` : vrij.label;
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 3. Reizen (fase 9 B1)
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
  const deadlinesVandaag = dag.deadlines.filter((d) => !verborgenItems.includes(verborgenDeadlineSleutel(d)));

  // 4. Lessen — elke les een blok (FASE-9.md B4), geen platte regel: alleen
  // velden tonen die er zijn, en wat er die dag voor dat vak in- of
  // uitgegeven wordt (dag.deadlines gefilterd op vak) er meteen bij, zodat
  // je bij de les zelf ziet dat je iets mee moet nemen.
  if (lessen.length > 0) {
    root.appendChild(kopSectie("Lessen"));
    const lijst = document.createElement("ul");
    for (const les of lessen) {
      lijst.appendChild(renderLesBlok(les, week, deadlinesVandaag, acties.onNaarVak));
    }
    root.appendChild(lijst);
  }

  // 5. Tentamens en presentaties. Alleen wat over dít moment gaat: de
  // beoordelingsregels van het hele vak stonden hier eerder integraal onder
  // elk tentamen — een grijze muur die zich per item herhaalde en die op de
  // vakpagina thuishoort, één tik verderop.
  if (tentamens.length > 0) {
    root.appendChild(kopSectie("Tentamens en presentaties"));
    const lijst = document.createElement("ul");
    for (const t of tentamens) {
      const li = document.createElement("li");
      li.className = "dagblad-moment";

      const naamRegel = document.createElement("div");
      naamRegel.textContent = `${courseVoor(t.course).name} — ${t.label}`;
      li.appendChild(naamRegel);

      if (t.wegingToelichting) {
        const toelichting = document.createElement("div");
        toelichting.className = "dagblad-klein";
        toelichting.textContent = t.wegingToelichting;
        li.appendChild(toelichting);
      }

      li.appendChild(naarVakKnop(t.course, acties.onNaarVak));
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 6. Opleveringen (fase 9 B3) — items met een vaste of zelf ingevulde
  // datum die op deze dag valt.
  const opleveringenVandaag = zichtbareOpleveringen(verborgenItems).filter((o) => (o.datum ?? vakkenVeldwaarden[`${o.id}.datum`]) === ymd);
  if (opleveringenVandaag.length > 0) {
    root.appendChild(kopSectie("Opleveringen"));
    const lijst = document.createElement("ul");
    for (const item of opleveringenVandaag) {
      const rij = renderOpleveringRij(item, afgevinkteOpleveringen, acties.onOpleveringToggle);
      rij.appendChild(verbergKnop(verborgenOpleveringSleutel(item.id), acties.onVerbergen));
      lijst.appendChild(rij);
    }
    root.appendChild(lijst);
  }

  // 7. Deadlines
  if (deadlinesVandaag.length > 0) {
    root.appendChild(kopSectie("Deadlines"));
    const lijst = document.createElement("ul");
    for (const deadline of deadlinesVandaag) {
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
      li.appendChild(verbergKnop(verborgenDeadlineSleutel(deadline), acties.onVerbergen));
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  // 8. Projecten — mijlpalen uit src/data/projects.js plus eigen projecten
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

  // 9. Eigen items
  if (eigenItems.length > 0) {
    root.appendChild(kopSectie("Eigen items"));
    const lijst = document.createElement("ul");
    for (const item of eigenItems) {
      lijst.appendChild(renderEigenItemRij(item, acties.onVerwijderItem));
    }
    root.appendChild(lijst);
  }

  // 10. Wat deze dag kost
  const { perVak } = costOfRange(ymd, ymd, pythonAfgewezen);
  const vakken = Object.entries(perVak);
  if (vakken.length > 0) {
    root.appendChild(kopSectie("Wat deze dag kost"));
    const lijst = document.createElement("ul");
    for (const [vak, n] of vakken) {
      const li = document.createElement("li");
      li.textContent = `${vak}: ${meervoud(n, "lesmoment", "lesmomenten")} gemist bij absentie`;
      lijst.appendChild(li);
    }
    root.appendChild(lijst);
  }

  root.appendChild(renderActieknoppen(ymd, acties, formOpenen, formBereik));
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
  // -text, niet -bg: de bg-tinten zijn bedoeld als vlak achter tekst en zijn
  // als 4px streep op een witte kaart onzichtbaar. De streepjes in de
  // maandweergave gebruiken om dezelfde reden -text.
  balkje.style.background = `var(--vak-${course.id.toLowerCase()}-text)`;
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

  // Chinees heeft als onderwerp letterlijk de vaknaam ("General Chinese",
  // waar het vak "General Chinese (國際生華語(一))" heet); die stond dan twee
  // regels boven elkaar.
  if (!course.name.startsWith(les.label)) {
    const onderwerp = document.createElement("p");
    onderwerp.className = "lesblok-onderwerp";
    onderwerp.textContent = les.label;
    inhoud.appendChild(onderwerp);
  }

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

  inhoud.appendChild(naarVakKnop(course.id, onNaarVak));

  li.appendChild(inhoud);
  return li;
}

/**
 * Knop om een vast item weg te zetten als niet van toepassing. Vraagt om
 * bevestiging in de knop zelf, net als de verwijderknop bij eigen items,
 * zodat één misplaatste tik niets laat verdwijnen.
 * @param {string} sleutel
 * @param {(sleutel: string) => void} onVerbergen
 * @returns {HTMLButtonElement}
 */
export function verbergKnop(sleutel, onVerbergen) {
  return bevestigKnop({ label: "Verbergen", className: "verberg-knop", onBevestigd: () => onVerbergen(sleutel) });
}

/**
 * @param {string} vakId
 * @param {(vakId: string) => void} onNaarVak
 * @returns {HTMLButtonElement}
 */
function naarVakKnop(vakId, onNaarVak) {
  const knop = document.createElement("button");
  knop.type = "button";
  knop.className = "lesblok-naar-vak";
  knop.textContent = "Naar vak";
  knop.addEventListener("click", () => onNaarVak(vakId));
  return knop;
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
 * tussenliggende dag is, de status, en elke vlucht die op deze dag valt.
 * Eigen reizen (bron "eigen invoer") krijgen een klein onderscheid; een reis
 * met onbekendeVelden (bijv. Filipijnen — overnachtingen) krijgt invulbare
 * velden, geen gok.
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

  // Meerdere vluchten op één dag komen echt voor (Filipijnen-heenreis:
  // TPE → MNL → DVO op 2026-09-25), dus alle vluchten van deze reis tonen.
  for (const vlucht of vluchtenVandaag.filter((v) => v.variant === reis.variant)) {
    const vluchtRegel = document.createElement("div");
    vluchtRegel.className = "dagblad-klein";
    vluchtRegel.textContent = vlucht.label;
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
  const bereik = item.start === item.end ? "" : ` (${kortDatum(item.start)} → ${kortDatum(item.end)})`;
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

function renderActieknoppen(ymd, acties, formOpenen, formBereik) {
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
      // Kom je via "Inplannen" bij een vrij venster, dan staat het hele venster
      // er al in — anders begin je met één dag en typ je de rest opnieuw.
      formBereik ?? { start: ymd, end: ymd }
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
