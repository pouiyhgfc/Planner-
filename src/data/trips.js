/**
 * Vaste reisboekingen uit DATA.md §4. Dit zijn de enige "vaste boeking"-items
 * in de app — de gebruiker voegt zijn eigen items pas toe in fase 4.
 */

const BRON = "vaste boekingen (Peach Aviation)";
const BRON_FILIPIJNEN = "opgave Idries";

export const trips = [
  { date: "2026-10-30", type: "vlucht", label: "TPE → KIX (Peach Aviation)", bron: BRON, zekerheid: "ZEKER" },
  { start: "2026-10-30", end: "2026-11-09", type: "vaste-boeking", label: "Japan: Osaka 2 nachten → Kyoto 3 → Kawaguchiko/Fuji 1 → Tokyo 4", bron: BRON, zekerheid: "ZEKER" },
  { date: "2026-11-09", type: "vlucht", label: "NRT → TPE (Peach Aviation)", bron: BRON, zekerheid: "ZEKER" },
  { start: "2026-09-25", end: "2026-09-30", type: "vaste-boeking", label: "Filipijnen-trip (terug ± 10:00 op woensdag)", bron: BRON_FILIPIJNEN, zekerheid: "ZEKER" },
];
