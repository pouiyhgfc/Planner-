/**
 * Gedeelde kleurlegenda voor de schermen Maand en Weken.
 */

import { courses } from "../data/courses.js";
import { WEEKDAGEN } from "./datumlabels.js";
import { vakAfkorting } from "./tekst.js";

/**
 * De legenda legt de kleurcodering uit. Staat onder zowel Maand als Weken:
 * op allebei die schermen is een vak alleen een kleur, en dan moet ergens
 * staan welke kleur welk vak is. Ingeklapt kost hij één regel.
 */
export function renderLegenda() {
  const uitklap = document.createElement("details");
  uitklap.className = "uitklap maand-legenda-uitklap";
  const samenvatting = document.createElement("summary");
  samenvatting.className = "tap-target";
  samenvatting.textContent = "Legenda — welke kleur is welk vak";
  uitklap.appendChild(samenvatting);

  const lijst = document.createElement("ul");
  lijst.className = "maand-legenda";
  for (const c of courses) {
    const li = document.createElement("li");

    const swatch = document.createElement("span");
    swatch.className = "legenda-swatch";
    swatch.style.backgroundColor = `var(--vak-${c.id.toLowerCase()}-text)`;
    li.appendChild(swatch);

    const tekst = document.createElement("span");
    const dagen = c.weekdays.map((w) => WEEKDAGEN[w]).join(" + ");
    tekst.textContent = `${vakAfkorting(c.id)} — ${c.name} — ${dagen} ${c.start}–${c.end}`;
    li.appendChild(tekst);

    lijst.appendChild(li);
  }

  const reisLi = document.createElement("li");
  const reisSwatch = document.createElement("span");
  reisSwatch.className = "legenda-swatch legenda-swatch-reis";
  reisLi.appendChild(reisSwatch);
  const reisTekst = document.createElement("span");
  reisTekst.textContent = "Reis — volle band = geboekt, gestreepte omlijning = wijziging aangevraagd, ruit = losse vlucht";
  reisLi.appendChild(reisTekst);
  lijst.appendChild(reisLi);

  uitklap.appendChild(lijst);
  return uitklap;
}
