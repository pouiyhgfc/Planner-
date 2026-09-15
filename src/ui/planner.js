/**
 * Interactieve laag van fase 4/5: eigen item toevoegen, persist-status,
 * export/import. Vanaf fase 8B gemonteerd in het instellingenpaneel
 * (zie src/ui/main.js) — de inhoud zelf is ongewijzigd.
 */

import { costOfRange } from "../lib/blocks.js";
import { diffDays } from "../lib/date.js";
import { kortDatum } from "./datumlabels.js";
import { huidigeYMD } from "../state/store.js";
import { trips, effectieveTripStatus, TRIP_STATUSSEN } from "../data/trips.js";

const EXPORT_WAARSCHUWING_DAGEN = 14;

/** Leesbare labels voor de opgeslagen statuswaarden uit trips.js. */
const TRIP_STATUS_LABELS = {
  geboekt: "geboekt",
  "wijziging-aangevraagd": "wijziging aangevraagd",
  vervallen: "vervallen",
};

/**
 * @param {HTMLElement} root
 * @param {(veld: {naam: string, start: string, end: string, status: string, notitie: string}) => void} onToevoegen
 * @param {{start?: string, end?: string}} [voorinvulling] datumbereik dat al is ingevuld (bijv. vanuit het dagblad)
 */
export function renderPlannerForm(root, onToevoegen, voorinvulling) {
  root.textContent = "";
  root.className = "planner-form";

  const naam = invoerveld("text", { verplicht: true });
  const start = invoerveld("date");
  const eind = invoerveld("date");
  if (voorinvulling?.start) start.value = voorinvulling.start;
  if (voorinvulling?.end) eind.value = voorinvulling.end;
  const status = keuzeveld(["idee", "vast"]);
  const notitie = invoerveld("text");

  const waarschuwing = document.createElement("div");
  waarschuwing.className = "kosten-waarschuwing";
  waarschuwing.hidden = true;

  function toonWaarschuwing() {
    if (!start.value || !eind.value || start.value > eind.value) {
      waarschuwing.hidden = true;
      return;
    }
    const { perVak } = costOfRange(start.value, eind.value);
    const regels = Object.entries(perVak).map(([vak, n]) => `${vak}: ${n}x`);
    if (regels.length === 0) {
      waarschuwing.hidden = true;
      return;
    }
    waarschuwing.hidden = false;
    waarschuwing.textContent = `Let op — dit valt samen met lessen: ${regels.join(", ")}`;
  }
  start.addEventListener("change", toonWaarschuwing);
  eind.addEventListener("change", toonWaarschuwing);

  const knop = document.createElement("button");
  knop.type = "submit";
  knop.textContent = "Toevoegen";

  const form = document.createElement("form");
  form.appendChild(metLabel("Naam", naam));
  form.appendChild(metLabel("Van", start));
  form.appendChild(metLabel("Tot", eind));
  form.appendChild(metLabel("Status", status));
  form.appendChild(metLabel("Notitie", notitie));
  form.appendChild(waarschuwing);
  form.appendChild(knop);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!naam.value || !start.value || !eind.value) return;
    onToevoegen({
      naam: naam.value,
      start: start.value,
      end: eind.value,
      status: status.value,
      notitie: notitie.value,
    });
    form.reset();
    waarschuwing.hidden = true;
  });

  root.appendChild(form);
}

/**
 * @param {string} type
 * @param {{verplicht?: boolean, placeholder?: string}} [opties]
 * @returns {HTMLInputElement}
 */
function invoerveld(type, opties = {}) {
  const input = document.createElement("input");
  input.type = type;
  if (opties.placeholder) input.placeholder = opties.placeholder;
  if (opties.verplicht) input.required = true;
  return input;
}

/**
 * Zet een zichtbaar label vóór een veld. Nodig omdat een placeholder op
 * <input type="date"> niet getoond wordt: die velden stonden daardoor
 * naamloos in het formulier en begin- en einddatum waren niet uit elkaar
 * te houden.
 * @param {string} tekst
 * @param {HTMLElement} veld
 * @returns {HTMLLabelElement}
 */
function metLabel(tekst, veld) {
  const label = document.createElement("label");
  label.className = "veld-rij";
  const naam = document.createElement("span");
  naam.className = "veld-label";
  naam.textContent = tekst;
  label.appendChild(naam);
  label.appendChild(veld);
  return label;
}

