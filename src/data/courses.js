/**
 * Vaste weekstructuur (lesrooster 115-1) uit DATA.md §1.
 * weekdays gebruikt dezelfde codering als lib/date.js dayOfWeek(): 0 = maandag.
 * onbekendeVelden noemt de velden binnen dit record die ONBEKEND zijn
 * (DATA.md §9) — die velden staan hieronder op `null`, nooit gegokt.
 */

/**
 * @param {string} id vak-id zoals "PSY"
 * @returns {object|undefined}
 */
export function courseVoor(id) {
  return courses.find((c) => c.id === id);
}

/**
 * @param {string} id
 * @returns {string} de volledige vaknaam, of het id zelf als het vak niet bestaat
 */
export function courseNaam(id) {
  return courseVoor(id)?.name ?? id;
}

export const courses = [
  {
    id: "PSY",
    code: "PSY1007-09",
    name: "General Psychology (普通心理學)",
    weekdays: [2], // woensdag
    start: "09:10",
    end: "12:10",
    room: "博雅 101",
    docent: "周珮雯 (Catherine P. Chou)",
    studiepunten: 3,
    onbekendeVelden: [],
    opmerking: "Studiepunten (3) komen uit de opgave van Idries; de syllabus zelf noemt ze niet. Docentnaam komt uit VAKKEN.md §3 — de syllabus zelf noemt geen naam, alleen dat de docent het recht op wijziging behoudt. Vak wordt in het Engels gegeven en telt als Liberal Education Course A58.",
    bron: "syllabus PSY1007-09",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Midterm 35%, final 35%, 4 opdrachten 20%, participatie 10%. De vier opdrachten zijn de enige inlevermomenten: de syllabus noemt geen wekelijks huiswerk en geen paper. Inleveren gaat uitsluitend via NTU COOL — per e-mail insturen levert 0 punten op. Te laat inleveren: −10% per dag inclusief weekend, na 1 week geen punten. Tentamens niet cumulatief (meerkeuzevragen). Gemist tentamen zonder documentatie = 0. Daarnaast is er 4% aan extra credits te verdienen met deelname aan onderzoek en/of een onderzoekspaper — bovenop de 100%, dus geen verplicht onderdeel.",
      weging: [
        { label: "Midterm", percentage: 35 },
        { label: "Final", percentage: 35 },
        { label: "Opdrachten (4x)", percentage: 20 },
        { label: "Participatie", percentage: 10 },
        { label: "Extra credits (bonus)", percentage: 4 },
      ],
      bron: "syllabus PSY1007-09 + collegeslides PSY1007-09_090926.pdf",
      zekerheid: "ZEKER",
    },
  },
  {
    id: "AGTECH",
    code: null,
    name: "Global AgTech Foresight",
    weekdays: [3], // donderdag
    start: "09:10",
    end: "12:10",
    room: null,
    docent: "Chih-Wei Tung (programmadirecteur MS Global ATGS)",
    studiepunten: 3,
    onbekendeVelden: ["code", "room"],
    opmerking: "Studiepunten (3) komen uit de opgave van Idries; de presentatie noemt ze niet. De eerder aangenomen code 946 U0060 (ser. 52089) bleek bij Computer Programming in Python te horen, niet bij AgTech — FASE-8-1.md 0B, correctie 1. AgTech's eigen code is ONBEKEND. Docentnaam (Chih-Wei Tung) komt uit VAKKEN.md §5, eerder ONBEKEND.",
    bron: "presentatie 20260910-_Global_AgTech_Foresight.pdf",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Aanwezigheid 30%, participatie 30%, presentatie/opdracht 40%. −15 punten per absentie. −5 punten bij 10–15 min te laat, −10 punten bij >15 min te laat. −10 punten per goedgekeurde (ziekte)verlofaanvraag via het online systeem. Participatie: vraag stellen = 5 punten/week, maximaal 30.",
      weging: [
        { label: "Aanwezigheid", percentage: 30 },
        { label: "Participatie", percentage: 30 },
        { label: "Presentatie/opdracht", percentage: 40 },
      ],
      bron: "presentatie 20260910-_Global_AgTech_Foresight.pdf",
      zekerheid: "ZEKER",
    },
  },
  {
    id: "RTE",
    code: "521 EU8770",
    name: "Railroad Transportation Engineering",
    weekdays: [3], // donderdag
    start: "14:20",
    end: "17:20",
    room: "新 103",
    docent: "Yung-Cheng (Rex) Lai",
    studiepunten: 3,
    onbekendeVelden: [],
    opmerking: "Studiepunten (3) komen uit de opgave van Idries; de syllabus zelf noemt ze niet.",
    bron: "2026-NTU_RTE_Syllabus_ver_1.docx",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Huiswerk 30% (beste 5 van 7, geen uitstel), term project 25%, 2 quizzes 20%, comprehensive exam 25%, participatie 5%. Klasregels: geen laat huiswerk, geen telefoon, geen eten.",
      // Telt op tot 105%, niet 100% — letterlijk overgenomen uit de syllabus-tekst
      // (CLAUDE.md §5: niets "verbeteren"). Niet herschaald.
      weging: [
        { label: "Huiswerk (beste 5 van 7)", percentage: 30 },
        { label: "Term project", percentage: 25 },
        { label: "Quizzes (2x)", percentage: 20 },
        { label: "Comprehensive exam", percentage: 25 },
        { label: "Participatie", percentage: 5 },
      ],
      bron: "2026-NTU_RTE_Syllabus_ver_1.docx",
      zekerheid: "ZEKER",
    },
  },
  {
    id: "CHI",
    code: "PTCSL7908, klas 23, course identifier 146 U9080, ser. 34044",
    name: "General Chinese (國際生華語(一))",
    weekdays: [0, 2], // maandag en woensdag
    start: "18:25",
    end: "21:05",
    room: "普502 (Pu 502)",
    docent: "何宣瑩 (HE, SYUAN-YING)",
    studiepunten: 3,
    onbekendeVelden: [],
    opmerking: "Keuzevak, voertaal Chinees met Engels als hulptaal, lesmateriaal Practical Audio-Visual Chinese 1 (les 1-6), alleen voor internationale studenten. Dag/zaal-conflict met een tegenstrijdig Course Description-blok (di/do, zaal 普406) is opgelost ten gunste van ma/wo — zie DATA.md §3.4.",
    bron: "NTU Course-pagina + syllabus PTCSL7908-23",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Aanwezigheid/participatie 15%, huiswerk 20%, quizzen/toetsen 20%, midterm 20%, final 25%. Midterm en final bestaan elk uit een schriftelijk deel, een luistertoets, een mondeling en een individuele presentatie, verdeeld over drie lesdagen; hoe de 20% en de 25% over die onderdelen verdeeld zijn, staat niet in de syllabus. Huiswerk te laat: −10 punten, na 1 week 0. Dictee-quizzen geen herkansing, beste 15 tellen. Midterm+final (45%) geen ruime regeling: herkansing alleen met melding ≥1 dag vooraf, medische verklaring en afgeronde online verlofprocedure, dan binnen 3 dagen — anders 0 punten. Gedragsregels: vanaf de 4e waarschuwing −1 punt (telt onder aanwezigheid).",
      weging: [
        { label: "Aanwezigheid/participatie", percentage: 15 },
        { label: "Huiswerk", percentage: 20 },
        { label: "Quizzen/toetsen", percentage: 20 },
        { label: "Midterm", percentage: 20 },
        { label: "Final", percentage: 25 },
      ],
      bron: "syllabus PTCSL7908-23",
      zekerheid: "ZEKER",
    },
    weektoetsen: {
      tekst: "Vanaf week 4 loopt dit elke week door: elke les een dictee, elke week huiswerk, en na elke afgeronde les een herhalingstoets in het laatste lesuur. De beste 15 dictees tellen mee. Exacte datums staan op NTU COOL en worden per les aangekondigd — de app genereert er geen.",
      vanafWeek: 4,
      besteAantalTelt: 15,
      dicteeElkeLes: true,
      huiswerkElkeWeek: true,
      datums: null,
      onbekendeVelden: ["datums"],
      bron: "opgave Idries + syllabus PTCSL7908-23",
      zekerheid: "ZEKER",
    },
    absentieregels: {
      puntenaftrek: {
        tekst: "6 uur vrijstelling per semester (vooraf per e-mail afgemeld). Vanaf het 7e uur: −0,5 punt per uur op aanwezigheid/participatie (15% van het eindcijfer). Eén sessie = 3 uur (periodes A/B/C). >20 min te laat of >20 min te vroeg weg = 1 uur absentie.",
        vrijstellingUren: 6,
        aftrekPerUurBovenVrijstelling: 0.5,
        uurPerSessie: 3,
        bron: "syllabus PTCSL7908-23",
        zekerheid: "ZEKER",
      },
      faaldrempel: {
        tekst: "Meer dan 1/3 van de sessies missen kan betekenen niet halen; 5 of meer ongeoorloofde absenties betekent niet halen. Ziekte-/verlofmeldingen met bewijs tellen mee in het totaal maar kosten geen punten.",
        drempelFractieSessies: 1 / 3,
        drempelOngeoorloofdeAbsenties: 5,
        bron: "Course Description-blok PTCSL7908 (zelfde blok dat eerder de onjuiste dag/zaal noemde)",
        zekerheid: "TE VERIFIËREN",
      },
    },
  },
  {
    id: "PY",
    code: "Data5006, curriculum identity 946EU0060, klas 03, ser. 52089",
    name: "Computer Programming in Python",
    weekdays: [2], // woensdag
    start: "13:20",
    end: "16:20",
    room: null,
    docent: "LIN, TSE-YU",
    studiepunten: 3,
    onbekendeVelden: ["room"],
    inschrijving: "bevestigd",
    opmerking: "Inschrijving liep via een Google Form met loting onder de permissienummers. Idries was al lid en heeft daarmee een plek — de loting was voor hem geen drempel (opgave Idries). Half jaar, max. 80 studenten.",
    bron: "NTU-cursuspagina (FASE-8-1.md 0B, correctie 2)",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Aanwezigheid 10%, opdrachten 65% (ca. 10-12 stuks, programmeeropdrachten en online quizzes), groepsproject 25%.",
      weging: [
        { label: "Aanwezigheid", percentage: 10 },
        { label: "Opdrachten (~10-12)", percentage: 65 },
        { label: "Groepsproject", percentage: 25 },
      ],
      bron: "NTU-cursuspagina",
      zekerheid: "ZEKER",
    },
    opdrachten: {
      tekst: "Wekelijks of tweewekelijks, ongeveer 7 tot 11 opdrachten. Elke opdracht telt even zwaar en wordt beoordeeld van 0 tot 5; de opgetelde score bepaalt dit onderdeel volledig — er vallen er dus géén af. Niet inleveren is een 0. AI gebruiken mag, mits je de bron noemt en je eigen begrip van het antwoord laat zien. De inleverdatums staan op NTU COOL en zijn ONBEKEND.",
      aantalMin: 7,
      aantalMax: 11,
      alleTellenMee: true,
      datums: null,
      onbekendeVelden: ["datums"],
      bron: "Lecture00_CourseOverview_03.pdf (collegeslides)",
      zekerheid: "ZEKER",
    },
    absentieregels: {
      tekst: "Minstens drie presentiecontroles, mogelijk meer dan één per week. Verlof uitsluitend vóór de les aanvragen via MyNTU; achteraf niet geaccepteerd. Bewijsstukken vereist behalve bij mentale gezondheid en menstruatieverlof. Weken 12 t/m 16 gelden als tentamenperiode; dan alleen bepaalde verlofsoorten. Geen losse tentamendatum, weken 14-16 zijn projectpresentaties.",
      bron: "NTU-cursuspagina",
      zekerheid: "ZEKER",
    },
    groepsproject: {
      tekst: "Groepen van 4 tot 6 studenten, bij voorkeur uit verschillende studierichtingen. Kies een onderwerp uit je dagelijks leven, je studie of je onderzoek; weersvoorspelling, eetadvies, doelloos scrapen, automatisch tickets boeken en machine learning/deep learning worden afgeraden wegens gebrek aan originaliteit. Verdeling binnen de 25%: groepsleden doorgeven 3%, voorstel + video 1%, creativiteit/haalbaarheid/breedte 3%, beoordeling van groepsgenoten 8%, verslag 10%. De mondelinge presentatie is optioneel en levert maximaal 5% bonus op, voor maximaal 8 groepen. Te laat inleveren kost 1% per halve dag, tot 100%.",
      groepsgrootteMin: 4,
      groepsgrootteMax: 6,
      vormingstermijn: "2026-10-09",
      onbekendeVelden: [],
      bron: "Lecture00_CourseOverview_03.pdf (collegeslides)",
      zekerheid: "ZEKER",
    },
    // Drie afzonderlijke cursusrestricties uit VAKKEN.md §4 — eerder stond hier
    // alleen de tweede (cijfergrens); de uitsluitingsregel (#1) en de
    // goedkeuringsbrief-eis (#3) ontbraken volledig.
    cursusrestricties: [
      {
        tekst: "Bachelorstudenten met een hoofd- of tweede hoofdvak in een afdeling van het College of Electrical Engineering and Computer Science mogen dit vak niet volgen (bijvak uitgezonderd). Overtreding betekent een F voor het hele vak.",
        bron: "VAKKEN.md §4",
        zekerheid: "ZEKER",
      },
      {
        tekst: "Studenten met een hoofd-, tweede of bijvak in een afdeling die programmeervakken aanbiedt krijgen een strengere cijfergrens (syllabus-voorbeeld: 95+ i.p.v. 90+ voor een A+). Of dit op civiele techniek van toepassing is, is niet vastgesteld.",
        bron: "NTU-cursuspagina",
        zekerheid: "TE VERIFIËREN",
      },
      {
        tekst: "Master- en PhD-studenten hebben een ondertekende goedkeuringsbrief van hun begeleider of afdelingshoofd nodig.",
        bron: "VAKKEN.md §4",
        zekerheid: "ZEKER",
      },
    ],
  },
];
