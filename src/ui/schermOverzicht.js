/**
 * Scherm "Overzicht" — fase 8E. Vier telkaarten, een projectensectie en één
 * chronologische lijst met schakelbare filterchips.
 */

import { resterendeBlokken, chinaAftelling } from "../lib/overzicht.js";
import { deadlineSleutel } from "./dagblad.js";
import { kortDatum } from "./datumlabels.js";
import { projects } from "../data/projects.js";
import { courses, courseVoor } from "../data/courses.js";
import { vakAfkorting, vakKleuren } from "./tekst.js";
import {
  volgendeTentamenOfPresentatie,
  aantalOpenstaandeDeadlines,
  mijlpaalSleutel,
  rijenSchooldagen,
  rijenTentamens,
  rijenDeadlines,
  rijenProjecten,
  rijenFeestdagen,
  rijenEigenItems,
  rijenVrijeBlokken,
  rijenReizen,
  rijenOpleveringen,
} from "./overzichtData.js";

const FILTERS = [
  { id: "schooldagen", label: "Schooldagen" },
  { id: "tentamens", label: "Tentamens" },
  { id: "deadlines", label: "Deadlines" },
  { id: "projecten", label: "Projecten" },
  { id: "reizen", label: "Reizen" },
  { id: "presentaties", label: "Presentaties" },
  { id: "verslagen", label: "Verslagen" },
  { id: "feestdagen", label: "Feestdagen" },
  { id: "eigenItems", label: "Eigen items" },
  { id: "vrijeBlokken", label: "Vrije blokken" },
];
const STANDAARD_AAN = ["tentamens", "deadlines", "vrijeBlokken", "reizen"];
const WEERGAVEN = [
  { id: "datum", label: "Op datum" },
  { id: "vak", label: "Per vak" },
];

/**
 * @param {HTMLElement} root
 * @param {{
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onMijlpaalToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onProjectToevoegen: (veld: object) => void,
 *   onProjectVerwijderen: (id: string) => void,
 *   onOpleveringToggle: (id: string, afgevinkt: boolean) => void,
 * }} callbacks
 * @returns {{render: (ctx: object) => void}}
 */
