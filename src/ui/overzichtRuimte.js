/**
 * Het blok "Waar is ruimte" op het scherm Overzicht: de aaneengesloten
 * vensters waarin iets past, met hun prijs in lessen, en de keuze hoeveel
 * lesdagen een venster mag kosten.
 */

import { rijenRuimte, RUIMTE_MINIMUM_DAGEN } from "./overzichtData.js";
import { kortDatum } from "./datumlabels.js";
import { vakAfkorting, meervoud } from "./tekst.js";
import { RUIMTE_BUDGETTEN } from "../state/schema.js";

/** Vrijdag 00:00 t/m maandag 18:25 — het venster dat elke week vanzelf ontstaat. */
const STANDAARD_WEEKEND = 3.5;
import { maakKnop } from "./knoppen.js";

export function renderRuimte(root, ctx, callbacks) {
  root.textContent = "";

  const kop = document.createElement("div");
  kop.className = "ruimte-kop";
  const titel = document.createElement("h3");
  titel.textContent = "Waar is ruimte";
  kop.appendChild(titel);

  const keuze = document.createElement("div");
  keuze.className = "ruimte-keuze";
  const keuzeLabel = document.createElement("span");
  keuzeLabel.textContent = "mag kosten:";
  keuze.appendChild(keuzeLabel);
  for (const budget of RUIMTE_BUDGETTEN) {
    const knop = maakKnop({ label: budget === 0 ? "niets" : meervoud(budget, "lesdag", "lesdagen"), className: "tap-target weergave-knop" });
    knop.setAttribute("aria-current", ctx.ruimteBudget === budget ? "true" : "false");
    knop.addEventListener("click", () => callbacks.onRuimteBudgetWijzigen(budget));
    keuze.appendChild(knop);
  }
  kop.appendChild(keuze);
  root.appendChild(kop);

  const vensters = rijenRuimte(
    ctx.ruimteBudget,
    ctx.vandaag,
    ctx.pythonAfgewezen,
    ctx.tripStatusOverrides,
    ctx.eigenReizen
  );

  if (vensters.length === 0) {
    const leeg = document.createElement("p");
    leeg.className = "overzicht-leeg";
    leeg.textContent = `Geen aaneengesloten periode van ${RUIMTE_MINIMUM_DAGEN} dagen of meer die nog komt.`;
    root.appendChild(leeg);
    return;
  }

  const lijst = document.createElement("ul");
  lijst.className = "ruimte-lijst";
  for (const venster of vensters) lijst.appendChild(renderVenster(venster, callbacks));
  root.appendChild(lijst);
}

function renderVenster(venster, callbacks) {
  const li = document.createElement("li");
  li.className = "ruimte-rij";

  // Het standaardvenster is vrijdag t/m maandagavond: 3,5 dagen, elke week
  // hetzelfde. Alles wat langer is, is de uitzondering — en dat is waar de
  // vraag "waar liggen de kansen" over gaat, dus die springt eruit.
  const lengte = document.createElement("span");
  lengte.className = venster.length > STANDAARD_WEEKEND ? "ruimte-lengte ruimte-lengte-ruim" : "ruimte-lengte";
  lengte.textContent = `${venster.length} dg`;
  li.appendChild(lengte);

  const midden = document.createElement("span");
  midden.className = "ruimte-midden";

  const bereik = document.createElement("span");
  bereik.textContent = `${kortDatum(venster.start)} – ${kortDatum(venster.end)}`;
  midden.appendChild(bereik);

  // Alleen een prijs tonen als er een prijs is: "kost geen les" onder elke
  // regel is dertien keer dezelfde mededeling. Geen regel betekent gratis.
  if (venster.gemisteLessen.length > 0) {
    const perVak = {};
    for (const les of venster.gemisteLessen) perVak[les.course] = (perVak[les.course] ?? 0) + 1;
    const prijs = document.createElement("span");
    prijs.className = "ruimte-prijs";
    prijs.textContent = `kost ${Object.entries(perVak)
      .map(([vak, n]) => `${vakAfkorting(vak)} ${n}x`)
      .join(", ")}`;
    midden.appendChild(prijs);
  }

  if (venster.bevatRisicoperiode) {
    const risico = document.createElement("span");
    risico.className = "ruimte-risico";
    risico.textContent = "valt deels in de flexibele week";
    midden.appendChild(risico);
  }
  li.appendChild(midden);

  const knop = maakKnop({ label: "Inplannen", className: "rij-knop", onKlik: () => callbacks.onRuimteKiezen(venster.start, venster.end) });
  li.appendChild(knop);

  return li;
}
