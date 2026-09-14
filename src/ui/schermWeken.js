/**
 * Orkestratie van het scherm "Weken" (fase 8D): periodekiezer, vorige/
 * volgende-navigatie en de weekstrips. De periodekeuze en het vensterbegin
 * staan in de state (schema.js v5) en overleven een herlaad.
 */

import { addDays } from "../lib/date.js";
import { appPeriod } from "../data/semester.js";
import { PERIODES } from "../state/schema.js";
import { maandagVan, weekStarts, verschuifVenster, PERIODE_LABELS, renderWeekstrips } from "./wekenGrid.js";
import { renderPlannerForm } from "./planner.js";

/**
 * @param {HTMLElement} root
 * @param {{onWeekWeergaveWijzigen: (w: object) => void, onOpenWeek: (ymd: string) => void, onItemToevoegen: (veld: object) => void}} callbacks
 * @returns {{render: (ctx: {weekWeergave: object, vandaag: string, pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>}) => void}}
 */
export function initWekenScherm(root, callbacks) {
  const koppenEl = document.createElement("div");
  // Stabiele wrapper: renderPlannerForm zet zelf root.className = "planner-form"
  // op wat je 'm geeft, dus de "weken-invoeg"-klasse hoort op een omhullend
  // element te staan, niet op het element dat aan renderPlannerForm wordt
  // doorgegeven (anders verdwijnt de klasse zodra het formulier opent).
  const invoegWrapEl = document.createElement("div");
  invoegWrapEl.className = "weken-invoeg";
  const invoegEl = document.createElement("div");
  invoegWrapEl.appendChild(invoegEl);
  const stripsEl = document.createElement("div");
  root.appendChild(koppenEl);
  root.appendChild(invoegWrapEl);
  root.appendChild(stripsEl);

  let laatsteCtx = null;

  function huidigeWeergave() {
    const w = laatsteCtx.weekWeergave;
    return { ...w, startWeek: w.startWeek ?? maandagVan(laatsteCtx.vandaag) };
  }

  function wijzig(patch) {
    callbacks.onWeekWeergaveWijzigen({ ...huidigeWeergave(), ...patch });
  }

  function tekenen() {
    if (!laatsteCtx) return;
    const w = huidigeWeergave();
    koppenEl.textContent = "";
    koppenEl.appendChild(renderPeriodekiezer(w));
    koppenEl.appendChild(renderNavigatie(w));

    invoegEl.textContent = "";

    const starts = weekStarts(w.startWeek, w.periode, w.eigenStart, w.eigenEind);
    renderWeekstrips(
      stripsEl,
      { startWeeks: starts, pythonAfgewezen: laatsteCtx.pythonAfgewezen, tripStatusOverrides: laatsteCtx.tripStatusOverrides, eigenReizen: laatsteCtx.eigenReizen },
      callbacks.onOpenWeek,
      (weekMaandag) => {
        invoegEl.textContent = "";
        renderPlannerForm(
          invoegEl,
          (veld) => {
            callbacks.onItemToevoegen(veld);
            invoegEl.textContent = "";
          },
          { start: weekMaandag, end: addDays(weekMaandag, 6) }
        );
      }
    );
  }

  function renderPeriodekiezer(w) {
    const rij = document.createElement("div");
    rij.className = "periodekiezer";
    for (const periode of PERIODES) {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "tap-target periode-knop";
      knop.textContent = PERIODE_LABELS[periode];
      knop.setAttribute("aria-current", periode === w.periode ? "true" : "false");
      knop.addEventListener("click", () => wijzig({ periode }));
      rij.appendChild(knop);
    }

    if (w.periode === "eigen") {
      rij.appendChild(renderEigenVelden(w));
    }

    return rij;
  }

  function renderEigenVelden(w) {
    const wrap = document.createElement("div");
    wrap.className = "eigen-periode-velden";

    const startInput = document.createElement("input");
    startInput.type = "date";
    startInput.min = appPeriod.start;
    startInput.max = appPeriod.end;
    if (w.eigenStart) startInput.value = w.eigenStart;

    const eindInput = document.createElement("input");
    eindInput.type = "date";
    eindInput.min = appPeriod.start;
    eindInput.max = appPeriod.end;
    if (w.eigenEind) eindInput.value = w.eigenEind;

    const foutEl = document.createElement("p");
    foutEl.className = "eigen-periode-fout";
    foutEl.hidden = true;

    function toepassen() {
      if (!startInput.value || !eindInput.value) return;
      if (startInput.value > eindInput.value) {
        foutEl.hidden = false;
        foutEl.textContent = "De startdatum ligt na de einddatum.";
        return;
      }
      if (startInput.value < appPeriod.start || eindInput.value > appPeriod.end) {
        foutEl.hidden = false;
        foutEl.textContent = `Buiten de app-periode (${appPeriod.start} t/m ${appPeriod.end}).`;
        return;
      }
      foutEl.hidden = true;
      wijzig({ eigenStart: startInput.value, eigenEind: eindInput.value });
    }
    startInput.addEventListener("change", toepassen);
    eindInput.addEventListener("change", toepassen);

    wrap.appendChild(startInput);
    wrap.appendChild(eindInput);
    wrap.appendChild(foutEl);
    return wrap;
  }

  function renderNavigatie(w) {
    const rij = document.createElement("div");
    rij.className = "weken-navigatie";

    const starts = weekStarts(w.startWeek, w.periode, w.eigenStart, w.eigenEind);
    const vorige = document.createElement("button");
    vorige.type = "button";
    vorige.className = "tap-target maand-pijl";
    vorige.textContent = "‹";
    vorige.setAttribute("aria-label", "Vorige periode");
    vorige.disabled = w.periode === "alle" || starts[0] <= maandagVan(appPeriod.start);
    vorige.addEventListener("click", () => schuif(-1, w));

    const volgende = document.createElement("button");
    volgende.type = "button";
    volgende.className = "tap-target maand-pijl";
    volgende.textContent = "›";
    volgende.setAttribute("aria-label", "Volgende periode");
    volgende.disabled = w.periode === "alle" || addDays(starts.at(-1), 6) >= appPeriod.end;
    volgende.addEventListener("click", () => schuif(1, w));

    rij.appendChild(vorige);
    rij.appendChild(volgende);
    return rij;
  }

  function schuif(richting, w) {
    if (w.periode === "eigen") {
      const nieuweStart = verschuifVenster(w.eigenStart, "eigen", w.eigenStart, w.eigenEind, richting);
      const lengte = weekStarts(w.eigenStart, "eigen", w.eigenStart, w.eigenEind).length * 7 - 1;
      wijzig({ eigenStart: nieuweStart, eigenEind: addDays(nieuweStart, lengte) });
      return;
    }
    wijzig({ startWeek: verschuifVenster(w.startWeek, w.periode, w.eigenStart, w.eigenEind, richting) });
  }

  function render(ctx) {
    laatsteCtx = ctx;
    tekenen();
  }

  return { render };
}
