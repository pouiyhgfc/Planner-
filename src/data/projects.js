/**
 * Projecten met mijlpalen — fase 8E. Labels zijn letterlijk overgenomen uit
 * coursedates.js/DATA.md §3.3 en §3.5 (zelfde bron), niet opnieuw verzonnen.
 * Afvinkstatus van een mijlpaal is gebruikersinvoer en staat in de state
 * (schema.js v6), niet hier.
 */

const BRON_RTE = "2026-NTU_RTE_Syllabus_ver_1.docx";
const BRON_PY = "NTU-cursuspagina (FASE-8-1.md 0B, correctie 2)";

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
    mijlpalen: [
      { datum: "2026-12-09", label: "Project Presentation (week 14)" },
      { datum: "2026-12-16", label: "Project Presentation (week 15)" },
      { datum: "2026-12-23", label: "Project Presentation (week 16)" },
    ],
    groepsgrootte: null,
    vormingstermijn: null,
    onbekendeVelden: ["groepsgrootte", "vormingstermijn"],
    waarschuwing: "Geen groep vormen binnen de gestelde termijn betekent een F voor het hele vak. Groepsgrootte en vormingstermijn zijn ONBEKEND — worden in de les aangekondigd.",
    bron: BRON_PY,
    zekerheid: "TE VERIFIËREN",
  },
];
