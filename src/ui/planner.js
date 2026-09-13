/**
 * Interactieve laag van fase 4: item toevoegen, persist-status tonen.
 * Alleen dit bestand en render.js raken de DOM aan.
 */

import { costOfRange } from "../lib/blocks.js";

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
    root.textContent = "Opslag: persistente opslag geweigerd door de browser — export je data regelmatig (fase 5).";
  }
}
