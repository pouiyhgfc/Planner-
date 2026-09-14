/**
 * Vaste weekstructuur (lesrooster 115-1) uit DATA.md §1.
 * weekdays gebruikt dezelfde codering als lib/date.js dayOfWeek(): 0 = maandag.
 * onbekendeVelden noemt de velden binnen dit record die ONBEKEND zijn
 * (DATA.md §9) — die velden staan hieronder op `null`, nooit gegokt.
 */

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
    studiepunten: null,
    onbekendeVelden: ["studiepunten"],
    opmerking: "Docentnaam komt uit VAKKEN.md §3 — de syllabus zelf noemt geen naam, alleen dat de docent het recht op wijziging behoudt.",
    bron: "syllabus PSY1007-09",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Midterm 35%, final 35%, 4 opdrachten 20%, participatie 10%. Te laat inleveren: −10% per dag inclusief weekend, na 1 week geen punten. Tentamens niet cumulatief. Gemist tentamen zonder documentatie = 0.",
      weging: [
        { label: "Midterm", percentage: 35 },
        { label: "Final", percentage: 35 },
        { label: "Opdrachten (4x)", percentage: 20 },
        { label: "Participatie", percentage: 10 },
      ],
      bron: "syllabus PSY1007-09",
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
    studiepunten: null,
    onbekendeVelden: ["code", "room", "studiepunten"],
    opmerking: "De eerder aangenomen code 946 U0060 (ser. 52089) bleek bij Computer Programming in Python te horen, niet bij AgTech — FASE-8-1.md 0B, correctie 1. AgTech's eigen code is ONBEKEND. Docentnaam (Chih-Wei Tung) komt uit VAKKEN.md §5, eerder ONBEKEND.",
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
    studiepunten: null,
    onbekendeVelden: ["studiepunten"],
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
      tekst: "Aanwezigheid/participatie 15%, huiswerk 20%, quizzen/toetsen 20%, midterm 20%, final 25%. Huiswerk te laat: −10 punten, na 1 week 0. Dictee-quizzen geen herkansing, beste 15 tellen. Midterm+final (45%) geen ruime regeling: herkansing alleen met melding ≥1 dag vooraf, medische verklaring en afgeronde online verlofprocedure, dan binnen 3 dagen — anders 0 punten. Gedragsregels: vanaf de 4e waarschuwing −1 punt (telt onder aanwezigheid).",
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
      tekst: "Vanaf week 4 worden quizzes, weektoetsen en huiswerk gegeven; de beste 15 resultaten tellen mee. Exacte datums staan op NTU COOL.",
      vanafWeek: 4,
      besteAantalTelt: 15,
      datums: null,
      onbekendeVelden: ["datums"],
      bron: "FASE-9.md A1 (opgave Idries, bevestigd bij docent)",
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
    inschrijving: "onbevestigd",
    opmerking: "Inschrijving liep via een Google Form, deadline 2026-09-13 09:13 (Taipei) inmiddels verstreken; permissienummers worden verloot, uitkomst onbekend. Telt desondanks wel mee in de bezetting van woensdagmiddag totdat de status wijzigt (DATA.md §3.5). Half jaar, max. 80 studenten.",
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
    absentieregels: {
      tekst: "Minstens drie presentiecontroles, mogelijk meer dan één per week. Verlof uitsluitend vóór de les aanvragen via MyNTU; achteraf niet geaccepteerd. Bewijsstukken vereist behalve bij mentale gezondheid en menstruatieverlof. Weken 12 t/m 16 gelden als tentamenperiode; dan alleen bepaalde verlofsoorten. Geen losse tentamendatum, weken 14-16 zijn projectpresentaties.",
      bron: "NTU-cursuspagina",
      zekerheid: "ZEKER",
    },
    groepsproject: {
      tekst: "Verplicht in groepsverband, individueel werk niet geaccepteerd. Geen groep binnen de termijn vormen betekent een F voor het hele vak. Groepsgrootte en vormingstermijn worden in de les aangekondigd.",
      groepsgrootte: null,
      vormingstermijn: null,
      onbekendeVelden: ["groepsgrootte", "vormingstermijn"],
      bron: "NTU-cursuspagina",
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
