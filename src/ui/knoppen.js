/**
 * Knoppen die om bevestiging vragen voordat ze iets onomkeerbaars doen.
 *
 * De eerste tik verandert het opschrift in een vraag, de tweede voert uit.
 * Geen `confirm()`: dat blokkeert de pagina en ziet er in een geïnstalleerde
 * app uit als een browservenster. Geen apart dialoogvenster: de vraag hoort op
 * de knop die je net hebt aangeraakt.
 */

/**
 * Een gewone knop. Het patroon eronder (element maken, type zetten, klasse
 * zetten, tekst zetten, listener hangen) stond 27 keer uitgeschreven in de
 * UI-laag; dat is vijf regels waar één regel hetzelfde zegt.
 * @param {{label: string, className?: string, onKlik?: () => void, actief?: boolean}} opties
 *   actief zet aria-current, voor knoppen die een keuze tonen.
 * @returns {HTMLButtonElement}
 */
export function maakKnop({ label, className = "tap-target", onKlik, actief }) {
  const el = document.createElement("button");
  el.type = "button";
  if (className) el.className = className;
  el.textContent = label;
  if (onKlik) el.addEventListener("click", onKlik);
  if (actief !== undefined) el.setAttribute("aria-current", actief ? "true" : "false");
  return el;
}

/**
 * @param {{label: string, bevestigLabel?: string, className?: string, onBevestigd: () => void, onStap?: () => void}} opties
 *   onStap wordt aangeroepen bij de eerste tik, zodat een omliggend menu open
 *   kan blijven staan tot de keuze gemaakt is.
 * @returns {HTMLButtonElement}
 */
export function bevestigKnop({ label, bevestigLabel = "Zeker weten?", className = "", onBevestigd, onStap }) {
  const knop = document.createElement("button");
  knop.type = "button";
  if (className) knop.className = className;
  knop.textContent = label;

  let bevestigen = false;
  knop.addEventListener("click", () => {
    if (!bevestigen) {
      bevestigen = true;
      knop.textContent = bevestigLabel;
      knop.classList.add("bevestig-actief");
      onStap?.();
      return;
    }
    onBevestigd();
  });
  return knop;
}
