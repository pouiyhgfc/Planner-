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
    onbekendeVelden: [],
    bron: "syllabus PSY1007-09",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Midterm 35%, final 35%, 4 opdrachten 20%, participatie 10%. Te laat inleveren: −10% per dag inclusief weekend, na 1 week geen punten. Tentamens niet cumulatief. Gemist tentamen zonder documentatie = 0.",
      bron: "syllabus PSY1007-09",
      zekerheid: "ZEKER",
    },
  },
  {
    id: "AGTECH",
    code: "946 U0060 (ser. 52089)",
    name: "Global AgTech Foresight",
    weekdays: [3], // donderdag
    start: "09:10",
    end: "12:10",
    room: null,
    onbekendeVelden: ["room"],
    bron: "presentatie 20260910-_Global_AgTech_Foresight.pdf",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Aanwezigheid 30%, participatie 30%, presentatie/opdracht 40%. −15 punten per absentie. −5 punten bij 10–15 min te laat, −10 punten bij >15 min te laat. −10 punten per goedgekeurde (ziekte)verlofaanvraag via het online systeem. Participatie: vraag stellen = 5 punten/week, maximaal 30.",
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
    onbekendeVelden: [],
    docent: "Yung-Cheng (Rex) Lai",
    bron: "2026-NTU_RTE_Syllabus_ver_1.docx",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Huiswerk 30% (beste 5 van 7, geen uitstel), term project 25%, 2 quizzes 20%, comprehensive exam 25%, participatie 5%. Klasregels: geen laat huiswerk, geen telefoon, geen eten.",
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
    onbekendeVelden: [],
    opmerking: "3 studiepunten, keuzevak, voertaal Chinees met Engels als hulptaal, lesmateriaal Practical Audio-Visual Chinese 1 (les 1-6), alleen voor internationale studenten. Dag/zaal-conflict met een tegenstrijdig Course Description-blok (di/do, zaal 普406) is opgelost ten gunste van ma/wo — zie DATA.md §3.4.",
    bron: "NTU Course-pagina + syllabus PTCSL7908-23",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Aanwezigheid/participatie 15%, huiswerk 20%, quizzen/toetsen 20%, midterm 20%, final 25%. Huiswerk te laat: −10 punten, na 1 week 0. Dictee-quizzen geen herkansing, beste 15 tellen. Midterm+final (45%) geen ruime regeling: herkansing alleen met melding ≥1 dag vooraf, medische verklaring en afgeronde online verlofprocedure, dan binnen 3 dagen — anders 0 punten. Gedragsregels: vanaf de 4e waarschuwing −1 punt (telt onder aanwezigheid).",
      bron: "syllabus PTCSL7908-23",
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
];
