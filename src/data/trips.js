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
const BRON_OMBOEKING = "opgave Idries (omboeking bevestigd, na FASE-9.md A2)";

export const trips = [
  // Japan — oorspronkelijke boeking. Raakte 2 van de 3 Chinees-midterm-
  // onderdelen (DATA.md §3.4) — daarom omgeboekt (zie hieronder). Vervallen,
  // niet verwijderd: de boeking heeft echt bestaan en blijft in de data.
  { id: "japan-origineel-heen", variant: "japan-origineel", groep: "japan", date: "2026-10-30", type: "vlucht", label: "TPE → KIX (Peach Aviation)", status: "vervallen", bron: BRON, zekerheid: "ZEKER" },
  { id: "japan-origineel-verblijf", variant: "japan-origineel", groep: "japan", start: "2026-10-30", end: "2026-11-09", type: "vaste-boeking", label: "Japan: Osaka 2 nachten → Kyoto 3 → Kawaguchiko/Fuji 1 → Tokyo 4", status: "vervallen", bron: BRON, zekerheid: "ZEKER" },
  { id: "japan-origineel-terug", variant: "japan-origineel", groep: "japan", date: "2026-11-09", type: "vlucht", label: "NRT → TPE (Peach Aviation)", status: "vervallen", bron: BRON, zekerheid: "ZEKER" },

  // Japan — omboeking, bevestigd door Idries (was "voorgenomen" in FASE-9.md
  // A2, ondertussen echt geboekt). Vertrek 2026-11-06 (vrijdag, geen les die
  // dag) om 13:05, terug 2026-11-16 om 12:25 (ruim vóór Chinees 18:25).
  { id: "japan-omboeking-heen", variant: "japan-omboeking", groep: "japan", date: "2026-11-06", type: "vlucht", label: "TPE → KIX (Peach Aviation, 13:05)", status: "geboekt", bron: BRON_OMBOEKING, zekerheid: "ZEKER" },
  { id: "japan-omboeking-verblijf", variant: "japan-omboeking", groep: "japan", start: "2026-11-06", end: "2026-11-16", type: "vaste-boeking", label: "Japan (omboeking)", status: "geboekt", bron: BRON_OMBOEKING, zekerheid: "ZEKER" },
  { id: "japan-omboeking-terug", variant: "japan-omboeking", groep: "japan", date: "2026-11-16", type: "vlucht", label: "NRT → TPE (Peach Aviation, 12:25)", status: "geboekt", bron: BRON_OMBOEKING, zekerheid: "ZEKER" },

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
