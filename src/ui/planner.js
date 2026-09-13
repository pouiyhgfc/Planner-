/**
 * Interactieve laag van fase 4: item toevoegen, persist-status tonen.
 * Alleen dit bestand en render.js raken de DOM aan.
 */

import { costOfRange } from "../lib/blocks.js";
import { diffDays } from "../lib/date.js";
import { huidigeYMD } from "../state/store.js";

const EXPORT_WAARSCHUWING_DAGEN = 14;

/**
 * @param {HTMLElement} root
 * @param {(veld: {naam: string, start: string, end: string, status: string, notitie: string}) => void} onToevoegen
 */
export function renderPlannerForm(root, onToevoegen) {
  root.textContent = "";
  root.className = "planner-form";

  const naam = veldInput("text", "Naam");
  const start = veldInput("date", "Van");
  const eind = veldInput("date", "Tot");
  const status = document.createElement("select");
  for (const waarde of ["idee", "vast"]) {
    const optie = document.createElement("option");
    optie.value = waarde;
    optie.textContent = waarde;
    status.appendChild(optie);
  }
  const notitie = veldInput("text", "Notitie (optioneel)");

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
  for (const el of [naam, start, eind, status, notitie, knop]) form.appendChild(el);
  form.appendChild(waarschuwing);

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
 * @param {string} placeholder
 */
function veldInput(type, placeholder) {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (type !== "date") input.required = type === "text" && placeholder === "Naam";
  return input;
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
    tekst.textContent = `Laatste export: ${laatsteExport} (${dagenGeleden} dagen geleden)`;
    if (dagenGeleden > EXPORT_WAARSCHUWING_DAGEN) tekst.classList.add("export-waarschuwing");
  }
  root.appendChild(tekst);

  const knop = document.createElement("button");
  knop.type = "button";
  knop.textContent = "Exporteer";
  knop.addEventListener("click", onExporteren);
  root.appendChild(knop);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json";
  importInput.addEventListener("change", () => {
    if (importInput.files.length > 0) root.dispatchEvent(new CustomEvent("import-bestand", { detail: importInput.files[0] }));
    importInput.value = "";
  });
  root.appendChild(importInput);
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
