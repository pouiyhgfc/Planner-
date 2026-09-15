/**
 * Projecten met mijlpalen — fase 8E. Labels zijn letterlijk overgenomen uit
 * coursedates.js/DATA.md §3.3 en §3.5 (zelfde bron), niet opnieuw verzonnen.
 * Afvinkstatus van een mijlpaal is gebruikersinvoer en staat in de state
 * (schema.js v6), niet hier.
 */

const BRON_RTE = "2026-NTU_RTE_Syllabus_ver_1.docx";
const BRON_PY_COLLEGE = "Lecture00_CourseOverview_03.pdf (collegeslides)";

export const projects = [
  {
    id: "RTE_TERMPROJECT",
    naam: "RTE termproject",
    vak: "RTE",
    tekst: "Bachelorniveau: presentatie over de ontwikkeling van veiligheidsprocedures en -technologie in het spoor, groepen van 5 personen. 20 minuten Engelse presentatie (5 minuten per persoon) plus een Engels termverslag. Verdeling binnen de 25%: presentatie 15%, verslag 10%.",
    mijlpalen: [
      { datum: "2026-09-24", label: "Term project topic + groepen (5 pers.)" },
      { datum: "2026-10-15", label: "Term project draft PPT due" },
      { datum: "2026-11-12", label: "2e draft PPT due" },
      { datum: "2026-12-10", label: "Term Project Presentations" },
      { datum: "2026-12-17", label: "Term Project Presentations" },
    ],
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "PY_GROEPSPROJECT",
    naam: "Python groepsproject",
    vak: "PY",
    tekst: "Groepen van 4 tot 6 studenten. Verdeling binnen de 25%: groepsleden doorgeven 3%, voorstel + video 1%, creativiteit/haalbaarheid/breedte 3%, beoordeling van groepsgenoten 8%, verslag 10%. De presentatie is optioneel en levert maximaal 5% bonus op.",
    mijlpalen: [
      { datum: "2026-10-09", label: "Groepsleden doorgeven (per e-mail)" },
      { datum: "2026-11-06", label: "Voorstel + video inleveren" },
      { datum: "2026-12-09", label: "Presentatie week 14 (optioneel)" },
      { datum: "2026-12-16", label: "Presentatie week 15 (optioneel)" },
      { datum: "2026-12-25", label: "Verslag + beoordeling groepsgenoten" },
    ],
    groepsgrootteMin: 4,
    groepsgrootteMax: 6,
    vormingstermijn: "2026-10-09",
    onbekendeVelden: [],
    waarschuwing: "Groep niet op tijd doorgeven kost meteen punten: 1% per halve dag te laat, tot 100% van dat onderdeel. Idries heeft al een groepsgenoot, maar de groep moet 4 tot 6 personen tellen.",
    bron: BRON_PY_COLLEGE,
    zekerheid: "ZEKER",
  },
];