/**
 * @param {string[]} waarden
 * @param {Record<string, string>} [labels] leesbaar label per opgeslagen waarde
 * @returns {HTMLSelectElement}
 */
function keuzeveld(waarden, labels = {}) {
  const select = document.createElement("select");
  for (const waarde of waarden) {
    const optie = document.createElement("option");
    optie.value = waarde;
    optie.textContent = labels[waarde] ?? waarde;
    select.appendChild(optie);
  }
  return select;
}

const THEMA_OPTIES = [
  { waarde: "systeem", label: "Systeem" },
  { waarde: "licht", label: "Licht" },
  { waarde: "donker", label: "Donker" },
];

/**
 * @param {HTMLElement} root
 * @param {string} huidigeWaarde
 * @param {(waarde: string) => void} onWijzigen
 */
export function renderThemaRegel(root, huidigeWaarde, onWijzigen) {
  root.className = "thema-regel";
  root.textContent = "";

  const label = document.createElement("span");
  label.textContent = "Thema: ";
  root.appendChild(label);

  const select = document.createElement("select");
  for (const optie of THEMA_OPTIES) {
    const el = document.createElement("option");
    el.value = optie.waarde;
    el.textContent = optie.label;
    select.appendChild(el);
  }
  select.value = huidigeWaarde;
  select.addEventListener("change", () => onWijzigen(select.value));
  root.appendChild(select);
}

/**
 * @param {HTMLElement} root
 * @param {boolean|null} toegekend
 */
export function renderPersistRegel(root, toegekend) {
  root.className = "persist-regel";
  if (toegekend === null) {
    root.textContent = "Opslag: navigator.storage.persist() niet beschikbaar in deze browser.";
  } else if (toegekend) {
    root.textContent = "Opslag: persistente opslag toegekend.";
  } else {
    root.textContent = "Opslag: persistente opslag geweigerd door de browser — exporteer regelmatig.";
  }
}

/**
 * @param {HTMLElement} root
 * @param {string|null} laatsteExport
 * @param {() => void} onExporteren
 */
export function renderExportRegel(root, laatsteExport, onExporteren) {
  root.className = "export-regel";
  root.textContent = "";

  const tekst = document.createElement("span");
  if (!laatsteExport) {
    tekst.textContent = "Nog nooit geëxporteerd — dit is de enige echte back-up.";
    tekst.classList.add("export-waarschuwing");
  } else {
    const dagenGeleden = diffDays(laatsteExport, huidigeYMD());
    tekst.textContent = `Laatste export: ${kortDatum(laatsteExport)} (${dagenGeleden} dagen geleden)`;
    if (dagenGeleden > EXPORT_WAARSCHUWING_DAGEN) tekst.classList.add("export-waarschuwing");
  }
  root.appendChild(tekst);

  const knop = document.createElement("button");
  knop.type = "button";
  knop.textContent = "Exporteer";
  knop.addEventListener("click", onExporteren);
  root.appendChild(knop);

  // Het kale bestandsveld toont een niet-vertaalbare "Choose file / no file
  // chosen" en zegt niet wat het doet; een label eromheen geeft het een
  // Nederlandse naam en hetzelfde uiterlijk als de andere knoppen.
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json";
  importInput.className = "visueel-verborgen";
  importInput.addEventListener("change", () => {
    if (importInput.files.length > 0) root.dispatchEvent(new CustomEvent("import-bestand", { detail: importInput.files[0] }));
    importInput.value = "";
  });

  const importKnop = document.createElement("label");
  importKnop.className = "tap-target knop-als-label";
  importKnop.textContent = "Importeren";
  importKnop.appendChild(importInput);
  root.appendChild(importKnop);
}

/**
 * @param {HTMLElement} root
 * @param {{huidig: object, geimporteerd: object}[]} conflicten
 * @param {(keuzes: Record<string, "huidig"|"geimporteerd">) => void} onOplossen
 */
