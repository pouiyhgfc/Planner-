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
    code: null,
    name: "General Chinese",
    weekdays: [0, 2], // maandag en woensdag
    start: "18:00",
    end: "21:00",
    room: null,
    docent: null,
    onbekendeVelden: ["code", "docent", "room"],
    opmerking: "Zekerheid geldt voor dag en tijd. code/docent/zaal zijn ONBEKEND (DATA.md §9.1b) en staan daarom op null.",
    bron: "opgave Idries",
    zekerheid: "ZEKER",
    beoordeling: {
      tekst: "Absentiebeleid en weging ONBEKEND.",
      bron: "opgave Idries",
      zekerheid: "ONBEKEND",
    },
  },
];
