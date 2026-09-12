/**
 * Losse datums en deadlines per vak, uit DATA.md §3.1, §3.2, §3.3, §3.4.
 * psyDates / agtechDates / rteDates bevatten precies de lesdagen (incl.
 * tentamens) van dat vak — dit zijn de tellingen die validate.mjs
 * controleert (16 elk).
 */

import { rangeDays, dayOfWeek } from "../lib/date.js";
import { holidayDates } from "./holidays.js";

const BRON_PSY = "syllabus PSY1007-09";
const BRON_AGTECH = "presentatie 20260910-_Global_AgTech_Foresight.pdf";
const BRON_RTE = "2026-NTU_RTE_Syllabus_ver_1.docx";

export const psyDates = [
  { date: "2026-09-09", week: 1, type: "les", course: "PSY", label: "Introductie / syllabus", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-16", week: 2, type: "les", course: "PSY", label: "Introduction to Psychology", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-23", week: 3, type: "les", course: "PSY", label: "Research in Psychology", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-09-30", week: 4, type: "les", course: "PSY", label: "Lifespan Development", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-07", week: 5, type: "les", course: "PSY", label: "Stress and Health", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-14", week: 6, type: "les", course: "PSY", label: "Consciousness", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-21", week: 7, type: "les", course: "PSY", label: "Review", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-10-28", week: 8, type: "tentamen", course: "PSY", label: "Midterm Exam (35%)", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-04", week: 9, type: "les", course: "PSY", label: "Learning", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-11", week: 10, type: "les", course: "PSY", label: "Memory", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-18", week: 11, type: "les", course: "PSY", label: "Sensation and Perception", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-11-25", week: 12, type: "les", course: "PSY", label: "Personality", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-02", week: 13, type: "les", course: "PSY", label: "Psychological Disorders", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-09", week: 14, type: "les", course: "PSY", label: "Motivation & Emotion", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-16", week: 15, type: "les", course: "PSY", label: "Review", bron: BRON_PSY, zekerheid: "ZEKER" },
  { date: "2026-12-23", week: 16, type: "tentamen", course: "PSY", label: "Final Exam (35%)", bron: BRON_PSY, zekerheid: "ZEKER" },
];

export const agtechDates = [
  { date: "2026-09-10", week: 1, type: "les", course: "AGTECH", label: "Course introduction", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-09-17", week: 2, type: "les", course: "AGTECH", label: "From domestication to design crops", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-09-24", week: 3, type: "les", course: "AGTECH", label: "Invited talk", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-01", week: 4, type: "les", course: "AGTECH", label: "Smart technologies in Taiwan Vanilla Lab", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-08", week: 5, type: "les", course: "AGTECH", label: "Intelligent Circular Controlled Environment Agriculture", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-15", week: 6, type: "les", course: "AGTECH", label: "Smart Agriculture: field monitoring → postharvest", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-22", week: 7, type: "les", course: "AGTECH", label: "Invited talk", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-10-29", week: 8, type: "les", course: "AGTECH", label: "Global Pest Management Technologies", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-05", week: 9, type: "les", course: "AGTECH", label: "Pepper Breeding for Smallholder Farmers", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-12", week: 10, type: "les", course: "AGTECH", label: "FarmiSpace / DATAYOO", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-19", week: 11, type: "les", course: "AGTECH", label: "Plant-Microbe Interactions", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-11-26", week: 12, type: "les", course: "AGTECH", label: "Invited talk", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-03", week: 13, type: "les", course: "AGTECH", label: "Plant Phenology and Crop Modeling", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-10", week: 14, type: "les", course: "AGTECH", label: "On-site visit", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-17", week: 15, type: "les", course: "AGTECH", label: "Student presentations", bron: BRON_AGTECH, zekerheid: "ZEKER" },
  { date: "2026-12-24", week: 16, type: "les", course: "AGTECH", label: "TBA", bron: BRON_AGTECH, zekerheid: "ZEKER" },
];

