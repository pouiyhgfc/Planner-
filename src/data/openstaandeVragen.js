/**
 * De punten uit DATA.md §9 die nog echt open staan: dingen die geen enkel
 * brondocument geeft en die Idries zelf moet uitzoeken. Ze blijven ONBEKEND
 * in de app tot hij ze invult — er wordt hier niets gegokt (CLAUDE.md §5).
 *
 * `id` is tegelijk de opslagsleutel in state.vakkenVeldwaarden, met dezelfde
 * vorm als elders in de app (`${vakId}.${veldnaam}`).
 *
 * Een punt staat hier alleen als het antwoord verandert wat de app laat zien:
 * een datum, een tijd, een belasting of een grens. Gaten die dat niet doen
 * horen hier niet — administratieve nummers (vakcode, boekingsnummer), keuzes
 * die alleen over cijfers gaan, en velden waar de app niets mee mag doen.
 * Zie DATA.md §9 voor wat om die reden is geschrapt.
 *
 * Geen enkele datum in dit bestand: waar een vraag over een bekende dag gaat,
 * staat het weeknummer in de tekst. De datum zelf staat al in coursedates.js
 * of deadlines.js en hoort niet twee keer in de data te leven.
 */

import { courseNaam } from "./courses.js";

const BRON = "DATA.md §9";

/** Groepen zonder vak — vakken krijgen hun naam uit courses.js. */
const OVERIG = {
  KALENDER: "NTU-kalender",
  CHINA: "China — visumvrij",
  PERSOONLIJK: "Persoonlijk",
};

export const openstaandeVragen = [
  {
    id: "CHI.tentamenverdeling",
    vak: "CHI",
    vraag: "Verdeling van de 20% (midterm) en 25% (final) over de onderdelen",
    toelichting: "De syllabus noemt vier onderdelen — schriftelijk, luistertoets, mondeling en individuele presentatie — maar geen percentages per onderdeel.",
    verwijzing: "DATA.md §3.4",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "CHI.faaldrempelvolgorde",
    vak: "CHI",
    vraag: "Verhouding tussen de 1/3-faaldrempel en de vrijstelling van 6 uur",
    toelichting: "De app toont ze nu als twee losse grenzen. Worden ze echt nooit verrekend, of geldt er een volgorde?",
    verwijzing: "DATA.md §3.4",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "PSY.opdrachtdatums",
    vak: "PSY",
    vraag: "Inleverdatums van de vier schriftelijke opdrachten",
    toelichting: "De syllabus noemt de vier opdrachten wel, maar geen datums. Er is geen wekelijks huiswerk en geen paper.",
    verwijzing: "DATA.md §3.1",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "PY.opdrachtdatums",
    vak: "PY",
    vraag: "Inleverdatums van de opdrachten",
    toelichting: "Het aantal is bekend (ongeveer 12, waarvan 10 meetellen); de datums staan op NTU COOL.",
    verwijzing: "DATA.md §3.5",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "AGTECH.presentatieopdracht",
    vak: "AGTECH",
    vraag: "Onderwerp, vorm, lengte en verslagplicht van de studentpresentatie (week 15)",
    toelichting: "De presentatiedatum staat vast, de opdracht eromheen niet — de cursuspresentatie gaat er niet over.",
    verwijzing: "DATA.md §3.2",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "AGTECH.excursietijd",
    vak: "AGTECH",
    vraag: "Tijd van de excursie (week 14)",
    toelichting: "De datum staat vast. Dit is niet Taiwan Smart Agriweek van september — dat is een andere gelegenheid.",
    verwijzing: "DATA.md §3.2",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "RTE.technicalvisittijd",
    vak: "RTE",
    vraag: "Tijd van de technical visit (week 11)",
    toelichting: "De datum staat vast en is een harde grens voor reizen: de excursie is niet in te halen.",
    verwijzing: "DATA.md §3.3",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "KALENDER.flexibeleweek",
    groep: OVERIG.KALENDER,
    vraag: "Plannen de docenten iets in de flexibele week?",
    toelichting: "Inhaallessen en tentamens in die week moeten uiterlijk eind week 12 aangekondigd zijn — die deadline staat als item in de kalender.",
    verwijzing: "DATA.md §2",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "CHINA.visumbron",
    groep: OVERIG.CHINA,
    vraag: "Primaire bron voor de visumvrije regeling",
    toelichting: "De regeling staat nu als TE VERIFIËREN in de app, omdat het rapport waar hij uit komt geen enkele bron-URL gaf.",
    verwijzing: "DATA.md §5",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
  {
    id: "PERSOONLIJK.afstudeeropdracht",
    groep: OVERIG.PERSOONLIJK,
    vraag: "Datum en duur van de afstudeeropdracht in Nederland",
    toelichting: "Bepaalt de harde einddatum van het reisvenster.",
    verwijzing: "DATA.md §9",
    bron: BRON,
    zekerheid: "ONBEKEND",
  },
];

/**
 * De vragen op volgorde, gegroepeerd onder een kop. Vakken krijgen hun naam
 * uit courses.js zodat die naam maar op één plek staat.
 * @returns {{kop: string, vragen: object[]}[]}
 */
export function vragenPerGroep() {
  const groepen = [];
  for (const vraag of openstaandeVragen) {
    const kop = vraag.vak ? courseNaam(vraag.vak) : vraag.groep;
    const bestaand = groepen.find((g) => g.kop === kop);
    if (bestaand) bestaand.vragen.push(vraag);
    else groepen.push({ kop, vragen: [vraag] });
  }
  return groepen;
}

/**
 * @param {Record<string, string>} veldwaarden state.vakkenVeldwaarden
 * @returns {{beantwoord: number, totaal: number}}
 */
export function vragenStand(veldwaarden) {
  const beantwoord = openstaandeVragen.filter((v) => (veldwaarden[v.id] ?? "").trim() !== "").length;
  return { beantwoord, totaal: openstaandeVragen.length };
}
