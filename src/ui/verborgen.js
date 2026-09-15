/**
 * Leesbaar maken van de sleutels in state.verborgenItems (schema.js v12).
 * Wat je verbergt moet je ook weer kunnen terugvinden; een kale sleutel als
 * "deadline::2026-09-19::Laatste dag online vakken laten vallen" is geen
 * regel om een keuze mee terug te draaien.
 */

import { opleveringen } from "../data/opleveringen.js";
import { courseNaam } from "../data/courses.js";
import { kortDatum } from "./datumlabels.js";
import { alleDeadlineItems } from "./overzichtData.js";
import { deadlineSleutel } from "./dagblad.js";

/**
 * @param {string} sleutel
 * @returns {string} omschrijving voor de lijst in Instellingen
 */
export function verborgenOmschrijving(sleutel) {
  const scheiding = sleutel.indexOf("::");
  const soort = sleutel.slice(0, scheiding);
  const rest = sleutel.slice(scheiding + 2);

  if (soort === "deadline") {
    const deadline = alleDeadlineItems.find((d) => deadlineSleutel(d) === rest);
    if (deadline) {
      const datum = kortDatum(deadline.date ?? deadline.start);
      return deadline.course ? `${datum} — ${deadline.label} (${courseNaam(deadline.course)})` : `${datum} — ${deadline.label}`;
    }
  }

  if (soort === "oplevering") {
    const item = opleveringen.find((o) => o.id === rest);
    if (item) return `${courseNaam(item.vak)} — ${item.naam}`;
  }

  // Staat het item niet meer in de data (bijv. na een correctie in src/data/),
  // dan tonen we de sleutel zelf: dan is nog steeds zichtbaar dát er iets
  // verborgen is, en kun je het terugzetten.
  return sleutel;
}
