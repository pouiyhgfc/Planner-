/**
 * Opleveringen: onderdelen waar Idries iets voor inlevert of presenteert,
 * met — waar de bron dat zegt — het percentage dat ze meetellen. Staat los
 * van het lesrooster (coursedates.js) en de actie-deadlines
 * (rteActionItems): dit is de "wat telt mee en hoeveel"-laag (FASE-9.md B3).
 *
 * Chinees ontbreekt hier bewust: de presentatie-onderdelen van midterm en
 * final zijn al tentamenitems (coursedates.js chineseTentamens, FASE-9.md
 * A1) — geen tweede regel voor hetzelfde onderdeel.
 *
 * dedupLabel: als gezet, is dit exact het label van het bijbehorende item in
 * rteActionItems (coursedates.js). ui/schermVakken.js gebruikt dit om die
 * deadline niet nogmaals te tonen in "Opdrachten en deadlines" — hetzelfde
 * onderdeel hoort daar maar één keer te staan.
 *
 * De Python-opdrachten worden berekend uit het aantal in courses.js in plaats
 * van hier uitgeschreven — zie pythonOpdrachten() hieronder.
 *
 * mogelijkeData: bekende kandidaatdata waarop dit item kan vallen, als het
 * niet vaststaat welke van toepassing is op Idries' groep — nooit geraden
 * tot één datum. onbekendeVelden noemt welke velden hierop ONBEKEND zijn.
 */

import { courseVoor } from "./courses.js";

const BRON_RTE = "2026-NTU_RTE_Syllabus_ver_1.docx";
const BRON_RTE_COLLEGE = "01_RTE-Lecture-01_Syllabus_2026.09.10.pdf (collegeslides)";
const BRON_AGTECH = "presentatie 20260910-_Global_AgTech_Foresight.pdf";
const BRON_PY = "NTU-cursuspagina (FASE-8-1.md 0B, correctie 2)";
const BRON_PY_COLLEGE = "Lecture00_CourseOverview_03.pdf (collegeslides)";
const BRON_PSY = "syllabus PSY1007-09";

/**
 * Python heeft geen genummerde opdrachtenlijst: de collegeslides zeggen
 * "wekelijks of tweewekelijks, ongeveer 7 tot 11". De marge staat in
 * courses.js en de regels worden daaruit berekend, zodat de getallen maar op
 * één plek leven (CLAUDE.md §5: afgeleide feiten berekenen, niet invoeren).
 * Er worden er zoveel getoond als het maximum: liever een regel te veel dan
 * een opdracht die je niet ziet aankomen. Geen enkele regel krijgt een
 * verzonnen datum of onderwerp — die vult Idries zelf in zodra hij ze hoort.
 */
function pythonOpdrachten() {
  const { aantalMin, aantalMax, zekerheid } = courseVoor("PY").opdrachten;
  return Array.from({ length: aantalMax }, (_, i) => ({
    id: `PY-OPDR-${i + 1}`,
    vak: "PY",
    naam: `Opdracht ${i + 1}`,
    soort: "opdracht",
    weging: null,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: `Onderdeel van de 65% opdrachten, wekelijks of tweewekelijks. De bron noemt ongeveer ${aantalMin} tot ${aantalMax} stuks; hier staan er ${aantalMax}, zodat je er geen mist. Elke opdracht telt mee (0-5 punten) — er vallen er geen af. Datum en onderwerp zelf invullen.`,
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid,
  }));
}

const RTE_HUISWERK_OPMERKING = "Onderdeel van huiswerk 30% (beste 5 van 7 opdrachten tellen) — geen eigen percentage per opdracht in de syllabus.";

// De onderwerpen achter de nummers (#2 Infrastructure & Special Track Work,
// #3 WCML, #4 Station Evaluation, #5 Rolling Stock) staan alleen in de
// collegeslides van les 1, niet in de docx-syllabus.

