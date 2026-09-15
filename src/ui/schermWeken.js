/**
 * Orkestratie van het scherm "Weken" (fase 8D): periodekiezer, vorige/
 * volgende-navigatie en de weekstrips. De periodekeuze en het vensterbegin
 * staan in de state (schema.js v5) en overleven een herlaad.
 */

import { addDays } from "../lib/date.js";
import { appPeriod } from "../data/semester.js";
import { PERIODES } from "../state/schema.js";
import { maandagVan, weekStarts, verschuifVenster, PERIODE_LABELS, renderWeekstrips } from "./wekenGrid.js";
import { renderLegenda } from "./legenda.js";
import { maakKnop } from "./knoppen.js";

/**
 * @param {HTMLElement} root
 * @param {{
 *   onWeekWeergaveWijzigen: (w: object) => void,
 *   onOpenWeek: (ymd: string) => void,
 *   onDagKiezen: (ymd: string, opties: {formOpenen: boolean}) => void,
 * }} callbacks FASE-9.md B2: item-erbij en dagcel-tik gaan via onDagKiezen
 *   naar het dagblad op het scherm Maand (met terugkeer naar Weken bij sluiten)
 *   in plaats van een inline formulier hier.
 * @returns {{render: (ctx: {weekWeergave: object, vandaag: string, pythonAfgewezen: boolean, tripStatusOverrides: Record<string, string>}) => void}}
 */
export function initWekenScherm(root, callbacks) {
  const koppenEl = document.createElement("div");
  const stripsEl = document.createElement("div");
  root.appendChild(koppenEl);
  root.appendChild(stripsEl);
  // De weekstrip is puur kleur plus afkorting; de legenda hoort er dus net zo
  // goed onder als onder de maandkalender.
  root.appendChild(renderLegenda());

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

    const starts = weekStarts(w.startWeek, w.periode, w.eigenStart, w.eigenEind);
    renderWeekstrips(
      stripsEl,
      { startWeeks: starts, pythonAfgewezen: laatsteCtx.pythonAfgewezen, tripStatusOverrides: laatsteCtx.tripStatusOverrides, eigenReizen: laatsteCtx.eigenReizen },
      callbacks.onOpenWeek,
      (ymd) => callbacks.onDagKiezen(ymd, { formOpenen: true }),
      (ymd) => callbacks.onDagKiezen(ymd, { formOpenen: false })
    );
  }

  function renderPeriodekiezer(w) {
    const rij = document.createElement("div");
    rij.className = "periodekiezer";
    for (const periode of PERIODES) {
      const knop = maakKnop({ label: PERIODE_LABELS[periode], className: "tap-target periode-knop" });
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
    const vorige = maakKnop({ label: "‹", className: "tap-target maand-pijl" });
    vorige.setAttribute("aria-label", "Vorige periode");
    vorige.disabled = w.periode === "alle" || starts[0] <= maandagVan(appPeriod.start);
    vorige.addEventListener("click", () => schuif(-1, w));

    const volgende = maakKnop({ label: "›", className: "tap-target maand-pijl" });
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
