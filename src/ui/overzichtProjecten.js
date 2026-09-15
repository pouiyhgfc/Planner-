/**
 * De projectensectie van het scherm Overzicht: de vaste projecten uit
 * src/data/projects.js, de eigen projecten uit de state, en het formulier om
 * er een toe te voegen. Stond als 120 regels binnen initOverzichtScherm(),
 * waar het niets van de rest van dat scherm nodig had.
 */

import { projects } from "../data/projects.js";
import { mijlpaalSleutel } from "./overzichtData.js";
import { kortDatum } from "./datumlabels.js";
import { maakKnop } from "./knoppen.js";

function renderMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen, callbacks) {
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

function renderProjectKaart(project, afgevinkteMijlpalen, isVast, callbacks) {
  const kaart = document.createElement("div");
  kaart.className = "card project-kaart";

  const kop = document.createElement("div");
  kop.className = "project-kaart-kop";
  const titel = document.createElement("span");
  titel.textContent = project.vak ? `${project.naam} — ${project.vak}` : project.naam;
  kop.appendChild(titel);
  if (!isVast) {
    const verwijder = maakKnop({ label: "Verwijderen", onKlik: () => callbacks.onProjectVerwijderen(project.id) });
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
  for (const mijlpaal of project.mijlpalen) lijst.appendChild(renderMijlpaalRij(project, mijlpaal, afgevinkteMijlpalen, callbacks));
  kaart.appendChild(lijst);

  return kaart;
}

function renderEigenProjectForm(callbacks) {
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

export function renderProjecten(root, ctx, callbacks) {
  const { afgevinkteMijlpalen, eigenProjecten } = ctx;
  root.textContent = "";

  const kop = document.createElement("h2");
  kop.className = "scherm-kop";
  kop.textContent = "Projecten";
  root.appendChild(kop);

  for (const project of projects) root.appendChild(renderProjectKaart(project, afgevinkteMijlpalen, true, callbacks));
  for (const project of eigenProjecten) root.appendChild(renderProjectKaart(project, afgevinkteMijlpalen, false, callbacks));

  // Het invoerformulier stond altijd open, terwijl je zelden een project
  // toevoegt; ingeklapt kost het één regel in plaats van vijf velden.
  const uitklap = document.createElement("details");
  uitklap.className = "uitklap";
  const samenvatting = document.createElement("summary");
  samenvatting.className = "tap-target";
  samenvatting.textContent = "Eigen project toevoegen";
  uitklap.appendChild(samenvatting);
  uitklap.appendChild(renderEigenProjectForm(callbacks));
  root.appendChild(uitklap);
}