export const opleveringen = [
  ...pythonOpdrachten(),
  {
    id: "RTE-TERMPROJECT-PRESENTATIE",
    vak: "RTE",
    naam: "Termproject — presentatie",
    soort: "presentatie",
    weging: 15,
    datum: null,
    mogelijkeData: ["2026-12-10", "2026-12-17"],
    onbekendeVelden: ["datum"],
    opmerking: "20 minuten Engelse presentatie in groepen van 5 (5 minuten per persoon), op 10 of 17 december (RTE_TERMPROJECT). Welke datum voor deze groep geldt, is ONBEKEND.",
    dedupLabel: null,
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-TERMPROJECT-VERSLAG",
    vak: "RTE",
    naam: "Termproject — verslag",
    soort: "verslag",
    weging: 10,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: "Engels termverslag bij het termproject. Een aparte inleverdatum voor het verslag staat niet in de syllabus.",
    dedupLabel: null,
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-1",
    vak: "RTE",
    naam: "Assignment #1",
    soort: "opdracht",
    weging: null,
    datum: "2026-10-15",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `Draft PPT op 2026-09-24, definitief in op 2026-10-15. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #1 due",
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-2",
    vak: "RTE",
    naam: "Assignment #2 — Infrastructure & Special Track Work",
    soort: "opdracht",
    weging: null,
    datum: "2026-10-08",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `Uitgegeven 2026-10-01, in op 2026-10-08. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #2 due",
    bron: `${BRON_RTE} + ${BRON_RTE_COLLEGE}`,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-3",
    vak: "RTE",
    naam: "Assignment #3 — WCML",
    soort: "opdracht",
    weging: null,
    datum: "2026-10-08",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `In de les. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #3 in-class",
    bron: `${BRON_RTE} + ${BRON_RTE_COLLEGE}`,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-4",
    vak: "RTE",
    naam: "Assignment #4 — Station Evaluation",
    soort: "opdracht",
    weging: null,
    datum: "2026-10-22",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `Uitgegeven 2026-10-15, in op 2026-10-22. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #4 due",
    bron: `${BRON_RTE} + ${BRON_RTE_COLLEGE}`,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-5",
    vak: "RTE",
    naam: "Assignment #5 — Rolling Stock",
    soort: "opdracht",
    weging: null,
    datum: "2026-11-05",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `In de les. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #5 in-class",
    bron: `${BRON_RTE} + ${BRON_RTE_COLLEGE}`,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-6",
    vak: "RTE",
    naam: "Assignment #6",
    soort: "opdracht",
    weging: null,
    datum: "2026-12-03",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `In de les. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #6 in-class",
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "RTE-OPDR-7",
    vak: "RTE",
    naam: "Assignment #7",
    soort: "opdracht",
    weging: null,
    datum: "2026-11-19",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: `Technical visit. ${RTE_HUISWERK_OPMERKING}`,
    dedupLabel: "Assignment #7 (visit)",
    bron: BRON_RTE,
    zekerheid: "ZEKER",
  },
  {
    id: "AGTECH-PRESENTATIE",
    vak: "AGTECH",
    naam: "Studentpresentatie",
    soort: "presentatie",
    weging: null,
    datum: "2026-12-17",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: 'Onderdeel van de gecombineerde 40% "Presentatie/opdracht" — niet apart uitgesplitst in de bron.',
    dedupLabel: null,
    bron: BRON_AGTECH,
    zekerheid: "ZEKER",
  },
  {
    id: "PY-PROJECT-GROEP",
    vak: "PY",
    naam: "Projectgroep doorgeven",
    soort: "opdracht",
    weging: 3,
    datum: "2026-10-09",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: "Groepen van 4 tot 6 personen, vóór 23:59:59 (Taipei) per e-mail naar tseyu@ntu.edu.tw. Te laat kost 1% per halve dag, tot 100%.",
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid: "ZEKER",
  },
  {
    id: "PY-PROJECT-VOORSTEL",
    vak: "PY",
    naam: "Projectvoorstel + video",
    soort: "opdracht",
    weging: 1,
    datum: "2026-11-06",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: "Via een Google Form, vóór 23:59:59 (Taipei). Creativiteit, haalbaarheid en breedte van het onderwerp tellen los daarvan voor 3%.",
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid: "ZEKER",
  },
  {
    id: "PY-PROJECTPRESENTATIE",
    vak: "PY",
    naam: "Projectpresentatie (optioneel)",
    soort: "presentatie",
    weging: 5,
    datum: null,
    mogelijkeData: ["2026-12-09", "2026-12-16"],
    onbekendeVelden: ["datum"],
    opmerking: "Optioneel: levert maximaal 5% bonus op, voor maximaal 8 groepen. In de weken 14 en 15. LET OP: de collegeslides noemen dinsdag 8 en 15 december, maar het college is op woensdag — die tegenspraak is niet opgelost, zie DATA.md §3.5.",
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid: "TE VERIFIËREN",
  },
  {
    id: "PY-PROJECT-VERSLAG",
    vak: "PY",
    naam: "Projectverslag",
    soort: "verslag",
    weging: 10,
    datum: "2026-12-25",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: "Via een Google Form, vóór 23:59:59 (Taipei). Zwaarste onderdeel van het project. Valt op Constitution Day, een vrije dag.",
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid: "ZEKER",
  },
  {
    id: "PY-PROJECT-PEER",
    vak: "PY",
    naam: "Beoordeling groepsgenoten",
    soort: "opdracht",
    weging: 8,
    datum: "2026-12-25",
    mogelijkeData: null,
    onbekendeVelden: [],
    opmerking: "Via het Peer Assessment Form, vóór 23:59:59 (Taipei). Weegt zwaarder dan het voorstel en de presentatie samen — makkelijk te vergeten.",
    dedupLabel: null,
    bron: BRON_PY_COLLEGE,
    zekerheid: "ZEKER",
  },
  {
    id: "PSY-OPDRACHT-1",
    vak: "PSY",
    naam: "Opdracht 1",
    soort: "opdracht",
    weging: null,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: 'Onderdeel van de 20% "4 opdrachten" — het zijn de enige inlevermomenten van PSY (geen wekelijks huiswerk, geen paper). Inleveren uitsluitend via NTU COOL; per e-mail insturen levert 0 punten op. Datum en individuele weging staan niet in de syllabus.',
    dedupLabel: null,
    bron: BRON_PSY,
    zekerheid: "ZEKER",
  },
  {
    id: "PSY-OPDRACHT-2",
    vak: "PSY",
    naam: "Opdracht 2",
    soort: "opdracht",
    weging: null,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: 'Onderdeel van de 20% "4 opdrachten" — het zijn de enige inlevermomenten van PSY (geen wekelijks huiswerk, geen paper). Inleveren uitsluitend via NTU COOL; per e-mail insturen levert 0 punten op. Datum en individuele weging staan niet in de syllabus.',
    dedupLabel: null,
    bron: BRON_PSY,
    zekerheid: "ZEKER",
  },
  {
    id: "PSY-OPDRACHT-3",
    vak: "PSY",
    naam: "Opdracht 3",
    soort: "opdracht",
    weging: null,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: 'Onderdeel van de 20% "4 opdrachten" — het zijn de enige inlevermomenten van PSY (geen wekelijks huiswerk, geen paper). Inleveren uitsluitend via NTU COOL; per e-mail insturen levert 0 punten op. Datum en individuele weging staan niet in de syllabus.',
    dedupLabel: null,
    bron: BRON_PSY,
    zekerheid: "ZEKER",
  },
  {
    id: "PSY-OPDRACHT-4",
    vak: "PSY",
    naam: "Opdracht 4",
    soort: "opdracht",
    weging: null,
    datum: null,
    mogelijkeData: null,
    onbekendeVelden: ["datum"],
    opmerking: 'Onderdeel van de 20% "4 opdrachten" — het zijn de enige inlevermomenten van PSY (geen wekelijks huiswerk, geen paper). Inleveren uitsluitend via NTU COOL; per e-mail insturen levert 0 punten op. Datum en individuele weging staan niet in de syllabus.',
    dedupLabel: null,
    bron: BRON_PSY,
    zekerheid: "ZEKER",
  },
];
