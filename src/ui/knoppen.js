/**
 * Knoppen die om bevestiging vragen voordat ze iets onomkeerbaars doen.
 *
 * De eerste tik verandert het opschrift in een vraag, de tweede voert uit.
 * Geen `confirm()`: dat blokkeert de pagina en ziet er in een geïnstalleerde
 * app uit als een browservenster. Geen apart dialoogvenster: de vraag hoort op
 * de knop die je net hebt aangeraakt.
 */

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