export function renderConflictenPaneel(root, conflicten, onOplossen) {
  root.className = "conflicten-paneel";
  root.textContent = "";

  if (conflicten.length === 0) {
    root.hidden = true;
    return;
  }
  root.hidden = false;

  const kop = document.createElement("div");
  kop.textContent = `${conflicten.length} conflict(en) bij import — kies per item welke versie moet blijven:`;
  root.appendChild(kop);

  const keuzes = {};
  for (const conflict of conflicten) {
    keuzes[conflict.huidig.id] = (conflict.huidig.bijgewerkt ?? "") >= (conflict.geimporteerd.bijgewerkt ?? "") ? "huidig" : "geimporteerd";

    const rij = document.createElement("div");
    rij.className = "conflict-rij";

    const naam = document.createElement("span");
    naam.textContent = conflict.huidig.naam;
    rij.appendChild(naam);

    const select = document.createElement("select");
    const optieHuidig = document.createElement("option");
    optieHuidig.value = "huidig";
    optieHuidig.textContent = `huidig (${conflict.huidig.bijgewerkt ?? "onbekend"}, ${conflict.huidig.start}→${conflict.huidig.end}, ${conflict.huidig.status})`;
    const optieNieuw = document.createElement("option");
    optieNieuw.value = "geimporteerd";
    optieNieuw.textContent = `geïmporteerd (${conflict.geimporteerd.bijgewerkt ?? "onbekend"}, ${conflict.geimporteerd.start}→${conflict.geimporteerd.end}, ${conflict.geimporteerd.status})`;
    select.appendChild(optieHuidig);
    select.appendChild(optieNieuw);
    select.value = keuzes[conflict.huidig.id];
    select.addEventListener("change", () => {
      keuzes[conflict.huidig.id] = select.value;
    });
    rij.appendChild(select);

    root.appendChild(rij);
  }

  const knop = document.createElement("button");
  knop.type = "button";
  knop.textContent = "Conflicten toepassen";
  knop.addEventListener("click", () => onOplossen(keuzes));
  root.appendChild(knop);
}

/**
 * Eén rij per reisvariant (FASE-9.md A2) met zijn effectieve status en, als
 * die niet al "geboekt" is, een knop om hem dat te maken — zet je die, dan
 * gaat elke andere variant binnen dezelfde reis die nu "geboekt" is
 * automatisch naar "vervallen" (state/store.js:zetTripStatus).
 * @param {HTMLElement} root
 * @param {Record<string, string>} tripStatusOverrides
 * @param {(variant: string, nieuweStatus: string) => void} onWijzigen
 */
export function renderReisstatusPaneel(root, tripStatusOverrides, onWijzigen) {
  root.className = "reisstatus-paneel";
  root.textContent = "";

  for (const item of trips.filter((t) => t.type === "vaste-boeking")) {
    const status = effectieveTripStatus(item, tripStatusOverrides);

    const rij = document.createElement("div");
    rij.className = "reisstatus-rij";

    const tekst = document.createElement("span");
    tekst.textContent = `${item.label} (${kortDatum(item.start)} → ${kortDatum(item.end)}) — ${TRIP_STATUS_LABELS[status] ?? status}`;
    rij.appendChild(tekst);

    if (status !== "geboekt") {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.textContent = "Zet op geboekt";
      knop.addEventListener("click", () => onWijzigen(item.variant, "geboekt"));
      rij.appendChild(knop);
    }

    root.appendChild(rij);
  }
}

/**
 * FASE-9.md B1 punt 5: eigen reis toevoegen — naam, begin/eind, status en
 * optioneel losse vluchten (datum + tijd + label). Landt in state.eigenReizen,
 * niet in src/data/ (src/data/trips.js:eigenReisItems() maakt hem daarna
 * visueel identiek aan een reis uit trips.js).
 * @param {HTMLElement} root
 * @param {(veld: {naam: string, start: string, end: string, status: string, vluchten: {datum: string, tijd: string|null, label: string}[]}) => void} onToevoegen
 */