export const rteDates = [
  { date: "2026-09-10", week: 1, type: "les", course: "RTE", label: "Syllabus", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-17", week: 2, type: "les", course: "RTE", label: "Quiz 1 + Intro to Rail Transportation", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-24", week: 3, type: "les", course: "RTE", label: "Infrastructure – Elements I", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-01", week: 4, type: "les", course: "RTE", label: "Infrastructure – Elements II", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", week: 5, type: "les", course: "RTE", label: "Special Track Work & WCML", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", week: 6, type: "les", course: "RTE", label: "Station and Yard", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-22", week: 7, type: "les", course: "RTE", label: "Rolling Stock – Car Types & Coupler", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-29", week: 8, type: "les", course: "RTE", label: "Term Project Discussion I", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-05", week: 9, type: "les", course: "RTE", label: "Rolling Stock – Bogie & Brake", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-12", week: 10, type: "les", course: "RTE", label: "Signal & Train Control", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-19", week: 11, type: "les", course: "RTE", label: "Technical Visit", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-26", week: 12, type: "les", course: "RTE", label: "Term Project Discussion II", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-03", week: 13, type: "les", course: "RTE", label: "Quiz 2 + Brakeless or Unstoppable", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-10", week: 14, type: "les", course: "RTE", label: "Term Project Presentations", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-17", week: 15, type: "les", course: "RTE", label: "Term Project Presentations", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-24", week: 16, type: "tentamen", course: "RTE", label: "Comprehensive Exam (25%)", bron: BRON_RTE, zekerheid: "ZEKER" },
];

/**
 * Deadlines/acties uit de "Deadline / actie"-kolom van DATA.md §3.3.
 * Los van rteDates zodat de lesdag-telling (16) hierdoor niet verstoord wordt.
 */
export const rteActionItems = [
  { date: "2026-09-24", type: "deadline", course: "RTE", label: "Term project topic + groepen (5 pers.)", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-09-24", type: "deadline", course: "RTE", label: "Assignment #1 draft PPT", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-01", type: "deadline", course: "RTE", label: "Assignment #2 uitgegeven", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", type: "deadline", course: "RTE", label: "Assignment #2 due", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-08", type: "deadline", course: "RTE", label: "Assignment #3 in-class", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Term project draft PPT due", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Assignment #1 due", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-15", type: "deadline", course: "RTE", label: "Assignment #4 uitgegeven", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-10-22", type: "deadline", course: "RTE", label: "Assignment #4 due", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-05", type: "deadline", course: "RTE", label: "Assignment #5 in-class", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-12", type: "deadline", course: "RTE", label: "2e draft PPT due", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-11-19", type: "deadline", course: "RTE", label: "Assignment #7 (visit)", bron: BRON_RTE, zekerheid: "ZEKER" },
  { date: "2026-12-03", type: "deadline", course: "RTE", label: "Assignment #6 in-class", bron: BRON_RTE, zekerheid: "ZEKER" },
];

/**
 * General Chinese wordt NIET als lijst ingevoerd (DATA.md §3.4): gegenereerd
 * uit weekdag (ma=0, wo=2) + semestergrenzen (2026-09-07 → 2026-12-18) minus
 * feestdagen. De controlelijst in DATA.md (13 ma, 15 wo, 28 totaal) dient
 * alleen om deze generator te verifiëren in validate.mjs — wijkt de uitkomst
 * af, dan is de feestdagenlijst of deze generator fout.
 * @returns {{date: string, type: string, course: string, label: string, bron: string, zekerheid: string}[]}
 */
export function generateChineseLessons() {
  const start = "2026-09-07";
  const end = "2026-12-18";
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

/**
 * Twee lege, zichtbaar gemarkeerde tentamenslots (DATA.md §3.4). date: null
 * omdat er geen datum bekend is — dit wordt in de UI getoond als
 * "datum onbekend", nooit als een gok. Tellen niet mee als bezet dagdeel
 * zolang zekerheid TE VERIFIËREN blijft.
 */
export const chineseExamSlots = [
  {
    date: null,
    type: "tentamen",
    course: "CHI",
    label: "Chinees midterm — datum onbekend",
    toelichting: "Enige kandidaat in de midterm-week 2026-10-26 → 10-30: maandag 10-26 is feestdag, vak valt alleen op ma/wo. Kandidaat-datum 2026-10-28 (wo, avond) valt samen met de PSY-midterm.",
    bron: "DATA.md §3.4",
    zekerheid: "TE VERIFIËREN",
  },
  {
    date: null,
    type: "tentamen",
    course: "CHI",
    label: "Chinees eindtentamen — datum onbekend",
    toelichting: "Tentamenweek 2026-12-21 → 12-25. Kandidaat-datums 2026-12-21 (ma) of 2026-12-23 (wo, samen met PSY-final). De gegenereerde leslijst stopt op 2026-12-18, dus deze datums zitten niet in chineseLessons.",
    bron: "DATA.md §3.4",
    zekerheid: "TE VERIFIËREN",
  },
];
