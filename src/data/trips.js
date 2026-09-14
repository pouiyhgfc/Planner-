/**
 * Vaste reisboekingen uit DATA.md §4. Dit zijn de enige "vaste boeking"-items
 * in de app — de gebruiker voegt zijn eigen items pas toe in fase 4.
 *
 * Sinds FASE-9.md A2: elk reisitem heeft een status (geboekt /
 * wijziging-aangevraagd / vervallen) en een variant-sleutel die de bij elkaar
 * horende items (vlucht(en) + verblijfsperiode) van één boekingsversie
 * groepeert. Items met dezelfde groep-sleutel horen bij dezelfde reis — daar
 * mag maar één variant tegelijk "geboekt" zijn, zie state/store.js:
 * zetTripStatus voor de wissel-cascade (nieuwe op geboekt → oude op vervallen).
 */

export const TRIP_STATUSSEN = ["geboekt", "wijziging-aangevraagd", "vervallen"];

const BRON = "vaste boekingen (Peach Aviation)";
const BRON_FILIPIJNEN = "opgave Idries";
const BRON_A2 = "FASE-9.md A2 (opgave Idries, omboeking in behandeling)";

export const trips = [
  // Japan — huidige boeking (geboekt). Raakt 2 van de 3 Chinees-midterm-
  // onderdelen (DATA.md §3.4/§4.1) — daarom is de omboeking hieronder aangevraagd.
  { id: "japan-geboekt-heen", variant: "japan-geboekt", groep: "japan", date: "2026-10-30", type: "vlucht", label: "TPE → KIX (Peach Aviation)", status: "geboekt", bron: BRON, zekerheid: "ZEKER" },
  { id: "japan-geboekt-verblijf", variant: "japan-geboekt", groep: "japan", start: "2026-10-30", end: "2026-11-09", type: "vaste-boeking", label: "Japan: Osaka 2 nachten → Kyoto 3 → Kawaguchiko/Fuji 1 → Tokyo 4", status: "geboekt", bron: BRON, zekerheid: "ZEKER" },
  { id: "japan-geboekt-terug", variant: "japan-geboekt", groep: "japan", date: "2026-11-09", type: "vlucht", label: "NRT → TPE (Peach Aviation)", status: "geboekt", bron: BRON, zekerheid: "ZEKER" },

  // Japan — voorgenomen omboeking (DATA.md §4.1): nog niet geboekt, dus de
  // huidige boeking hierboven blijft de actieve. Vertrek na 17:20 (ná RTE) en
  // terugkomst vóór 18:25 (vóór Chinees) zijn Idries' eigen gekozen tijden om
  // beide lessen die dagen niet te missen.
  { id: "japan-voorgenomen-heen", variant: "japan-voorgenomen", groep: "japan", date: "2026-11-05", type: "vlucht", label: "TPE → KIX (voorgenomen, na 17:20 — ná RTE)", status: "wijziging-aangevraagd", bron: BRON_A2, zekerheid: "TE VERIFIËREN" },
  { id: "japan-voorgenomen-verblijf", variant: "japan-voorgenomen", groep: "japan", start: "2026-11-05", end: "2026-11-16", type: "vaste-boeking", label: "Japan (voorgenomen omboeking)", status: "wijziging-aangevraagd", bron: BRON_A2, zekerheid: "TE VERIFIËREN" },
  { id: "japan-voorgenomen-terug", variant: "japan-voorgenomen", groep: "japan", date: "2026-11-16", type: "vlucht", label: "NRT → TPE (voorgenomen, vóór 18:25 — vóór Chinees)", status: "wijziging-aangevraagd", bron: BRON_A2, zekerheid: "TE VERIFIËREN" },

  // Filipijnen — enige variant, geboekt.
  { id: "filipijnen-geboekt", variant: "filipijnen-geboekt", groep: "filipijnen", start: "2026-09-25", end: "2026-09-30", type: "vaste-boeking", label: "Filipijnen-trip (terug ± 10:00 op woensdag)", status: "geboekt", bron: BRON_FILIPIJNEN, zekerheid: "ZEKER" },
];

/**
 * Effectieve status van een reisitem: een override uit de state (gezet via
 * zetTripStatus) wint van het standaard-statusveld in trips.js.
 * @param {{variant: string, status: string}} item
 * @param {Record<string, string>} [overrides] state.tripStatusOverrides
 * @returns {string}
 */
export function effectieveTripStatus(item, overrides = {}) {
  return overrides[item.variant] ?? item.status;
}
