/**
 * Het paneel "Openstaande vragen" onder Instellingen: alle punten uit
 * src/data/openstaandeVragen.js bij elkaar, met een invoerveld per punt.
 *
 * De antwoorden gaan naar dezelfde opslag als de losse invulvelden elders
 * (state.vakkenVeldwaarden), met de sleutel uit het data-item. Een antwoord
 * dat hier wordt ingevuld, verschijnt dus ook op het vakkenscherm of in het
 * dagblad waar dat veld al bestond — en omgekeerd.
 *
 * Het paneel wordt één keer opgebouwd en daarna alleen bijgewerkt. Opnieuw
 * opbouwen bij elke wijziging zou de invoervelden vervangen, en dat is precies
 * wat je niet wilt in een lijst van zestien velden die je achter elkaar
 * invult: na elke Tab zou het veld waar je net in beland bent verdwijnen.
 */

import { openstaandeVragen, vragenPerGroep, vragenStand } from "../data/openstaandeVragen.js";

/**
 * @param {HTMLElement} root
 * @param {Record<string, string>} veldwaarden state.vakkenVeldwaarden
 * @param {(sleutel: string, waarde: string) => void} onVeldWijzigen
 */
export function renderOpenstaandeVragen(root, veldwaarden, onVeldWijzigen) {
  if (root.dataset.gebouwd !== "ja") bouwPaneel(root, onVeldWijzigen);
  werkBij(root, veldwaarden);
}

function bouwPaneel(root, onVeldWijzigen) {
  root.textContent = "";

  const stand = document.createElement("p");
  stand.className = "vragen-stand";
  root.appendChild(stand);

  for (const groep of vragenPerGroep()) {
    const blok = document.createElement("div");
    blok.className = "vragen-groep";

    const kop = document.createElement("h4");
    kop.textContent = groep.kop;
    blok.appendChild(kop);

    for (const vraag of groep.vragen) blok.appendChild(bouwVraag(vraag, onVeldWijzigen));
    root.appendChild(blok);
  }
  root.dataset.gebouwd = "ja";
}

function bouwVraag(vraag, onVeldWijzigen) {
  const wrap = document.createElement("div");
  wrap.className = "vraag-rij";
  wrap.dataset.vraag = vraag.id;

  const label = document.createElement("label");

  const tekst = document.createElement("span");
  tekst.className = "vraag-tekst";
  tekst.textContent = vraag.vraag;
  label.appendChild(tekst);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "ONBEKEND";
  input.addEventListener("change", () => onVeldWijzigen(vraag.id, input.value));
  label.appendChild(input);

  wrap.appendChild(label);

  const toelichting = document.createElement("p");
  toelichting.className = "vraag-toelichting";
  toelichting.textContent = `${vraag.toelichting} (${vraag.verwijzing})`;
  wrap.appendChild(toelichting);

  return wrap;
}

function werkBij(root, veldwaarden) {
  for (const vraag of openstaandeVragen) {
    const rij = root.querySelector(`[data-vraag="${vraag.id}"]`);
    const input = rij.querySelector("input");
    const waarde = veldwaarden[vraag.id] ?? "";
    // Niet overschrijven terwijl er in getypt wordt: de wijziging komt pas bij
    // het verlaten van het veld binnen.
    if (document.activeElement !== input) input.value = waarde;
    rij.classList.toggle("vraag-beantwoord", waarde.trim() !== "");
  }

  const { beantwoord, totaal } = vragenStand(veldwaarden);
  root.querySelector(".vragen-stand").textContent =
    `${beantwoord} van de ${totaal} beantwoord — de rest blijft ONBEKEND in de app.`;
}
