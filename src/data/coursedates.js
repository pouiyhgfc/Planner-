/**
 * Losse datums en deadlines per vak, uit DATA.md §3.1, §3.2, §3.3, §3.4, §3.5.
 * psyDates / agtechDates / rteDates / pythonDates bevatten precies de
 * lesdagen (incl. tentamens) van dat vak — dit zijn de tellingen die
 * validate.mjs controleert (16 elk).
 */

import { rangeDays, dayOfWeek } from "../lib/date.js";
import { holidayDates } from "./holidays.js";

const BRON_PSY = "syllabus PSY1007-09";
const BRON_AGTECH = "presentatie 20260910-_Global_AgTech_Foresight.pdf";
const BRON_RTE = "2026-NTU_RTE_Syllabus_ver_1.docx";
const BRON_PY = "NTU-cursuspagina (FASE-8-1.md 0B, correctie 2)";

// lezen (FASE-9.md A3): alleen deze elf weken hebben een leeshoofdstuk uit de
// syllabus. Weken 1, 7, 8, 15, 16 hebben er geen — geen veld, geen gok.
export const psyDates = [
  { date: "2026-09-09", week: 1, type: "les", course: "PSY", label: "Introductie / syllabus", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-16", week: 2, type: "les", course: "PSY", label: "Introduction to Psychology", lezen: "hoofdstuk 1", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-23", week: 3, type: "les", course: "PSY", label: "Research in Psychology", lezen: "hoofdstuk 2", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-30", week: 4, type: "les", course: "PSY", label: "Lifespan Development", lezen: "hoofdstuk 14", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-07", week: 5, type: "les", course: "PSY", label: "Stress and Health", lezen: "hoofdstuk 15", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-14", week: 6, type: "les", course: "PSY", label: "Consciousness", lezen: "hoofdstuk 5", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-21", week: 7, type: "les", course: "PSY", label: "Review", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-28", week: 8, type: "tentamen", course: "PSY", label: "Midterm Exam (35%)", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-04", week: 9, type: "les", course: "PSY", label: "Learning", lezen: "hoofdstuk 6", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-11", week: 10, type: "les", course: "PSY", label: "Memory", lezen: "hoofdstuk 7", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-18", week: 11, type: "les", course: "PSY", label: "Sensation and Perception", lezen: "hoofdstuk 4", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-25", week: 12, type: "les", course: "PSY", label: "Personality", lezen: "hoofdstuk 12", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-02", week: 13, type: "les", course: "PSY", label: "Psychological Disorders", lezen: "hoofdstuk 16", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-09", week: 14, type: "les", course: "PSY", label: "Motivation & Emotion", lezen: "hoofdstuk 11", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-16", week: 15, type: "les", course: "PSY", label: "Review", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-23", week: 16, type: "tentamen", course: "PSY", label: "Final Exam (35%)", bron: BRON_PSY, zekerheid: "ZEKER" },
];

// Sprekers uit VAKKEN.md §5 — daar staat ook een spreker-kolom die coursedates.js
// eerder niet vastlegde. null waar VAKKEN.md zelf "ONBEKEND" zegt (uitgenodigde
// sprekers bij "Invited talk") of geen spreker noemt (excursie, TBA).
//
// Week 5 en 6 stonden hier ingekort ten opzichte van de weekindeling in het
// brondocument zelf ("... Agriculture" zonder System, "field monitoring"
// i.p.v. "From Field Plant Monitoring"). Nu letterlijk overgenomen uit de
// tabel op pagina 3 van de presentatie.
export const agtechDates = [
  { date: "2026-09-10", week: 1, type: "les", course: "AGTECH", label: "Course introduction", spreker: "Chih-Wei Tung", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-09-17", week: 2, type: "les", course: "AGTECH", label: "From domestication to design crops", spreker: "Chih-Wei Tung", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-09-24", week: 3, type: "les", course: "AGTECH", label: "Invited talk", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-01", week: 4, type: "les", course: "AGTECH", label: "Smart technologies in Taiwan Vanilla Lab", spreker: "George Lin / Li-Yu Liu", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-08", week: 5, type: "les", course: "AGTECH", label: "Intelligent Circular Controlled Environment Agriculture System", spreker: "Kuan-Chong Ting", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-15", week: 6, type: "les", course: "AGTECH", label: "Smart Agriculture: From Field Plant Monitoring to Postharvest Quality Evaluation", spreker: "Shih-Fang Chen", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-22", week: 7, type: "les", course: "AGTECH", label: "Invited talk", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-29", week: 8, type: "les", course: "AGTECH", label: "Global Pest Management Technologies and Trends", spreker: "Yu-Hsien Lin", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-05", week: 9, type: "les", course: "AGTECH", label: "Pepper Breeding for Smallholder Farmers", spreker: "Derek Barchenger", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-12", week: 10, type: "les", course: "AGTECH", label: "Unlocking the Infinite Possibilities of Agriculture using FarmiSpace", spreker: "DATAYOO Company", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-19", week: 11, type: "les", course: "AGTECH", label: "Plant-Microbe Interactions and Green Biotechnology", spreker: "Chiu-Ping Cheng", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-26", week: 12, type: "les", course: "AGTECH", label: "Invited talk", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-03", week: 13, type: "les", course: "AGTECH", label: "Applications of Plant Phenology and Crop Modeling", spreker: "Li-Yu Liu", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-10", week: 14, type: "les", course: "AGTECH", label: "On-site visit", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-17", week: 15, type: "les", course: "AGTECH", label: "Student presentations", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-24", week: 16, type: "les", course: "AGTECH", label: "TBA", spreker: null, bron: BRON_AGTECH, zekerheid: "ZEKER" },
];

// vorm (FASE-9.md A3): "in de les" of "discussietijd", conform de kolom
// "Lecture Style" in 2026-NTU_RTE_Syllabus_ver_1.docx (door Idries
// aangeleverd, correctie op de eerdere "ONBEKEND overal"-aanname toen die
// syllabus nog niet beschikbaar was — zie DATA.md §9-1h). "In-Class" ->
// "in de les", "Schedule Discussion Time" -> "discussietijd". Weken 9 en 11
// staan leeg in de syllabus zelf: vorm: null (ONBEKEND), niet gegokt.
export const rteDates = [
  { date: "2026-09-10", week: 1, type: "les", course: "RTE", label: "Syllabus", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-17", week: 2, type: "les", course: "RTE", label: "Quiz 1 + Intro to Rail Transportation", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-24", week: 3, type: "les", course: "RTE", label: "Infrastructure – Elements I", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-01", week: 4, type: "les", course: "RTE", label: "Infrastructure – Elements II", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", week: 5, type: "les", course: "RTE", label: "Special Track Work & WCML", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", week: 6, type: "les", course: "RTE", label: "Station and Yard", vorm: "discussietijd", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-22", week: 7, type: "les", course: "RTE", label: "Rolling Stock – Car Types & Coupler", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-29", week: 8, type: "les", course: "RTE", label: "Term Project Discussion I", vorm: "discussietijd", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-05", week: 9, type: "les", course: "RTE", label: "Rolling Stock – Bogie & Brake", vorm: null, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-12", week: 10, type: "les", course: "RTE", label: "Signal & Train Control", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-19", week: 11, type: "les", course: "RTE", label: "Technical Visit", vorm: null, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-26", week: 12, type: "les", course: "RTE", label: "Term Project Discussion II", vorm: "discussietijd", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-03", week: 13, type: "les", course: "RTE", label: "Quiz 2 + Brakeless or Unstoppable", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-10", week: 14, type: "les", course: "RTE", label: "Term Project Presentations", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-17", week: 15, type: "les", course: "RTE", label: "Term Project Presentations", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-24", week: 16, type: "tentamen", course: "RTE", label: "Comprehensive Exam (25%)", vorm: "in de les", bron: BRON_RTE, zekerheid: "ZEKER" },
];

/**
 * Elke woensdag 2026-09-09 t/m 2026-12-23. Datums zijn generatie-consistent
 * (validate.mjs vergelijkt ze met weekdag + semestergrenzen, zonder
 * feestdag-uitzonderingen — geen enkele feestdag valt op een woensdag), maar
 * de onderwerpen zijn letterlijke syllabusdata en dus getypt, niet afgeleid.
 */
export const pythonDates = [
  { date: "2026-09-09", week: 1, type: "les", course: "PY", label: "Course Introduction and Google Colab", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-09-16", week: 2, type: "les", course: "PY", label: "Your First Python Program", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-09-23", week: 3, type: "les", course: "PY", label: "Basic Types in Python", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-09-30", week: 4, type: "les", course: "PY", label: "More Python Types", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-10-07", week: 5, type: "les", course: "PY", label: "More Python Types", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-10-14", week: 6, type: "les", course: "PY", label: "Self-defined Functions", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-10-21", week: 7, type: "les", course: "PY", label: "Control Flow", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-10-28", week: 8, type: "les", course: "PY", label: "Text Processing", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-11-04", week: 9, type: "les", course: "PY", label: "Nested Structure", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-11-11", week: 10, type: "les", course: "PY", label: "Something just like vectors and matrices: NumPy", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-11-18", week: 11, type: "les", course: "PY", label: "Something just like spreadsheets: Pandas", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-11-25", week: 12, type: "les", course: "PY", label: "Invited Speaker (TBD)", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-12-02", week: 13, type: "les", course: "PY", label: "Invited Speaker (TBD)", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-12-09", week: 14, type: "les", course: "PY", label: "Project Presentation", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-12-16", week: 15, type: "les", course: "PY", label: "Project Presentation", bron: BRON_PY, zekerheid: "ZEKER" },
  { date: "2026-12-23", week: 16, type: "les", course: "PY", label: "Project Presentation", bron: BRON_PY, zekerheid: "ZEKER" },
];

/**
 * Deadlines/acties uit de "Deadline / actie"-kolom van DATA.md §3.3.
 * Los van rteDates zodat de lesdag-telling (16) hierdoor niet verstoord wordt.
 * harde: true (FASE-9.md B5) — dit zijn concrete cursusverplichtingen (in
 * te leveren of in de les), geen algemene NTU-kalenderregel — zie ook de
 * toelichting bij academicDeadlines in deadlines.js.
 */
export const rteActionItems = [
  { date: "2026-09-24", type: "deadline", course: "RTE", label: "Term project topic + groepen (5 pers.)", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-24", type: "deadline", course: "RTE", label: "Assignment #1 draft PPT", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-01", type: "deadline", course: "RTE", label: "Assignment #2 uitgegeven", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", type: "deadline", course: "RTE", label: "Assignment #2 due", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", type: "deadline", course: "RTE", label: "Assignment #3 in-class", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Term project draft PPT due", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Assignment #1 due", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Assignment #4 uitgegeven", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-22", type: "deadline", course: "RTE", label: "Assignment #4 due", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-05", type: "deadline", course: "RTE", label: "Assignment #5 in-class", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-12", type: "deadline", course: "RTE", label: "2e draft PPT due", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-19", type: "deadline", course: "RTE", label: "Assignment #7 (visit)", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-03", type: "deadline", course: "RTE", label: "Assignment #6 in-class", harde: true, bron: BRON_RTE, zekerheid: "ZEKER" },
];

/**
 * General Chinese wordt NIET als lijst ingevoerd (DATA.md §3.4): gegenereerd
 * uit weekdag (ma=0, wo=2) + semestergrenzen (2026-09-07 → 2026-12-23) minus
 * feestdagen. De controlelijst in DATA.md (14 ma, 16 wo, 30 totaal) dient
 * alleen om deze generator te verifiëren in validate.mjs — wijkt de uitkomst
 * af, dan is de feestdagenlijst of deze generator fout. Het vak loopt door
 * tot in de officiële eindtentamenweek (2026-12-23), niet tot 2026-12-18
 * (die oude einddatum was fout — CORRECTIE-CHINEES.md).
 * @returns {{date: string, type: string, course: string, label: string, bron: string, zekerheid: string}[]}
 */
export function generateChineseLessons() {
  const start = "2026-09-07";
  const end = "2026-12-23";
  const excluded = new Set(holidayDates());
  const bron = "afgeleid: DATA.md §3.4 (weekdag + semestergrenzen − feestdagen)";
  return rangeDays(start, end)
    .filter((ymd) => (dayOfWeek(ymd) === 0 || dayOfWeek(ymd) === 2) && !excluded.has(ymd))
    .map((ymd) => ({
      date: ymd,
      type: "les",
      course: "CHI",
      label: "General Chinese",
      bron,
      zekerheid: "TE VERIFIËREN",
    }));
}

export const chineseLessons = generateChineseLessons();

const BRON_CHI_TENTAMENS = "FASE-9.md A1 (opgave Idries, bevestigd bij docent 何宣瑩)";

const TENTAMEN_WEGING_TOELICHTING = "Weging geldt voor het hele tentamen (midterm 20% / final 25%). Onderverdeling over mondeling/schriftelijk/presentatie is ONBEKEND — niet gedeeld door drie.";

/**
 * Zes losse tentamenonderdelen (DATA.md §3.4, correctie FASE-9.md A1) —
 * vervangt de oudere "mogelijk tentamenmoment"-aanname (twee kandidaatdagen
 * per tentamen, dag onbekend). Elk onderdeel staat op een eigen, bevestigde
 * datum. Deze items staan LOS van chineseLessons: die generator blijft
 * gewoon 30 lessessies opleveren (hij kent geen tentamens), dus elke datum
 * hieronder heeft zowel een gegenereerde "les"- als een "tentamen"-item.
 */
export const chineseTentamens = [
  { date: "2026-10-28", week: 8, type: "tentamen", course: "CHI", tentamen: "midterm", onderdeel: "mondeling", label: "Midterm — mondeling (20%)", weging: 20, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
  { date: "2026-11-02", week: 9, type: "tentamen", course: "CHI", tentamen: "midterm", onderdeel: "schriftelijk", label: "Midterm — schriftelijk (20%)", weging: 20, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
  { date: "2026-11-04", week: 9, type: "tentamen", course: "CHI", tentamen: "midterm", onderdeel: "presentatie", label: "Midterm — presentatie (20%)", weging: 20, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
  { date: "2026-12-16", week: 15, type: "tentamen", course: "CHI", tentamen: "final", onderdeel: "mondeling", label: "Final — mondeling (25%)", weging: 25, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
  { date: "2026-12-21", week: 16, type: "tentamen", course: "CHI", tentamen: "final", onderdeel: "schriftelijk", label: "Final — schriftelijk (25%)", weging: 25, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
  { date: "2026-12-23", week: 16, type: "tentamen", course: "CHI", tentamen: "final", onderdeel: "presentatie", label: "Final — presentatie (25%)", weging: 25, wegingToelichting: TENTAMEN_WEGING_TOELICHTING, bron: BRON_CHI_TENTAMENS, zekerheid: "ZEKER" },
];

/**
 * Eén canonieme lijst van alle vakitems (lessen + tentamens), gebruikt door
 * zowel lib/dayStatus.js als ui/overzichtData.js — voorheen hield elk zijn
 * eigen kopie bij en miste overzichtData.js chineseTentamens, waardoor de
 * Chinese tentamens niet meetelden in het scherm "Overzicht" (FASE-9.md B3,
 * gevonden bij het bouwen van de Tentamens-sectie op het scherm "Vakken").
 */
export const alleVakItems = [...psyDates, ...agtechDates, ...rteDates, ...pythonDates, ...chineseLessons, ...chineseTentamens];