export function initOverzichtScherm(root, callbacks) {
  const telkaartenEl = document.createElement("div");
  telkaartenEl.className = "telkaarten";
  const filtersEl = document.createElement("div");
  const lijstEl = document.createElement("div");
  const projectenEl = document.createElement("div");
  // De chronologische lijst is waar dit scherm voor is; de projectkaarten en
  // het invoerformulier stonden ervóór, waardoor je er eerst langs moest
  // scrollen.
  root.appendChild(telkaartenEl);
  root.appendChild(filtersEl);
  root.appendChild(lijstEl);
  root.appendChild(projectenEl);

  let actieveFilters = new Set(STANDAARD_AAN);
  let weergave = "datum";
  let laatsteCtx = null;

  function zetFilters(nieuw) {
    actieveFilters = nieuw;
    tekenenFiltersEnLijst();
  }

  function zetWeergave(nieuw) {
    weergave = nieuw;
    tekenenFiltersEnLijst();
  }

  function telkaart(getal, tekst, onKlik) {
    const kaart = document.createElement("button");
    kaart.type = "button";
    kaart.className = "tap-target telkaart";
    const getalEl = document.createElement("span");
    getalEl.className = "telkaart-getal";
    getalEl.textContent = getal;
    const tekstEl = document.createElement("span");
    tekstEl.className = "telkaart-tekst";
    tekstEl.textContent = tekst;
    kaart.appendChild(getalEl);
    kaart.appendChild(tekstEl);
    kaart.addEventListener("click", onKlik);
    return kaart;
  }

  function tekenenTelkaarten() {
    const { vandaag, afgevinkteDeadlines, pythonAfgewezen, tripStatusOverrides = {}, eigenReizen = [], verborgenItems = [] } = laatsteCtx;
    telkaartenEl.textContent = "";

    const volgende = volgendeTentamenOfPresentatie(vandaag, pythonAfgewezen);
    telkaartenEl.appendChild(
      telkaart(
        volgende ? String(volgende.dagenResterend) : "—",
        volgende ? `dagen tot ${volgende.inhoud}` : "geen tentamen of presentatie meer",
        () => zetFilters(new Set(["tentamens", "projecten"]))
      )
    );

    const openstaand = aantalOpenstaandeDeadlines(vandaag, afgevinkteDeadlines, verborgenItems);
    telkaartenEl.appendChild(telkaart(String(openstaand), "openstaande deadlines", () => zetFilters(new Set(["deadlines"]))));

    const blokken = resterendeBlokken(vandaag, pythonAfgewezen, tripStatusOverrides, eigenReizen);
    telkaartenEl.appendChild(
      telkaart(String(blokken.vijfMetEenAbsentie), "vrije blokken van 5 dagen die nog komen", () => zetFilters(new Set(["vrijeBlokken"])))
    );

    const china = chinaAftelling(vandaag);
    telkaartenEl.appendChild(
      telkaart(
        china.dagenResterend >= 0 ? String(china.dagenResterend) : "0",
        `dagen tot: ${china.label} (${china.zekerheid})`,
        () => zetFilters(new Set(["deadlines"]))
      )
    );
  }

  function renderMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen) {
    const sleutel = mijlpaalSleutel(project, mijlpaal);
    const li = document.createElement("li");
    const label = document.createElement("label");
    const vinkje = document.createElement("input");
    vinkje.type = "checkbox";
    vinkje.checked = afgevinkteMijlpalen.includes(sleutel);
    vinkje.addEventListener("change", () => callbacks.onMijlpaalToggle(sleutel, vinkje.checked));
    label.appendChild(vinkje);
    const tekst = document.createElement("span");
    tekst.textContent = ` ${kortDatum(mijlpaal.datum)} — ${mijlpaal.label}`;
    label.appendChild(tekst);
    li.appendChild(label);
    return li;
  }

  function renderProjectKaart(project, afgevinkteMijlpalen, isVast) {
    const kaart = document.createElement("div");
    kaart.className = "card project-kaart";

    const kop = document.createElement("div");
    kop.className = "project-kaart-kop";
    const titel = document.createElement("span");
    titel.textContent = project.vak ? `${project.naam} — ${project.vak}` : project.naam;
    kop.appendChild(titel);
    if (!isVast) {
      const verwijder = document.createElement("button");
      verwijder.type = "button";
      verwijder.textContent = "Verwijderen";
      verwijder.addEventListener("click", () => callbacks.onProjectVerwijderen(project.id));
      kop.appendChild(verwijder);
    }
    kaart.appendChild(kop);

    if (project.tekst) {
      const tekst = document.createElement("p");
      tekst.className = "vak-detail-klein";
      tekst.textContent = project.tekst;
      kaart.appendChild(tekst);
    }

    if (project.waarschuwing) {
      const waarschuwing = document.createElement("p");
      waarschuwing.className = "project-waarschuwing";
      waarschuwing.textContent = project.waarschuwing;
      kaart.appendChild(waarschuwing);
    }

    const lijst = document.createElement("ul");
    for (const mijlpaal of project.mijlpalen) lijst.appendChild(renderMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen));
    kaart.appendChild(lijst);

    return kaart;
  }

  function renderEigenProjectForm() {
    const form = document.createElement("form");
    form.className = "eigen-project-form";

    const naam = document.createElement("input");
    naam.type = "text";
    naam.placeholder = "Projectnaam";

    const vak = document.createElement("input");
    vak.type = "text";
    vak.placeholder = "Vak (optioneel)";

    const mijlpaalDatum = document.createElement("input");
    mijlpaalDatum.type = "date";

    const mijlpaalLabel = document.createElement("input");
    mijlpaalLabel.type = "text";
    mijlpaalLabel.placeholder = "Eerste mijlpaal";

    const knop = document.createElement("button");
    knop.type = "submit";
    knop.textContent = "Eigen project toevoegen";

    form.appendChild(naam);
    form.appendChild(vak);
    form.appendChild(mijlpaalDatum);
    form.appendChild(mijlpaalLabel);
    form.appendChild(knop);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!naam.value || !mijlpaalDatum.value || !mijlpaalLabel.value) return;
      callbacks.onProjectToevoegen({
        naam: naam.value,
        vak: vak.value || null,
        mijlpalen: [{ datum: mijlpaalDatum.value, label: mijlpaalLabel.value }],
      });
      form.reset();
    });

    return form;
  }

  function tekenenProjecten() {
    const { afgevinkteMijlpalen, eigenProjecten } = laatsteCtx;
    projectenEl.textContent = "";

    const kop = document.createElement("h2");
    kop.className = "scherm-kop";
    kop.textContent = "Projecten";
    projectenEl.appendChild(kop);

    for (const project of projects) projectenEl.appendChild(renderProjectKaart(project, afgevinkteMijlpalen, true));
    for (const project of eigenProjecten) projectenEl.appendChild(renderProjectKaart(project, afgevinkteMijlpalen, false));

    // Het invoerformulier stond altijd open, terwijl je zelden een project
    // toevoegt; ingeklapt kost het één regel in plaats van vijf velden.
    const uitklap = document.createElement("details");
    uitklap.className = "uitklap";
    const samenvatting = document.createElement("summary");
    samenvatting.className = "tap-target";
    samenvatting.textContent = "Eigen project toevoegen";
    uitklap.appendChild(samenvatting);
    uitklap.appendChild(renderEigenProjectForm());
    projectenEl.appendChild(uitklap);
  }

  function bouwRijen() {
    const { items, eigenProjecten, pythonAfgewezen, tripStatusOverrides = {}, eigenReizen = [], vakkenVeldwaarden = {}, verborgenItems = [] } = laatsteCtx;
    let rijen = [];
    if (actieveFilters.has("schooldagen")) rijen.push(...rijenSchooldagen(pythonAfgewezen, tripStatusOverrides, eigenReizen).map((r) => ({ ...r, categorie: "schooldagen" })));
    if (actieveFilters.has("tentamens")) rijen.push(...rijenTentamens(pythonAfgewezen).map((r) => ({ ...r, categorie: "tentamens" })));
    if (actieveFilters.has("deadlines")) rijen.push(...rijenDeadlines(verborgenItems).map((r) => ({ ...r, categorie: "deadlines" })));
    if (actieveFilters.has("projecten")) {
      rijen.push(...rijenProjecten().map((r) => ({ ...r, categorie: "projecten" })));
      for (const project of eigenProjecten) {
        for (const mijlpaal of project.mijlpalen) {
          rijen.push({ datum: mijlpaal.datum, inhoud: `${project.naam}: ${mijlpaal.label}`, project, mijlpaal, vak: project.vak ?? null, categorie: "projecten" });
        }
      }
    }
    if (actieveFilters.has("reizen")) rijen.push(...rijenReizen(tripStatusOverrides, eigenReizen).map((r) => ({ ...r, categorie: "reizen" })));
    if (actieveFilters.has("presentaties")) {
      rijen.push(...rijenOpleveringen(vakkenVeldwaarden, verborgenItems).filter((r) => r.oplevering.soort === "presentatie").map((r) => ({ ...r, categorie: "presentaties" })));
    }
    if (actieveFilters.has("verslagen")) {
      rijen.push(...rijenOpleveringen(vakkenVeldwaarden, verborgenItems).filter((r) => r.oplevering.soort === "verslag").map((r) => ({ ...r, categorie: "verslagen" })));
    }
    if (actieveFilters.has("feestdagen")) rijen.push(...rijenFeestdagen().map((r) => ({ ...r, categorie: "feestdagen" })));
    if (actieveFilters.has("eigenItems")) rijen.push(...rijenEigenItems(items).map((r) => ({ ...r, categorie: "eigenItems" })));
    if (actieveFilters.has("vrijeBlokken")) rijen.push(...rijenVrijeBlokken(pythonAfgewezen, tripStatusOverrides, eigenReizen).map((r) => ({ ...r, categorie: "vrijeBlokken" })));
    rijen.sort((a, b) => a.datum.localeCompare(b.datum));
    return rijen;
  }

  function renderRij(rij, toonVakChip = true) {
    const li = document.createElement("li");
    li.className = "overzicht-rij";

    const datumEl = document.createElement("span");
    datumEl.className = "overzicht-rij-datum";
    datumEl.textContent = kortDatum(rij.datum);
    li.appendChild(datumEl);

    const rechts = document.createElement("span");
    rechts.className = "overzicht-rij-inhoud";

    // Zonder vakmarkering leest de chronologische lijst als één stapel: elke
    // rij weet al bij welk vak hij hoort, maar dat was nergens te zien. In de
    // per-vak-weergave zegt het kopje erboven het al, dan is de chip ruis.
    if (rij.vak && toonVakChip) rechts.appendChild(vakChip(rij.vak));

    if (rij.categorie === "deadlines") {
      const sleutel = deadlineSleutel(rij.deadline);
      const vinkje = document.createElement("input");
      vinkje.type = "checkbox";
      vinkje.checked = laatsteCtx.afgevinkteDeadlines.includes(sleutel);
      vinkje.addEventListener("change", () => callbacks.onDeadlineToggle(sleutel, vinkje.checked));
      rechts.appendChild(vinkje);
    }
    if (rij.categorie === "projecten" && rij.project && rij.mijlpaal) {
      const sleutel = mijlpaalSleutel(rij.project, rij.mijlpaal);
      const vinkje = document.createElement("input");
      vinkje.type = "checkbox";
      vinkje.checked = laatsteCtx.afgevinkteMijlpalen.includes(sleutel);
      vinkje.addEventListener("change", () => callbacks.onMijlpaalToggle(sleutel, vinkje.checked));
      rechts.appendChild(vinkje);
    }
    if ((rij.categorie === "presentaties" || rij.categorie === "verslagen") && rij.oplevering) {
      const vinkje = document.createElement("input");
      vinkje.type = "checkbox";
      vinkje.checked = laatsteCtx.afgevinkteOpleveringen.includes(rij.oplevering.id);
      vinkje.addEventListener("change", () => callbacks.onOpleveringToggle(rij.oplevering.id, vinkje.checked));
      rechts.appendChild(vinkje);
    }

    const tekst = document.createElement("span");
    tekst.textContent = rij.inhoud;
    rechts.appendChild(tekst);
    li.appendChild(rechts);

    return li;
  }

  /**
   * @param {string} vakId
   * @returns {HTMLElement} klein gekleurd label met de vakafkorting
   */
  function vakChip(vakId) {
    const { achtergrond, tekst } = vakKleuren(vakId);
    const chip = document.createElement("span");
    chip.className = "vak-chip";
    chip.style.background = achtergrond;
    chip.style.color = tekst;
    chip.textContent = vakAfkorting(vakId);
    return chip;
  }

  function renderWeergaveToggle() {
    const rij = document.createElement("div");
    rij.className = "overzicht-weergave-toggle";
    for (const w of WEERGAVEN) {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "tap-target weergave-knop";
      knop.textContent = w.label;
      knop.setAttribute("aria-current", weergave === w.id ? "true" : "false");
      knop.addEventListener("click", () => zetWeergave(w.id));
      rij.appendChild(knop);
    }
    return rij;
  }

  /**
   * FASE-9.md B3: "per vak" groepeert dezelfde gefilterde, op datum
   * gesorteerde rijen als de normale lijst — alleen ingedeeld per vak
   * (volgorde uit courses.js) in plaats van chronologisch door elkaar.
   * Rijen zonder vak (reizen, feestdagen, vrije blokken, eigen items,
   * schooldagen met meerdere vakken) komen in een "Overig"-groep, altijd
   * laatst.
   * @param {object[]} rijen
   * @returns {HTMLElement}
   */
  function renderRijenPerVak(rijen) {
    const groepen = new Map();
    for (const rij of rijen) {
      const sleutel = rij.vak ?? "__overig__";
      if (!groepen.has(sleutel)) groepen.set(sleutel, []);
      groepen.get(sleutel).push(rij);
    }
    const volgorde = [...courses.map((c) => c.id), "__overig__"];
    const container = document.createElement("div");
    for (const vakId of volgorde) {
      const groep = groepen.get(vakId);
      if (!groep || groep.length === 0) continue;
      // FASE-9.md B3 punt 3 vroeg kopjes in vakkleur; die waren tot nu toe
      // zwart-wit, waardoor de groepen visueel niet uit elkaar liepen.
      const kop = document.createElement("h3");
      kop.className = "overzicht-vak-kop";
      kop.textContent = vakId === "__overig__" ? "Overig" : courseVoor(vakId).name;
      if (vakId !== "__overig__") kop.style.color = vakKleuren(vakId).tekst;
      container.appendChild(kop);
      const lijst = document.createElement("ul");
      lijst.className = "overzicht-lijst";
      for (const rij of groep) lijst.appendChild(renderRij(rij, false));
      container.appendChild(lijst);
    }
    return container;
  }

  function tekenenFiltersEnLijst() {
    filtersEl.textContent = "";
    filtersEl.className = "overzicht-filters";
    filtersEl.appendChild(renderWeergaveToggle());
    for (const filter of FILTERS) {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "tap-target filter-chip";
      knop.textContent = filter.label;
      knop.setAttribute("aria-current", actieveFilters.has(filter.id) ? "true" : "false");
      knop.addEventListener("click", () => {
        const nieuw = new Set(actieveFilters);
        if (nieuw.has(filter.id)) nieuw.delete(filter.id);
        else nieuw.add(filter.id);
        zetFilters(nieuw);
      });
      filtersEl.appendChild(knop);
    }

    lijstEl.textContent = "";
    const rijen = bouwRijen();
    if (rijen.length === 0) {
      const leeg = document.createElement("p");
      leeg.className = "overzicht-leeg";
      leeg.textContent = "Geen items voor deze filterkeuze.";
      lijstEl.appendChild(leeg);
      return;
    }
    if (weergave === "vak") {
      lijstEl.appendChild(renderRijenPerVak(rijen));
      return;
    }
    const lijst = document.createElement("ul");
    lijst.className = "overzicht-lijst";
    for (const rij of rijen) lijst.appendChild(renderRij(rij));
    lijstEl.appendChild(lijst);
  }

  function render(ctx) {
    laatsteCtx = ctx;
    tekenenTelkaarten();
    tekenenProjecten();
    tekenenFiltersEnLijst();
  }

  return { render };
}