export function renderReisForm(root, onToevoegen) {
  root.textContent = "";
  root.className = "reis-form";

  const naam = invoerveld("text", { verplicht: true });
  const start = invoerveld("date");
  const eind = invoerveld("date");
  const status = keuzeveld(TRIP_STATUSSEN, TRIP_STATUS_LABELS);

  const vluchtenWrap = document.createElement("div");
  vluchtenWrap.className = "reis-vluchten";
  const vluchtRijen = [];

  function voegVluchtRijToe() {
    const rij = document.createElement("div");
    rij.className = "reis-vlucht-rij";
    const datum = document.createElement("input");
    datum.type = "date";
    const tijd = document.createElement("input");
    tijd.type = "time";
    const label = invoerveld("text", { placeholder: "Label" });
    const verwijder = document.createElement("button");
    verwijder.type = "button";
    verwijder.textContent = "×";
    verwijder.setAttribute("aria-label", "Verwijder deze vlucht");
    rij.appendChild(datum);
    rij.appendChild(tijd);
    rij.appendChild(label);
    rij.appendChild(verwijder);
    vluchtenWrap.appendChild(rij);
    const rijData = { datum, tijd, label };
    vluchtRijen.push(rijData);
    verwijder.addEventListener("click", () => {
      rij.remove();
      vluchtRijen.splice(vluchtRijen.indexOf(rijData), 1);
    });
  }

  const vluchtToevoegKnop = document.createElement("button");
  vluchtToevoegKnop.type = "button";
  vluchtToevoegKnop.textContent = "Losse vlucht toevoegen";
  vluchtToevoegKnop.addEventListener("click", voegVluchtRijToe);

  const knop = document.createElement("button");
  knop.type = "submit";
  knop.textContent = "Reis toevoegen";

  const form = document.createElement("form");
  form.appendChild(metLabel("Naam", naam));
  form.appendChild(metLabel("Van", start));
  form.appendChild(metLabel("Tot", eind));
  form.appendChild(metLabel("Status", status));
  form.appendChild(vluchtenWrap);
  form.appendChild(vluchtToevoegKnop);
  form.appendChild(knop);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!naam.value || !start.value || !eind.value) return;
    const vluchten = vluchtRijen
      .filter((r) => r.datum.value)
      .map((r) => ({ datum: r.datum.value, tijd: r.tijd.value || null, label: r.label.value || "" }));
    onToevoegen({ naam: naam.value, start: start.value, end: eind.value, status: status.value, vluchten });
    form.reset();
    vluchtenWrap.textContent = "";
    vluchtRijen.length = 0;
  });

  root.appendChild(form);
}

/**
 * @param {HTMLElement} root
 * @param {object[]} reizen
 * @param {(id: string) => void} onVerwijderen
 */
export function renderEigenReizenLijst(root, reizen, onVerwijderen) {
  renderVerwijderbareLijst(root, reizen, onVerwijderen, "Nog geen eigen reizen.", (reis) => {
    const vluchten = reis.vluchten?.length > 0 ? ` — ${reis.vluchten.length} vlucht(en)` : "";
    return `${kortDatum(reis.start)} → ${kortDatum(reis.end)} — ${reis.naam} (${TRIP_STATUS_LABELS[reis.status] ?? reis.status})${vluchten}`;
  });
}

/**
 * @param {HTMLElement} root
 * @param {object[]} items
 * @param {(id: string) => void} onVerwijderen
 */
export function renderEigenItemsLijst(root, items, onVerwijderen) {
  renderVerwijderbareLijst(root, items, onVerwijderen, "Nog geen eigen items.", (item) => {
    const bereik = item.start === item.end ? kortDatum(item.start) : `${kortDatum(item.start)} → ${kortDatum(item.end)}`;
    return `${bereik} — ${item.naam} (${item.status})`;
  });
}

/**
 * Eigen reizen en eigen items zijn dezelfde lijst met een andere regeltekst:
 * op datum gesorteerd, per rij een kruisje om te verwijderen, en een zin als
 * er nog niets is.
 * @param {HTMLElement} root
 * @param {{id: string, naam: string, start: string}[]} rijen
 * @param {(id: string) => void} onVerwijderen
 * @param {string} legeTekst
 * @param {(rij: object) => string} regelTekst
 */
function renderVerwijderbareLijst(root, rijen, onVerwijderen, legeTekst, regelTekst) {
  root.className = "eigen-items-lijst";
  root.textContent = "";

  if (rijen.length === 0) {
    const leeg = document.createElement("p");
    leeg.className = "eigen-items-leeg";
    leeg.textContent = legeTekst;
    root.appendChild(leeg);
    return;
  }

  const lijst = document.createElement("ul");
  for (const rij of [...rijen].sort((a, b) => a.start.localeCompare(b.start))) {
    const li = document.createElement("li");
    li.className = "eigen-item-rij";

    const tekst = document.createElement("span");
    tekst.textContent = regelTekst(rij);
    li.appendChild(tekst);

    const verwijder = document.createElement("button");
    verwijder.type = "button";
    verwijder.textContent = "×";
    verwijder.setAttribute("aria-label", `Verwijder "${rij.naam}"`);
    verwijder.addEventListener("click", () => onVerwijderen(rij.id));
    li.appendChild(verwijder);

    lijst.appendChild(li);
  }
  root.appendChild(lijst);
}
