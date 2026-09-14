import { parseYMD, toYMD, addDays, dayOfWeek, isoWeek, rangeDays, diffDays } from "../src/lib/date.js";
import { appPeriod, timezone, week12, semesterMarkers, calendarNotes } from "../src/data/semester.js";
import { holidays } from "../src/data/holidays.js";
import { courses } from "../src/data/courses.js";
import { psyDates, agtechDates, rteDates, pythonDates, rteActionItems, chineseLessons, chineseTentamens } from "../src/data/coursedates.js";
import { trips, effectieveTripStatus, TRIP_STATUSSEN } from "../src/data/trips.js";
import { chinaVisaFreeDeadline, flexWeekAnnouncementDeadline, academicDeadlines, japanUitersteTerugkomstDeadline } from "../src/data/deadlines.js";
import { dayStatus, genereerKalenderDagen } from "../src/lib/dayStatus.js";
import { isFree, freeBlocks, blocksWithCost, costOfRange } from "../src/lib/blocks.js";
import {
  leegState,
  migrate,
  valideerItem,
  valideerProject,
  CURRENT_SCHEMA_VERSION,
  SCHERMEN,
  PERIODES,
  PYTHON_INSCHRIJVING_WAARDEN,
} from "../src/state/schema.js";
import {
  voegItemToe,
  verwijderItem,
  zetDeadlineAfgevinkt,
  zetMijlpaalAfgevinkt,
  voegProjectToe,
  verwijderProject,
  zetPythonInschrijving,
  zetVakVeld,
  zetTripStatus,
  huidigeYMD,
  bereidExportVoor,
  bereidSamenvoegingVoor,
  pasConflictKeuzesToe,
} from "../src/state/store.js";
import { chinaAftelling, flexWeekStatus, cnyDrukte, resterendeBlokken, absentieTotaal } from "../src/lib/overzicht.js";
import { seizoensdataLabel } from "../src/data/season.js";
import { kortDatum, collegeWeek } from "../src/ui/datumlabels.js";
import { maandWeken, isStipMoment } from "../src/ui/maandGrid.js";
import { deadlineSleutel } from "../src/ui/dagblad.js";
import { maandagVan, weekAantal, weekStarts, verschuifVenster, dagdelenMetKleur } from "../src/ui/wekenGrid.js";
import { projects } from "../src/data/projects.js";
import { lesoverzicht, gemisteSessies, chineseAbsentieStand } from "../src/ui/vakkenData.js";
import {
  volgendeTentamenOfPresentatie,
  aantalOpenstaandeDeadlines,
  mijlpaalSleutel,
  rijenSchooldagen,
  rijenTentamens,
  rijenDeadlines,
  rijenProjecten,
  rijenFeestdagen,
  rijenEigenItems,
  rijenVrijeBlokken,
} from "../src/ui/overzichtData.js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
let passed = 0;

/**
 * @param {string} name
 * @param {unknown} actual
 * @param {unknown} expected
 */
function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
  } else {
    failures++;
    console.error(`FAIL  ${name}\n      verwacht: ${e}\n      gekregen: ${a}`);
  }
}

// --- parseYMD / toYMD roundtrip ---
check("parseYMD/toYMD roundtrip", toYMD(parseYMD("2026-09-01")), "2026-09-01");

// --- addDays: maandgrens, jaargrens, schrikkeljaar ---
check('addDays("2026-12-31", 1) jaargrens', addDays("2026-12-31", 1), "2027-01-01");
check('addDays("2027-02-28", 1) geen schrikkeljaar 2027', addDays("2027-02-28", 1), "2027-03-01");
check('addDays("2026-10-31", 1) maandgrens', addDays("2026-10-31", 1), "2026-11-01");
check('addDays("2026-09-01", 180) app-periode', addDays("2026-09-01", 180), "2027-02-28");

// --- diffDays ---
check('diffDays("2026-09-01", "2027-02-28")', diffDays("2026-09-01", "2027-02-28"), 180);

// --- dayOfWeek: alle datums uit PLAN.md fase 0, 0 = maandag ---
const DAG = { ma: 0, di: 1, wo: 2, do: 3, vr: 4, za: 5, zo: 6 };
const dayOfWeekCases = [
  ["2026-09-07", "ma"],
  ["2026-09-25", "vr"],
  ["2026-09-28", "ma"],
  ["2026-10-09", "vr"],
  ["2026-10-10", "za"],
  ["2026-10-25", "zo"],
  ["2026-10-26", "ma"],
  ["2026-10-28", "wo"],
  ["2026-10-29", "do"],
  ["2026-10-30", "vr"],
  ["2026-11-09", "ma"],
  ["2026-12-18", "vr"],
  ["2026-12-23", "wo"],
  ["2026-12-24", "do"],
  ["2026-12-25", "vr"],
  ["2026-12-31", "do"],
  ["2027-01-01", "vr"],
  ["2027-02-04", "do"],
  ["2027-02-09", "di"],
  ["2027-02-22", "ma"],
  ["2027-02-28", "zo"],
];
for (const [ymd, label] of dayOfWeekCases) {
  check(`dayOfWeek("${ymd}") === ${label}`, dayOfWeek(ymd), DAG[label]);
}

// --- rangeDays: precies 181 dagen voor de volledige app-periode ---
check('rangeDays("2026-09-01","2027-02-28").length', rangeDays("2026-09-01", "2027-02-28").length, 181);
check('rangeDays eerste dag', rangeDays("2026-09-01", "2027-02-28")[0], "2026-09-01");
check('rangeDays laatste dag', rangeDays("2026-09-01", "2027-02-28")[180], "2027-02-28");

// --- isoWeek: ISO-jaargrens rond 2026-12-31 / 2027-01-01 ---
// Handmatig gecontroleerd (Zeller's congruentie):
// 2026-12-31 is een donderdag en dag 365 van 2026 (geen schrikkeljaar).
// Een donderdag bepaalt zijn eigen ISO-jaar, dus isoYear = 2026.
// week = floor((365-1)/7)+1 = 53. Jaar 2026 heeft dus 53 ISO-weken
// (het jaar begint ook op donderdag: dag 1 en dag 365 liggen 364 = 52*7
// dagen uit elkaar, dus dezelfde weekdag).
check('isoWeek("2026-12-31")', isoWeek("2026-12-31"), { isoYear: 2026, week: 53 });
// 2027-01-01 is een vrijdag (isoDay 5). De donderdag van die kalenderweek
// is dus 2026-12-31 (dezelfde week als hierboven) -> isoYear blijft 2026,
// week blijft 53, ook al is de kalenderdatum al 2027.
check('isoWeek("2027-01-01") — jaargrens', isoWeek("2027-01-01"), { isoYear: 2026, week: 53 });

// =====================================================================
// Fase 1 — datalaag uit DATA.md
// =====================================================================

const ZEKERHEID_WAARDEN = ["ZEKER", "TE VERIFIËREN", "ONBEKEND"];

/**
 * Valideert dat een item een geldige bron + zekerheid heeft.
 * @param {string} label
 * @param {{bron?: string, zekerheid?: string}} item
 */
function checkBronZekerheid(label, item) {
  if (!item.bron) {
    failures++;
    console.error(`FAIL  ${label}: geen bron`);
  } else {
    passed++;
  }
  if (!ZEKERHEID_WAARDEN.includes(item.zekerheid)) {
    failures++;
    console.error(`FAIL  ${label}: ongeldige zekerheid "${item.zekerheid}"`);
  } else {
    passed++;
  }
}

const YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valideert een item met een kalenderdatum: date, of start+end als bereik,
 * binnen de app-periode — plus bron + zekerheid.
 * @param {string} label
 * @param {{date?: string|null, start?: string, end?: string, bron?: string, zekerheid?: string}} item
 */
function checkItem(label, item) {
  if (item.date !== undefined && item.date !== null) {
    checkDateInAppPeriod(`${label}: date`, item.date);
  }
  if (item.start !== undefined && YMD_PATTERN.test(item.start)) {
    checkDateInAppPeriod(`${label}: start`, item.start);
    checkDateInAppPeriod(`${label}: end`, item.end);
    if (diffDays(item.start, item.end) < 0) {
      failures++;
      console.error(`FAIL  ${label}: start (${item.start}) ligt na end (${item.end})`);
    } else {
      passed++;
    }
  }
  checkBronZekerheid(label, item);
}

/**
 * @param {string} label
 * @param {string} ymd
 */
function checkDateInAppPeriod(label, ymd) {
  try {
    parseYMD(ymd);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${label}: ${err.message}`);
    return;
  }
  const binnenPeriode = diffDays(appPeriod.start, ymd) >= 0 && diffDays(ymd, appPeriod.end) >= 0;
  if (binnenPeriode) {
    passed++;
  } else {
    failures++;
    console.error(`FAIL  ${label}: ${ymd} valt buiten de app-periode ${appPeriod.start} → ${appPeriod.end}`);
  }
}

check("appPeriod.days", appPeriod.days, 181);
check("timezone.user", timezone.user, "Asia/Taipei");
check("calendarNotes bevat opmerking 1 en 2", calendarNotes.length, 2);
for (const note of calendarNotes) checkItem("calendarNotes item", note);

for (const m of semesterMarkers) checkItem(`semesterMarkers: ${m.label}`, m);
checkItem("week12", week12);

for (const h of holidays) checkItem(`holidays: ${h.label}`, h);

for (const c of courses) {
  checkBronZekerheid(`courses: ${c.id}`, c);
  checkBronZekerheid(`courses: ${c.id}.beoordeling`, c.beoordeling);
  check(`courses: ${c.id}.start is HH:MM`, /^\d{2}:\d{2}$/.test(c.start), true);
  check(`courses: ${c.id}.end is HH:MM`, /^\d{2}:\d{2}$/.test(c.end), true);
  check(`courses: ${c.id}.beoordeling.weging is niet leeg`, c.beoordeling.weging.length > 0, true);
  check(
    `courses: ${c.id}.beoordeling.weging elk onderdeel heeft label + numerieke percentage`,
    c.beoordeling.weging.every((w) => typeof w.label === "string" && w.label.length > 0 && typeof w.percentage === "number"),
    true
  );
  if (c.absentieregels) {
    if (c.absentieregels.bron) {
      checkBronZekerheid(`courses: ${c.id}.absentieregels`, c.absentieregels);
    } else {
      for (const [naam, regel] of Object.entries(c.absentieregels)) {
        checkBronZekerheid(`courses: ${c.id}.absentieregels.${naam}`, regel);
      }
    }
  }
  if (c.groepsproject) checkBronZekerheid(`courses: ${c.id}.groepsproject`, c.groepsproject);
  if (c.cursusrestricties) {
    for (const [i, restrictie] of c.cursusrestricties.entries()) {
      checkBronZekerheid(`courses: ${c.id}.cursusrestricties[${i}]`, restrictie);
    }
  }
}

// General Chinese tijd is gecorrigeerd naar 18:25-21:05 (CORRECTIE-CHINEES.md)
{
  const chi = courses.find((c) => c.id === "CHI");
  check("CHI: onbekendeVelden is nu leeg (code/docent/zaal zijn ZEKER)", chi.onbekendeVelden.length, 0);
  check("CHI: start === 18:25", chi.start, "18:25");
  check("CHI: end === 21:05", chi.end, "21:05");
  check("CHI: puntenaftrek-vrijstelling === 6 uur", chi.absentieregels.puntenaftrek.vrijstellingUren, 6);
  check("CHI: faaldrempel === 1/3 van de sessies", chi.absentieregels.faaldrempel.drempelFractieSessies, 1 / 3);
}

// FASE-8-1.md 0B: AgTech-vakcode gecorrigeerd naar ONBEKEND, Python nieuw vak
{
  const agtech = courses.find((c) => c.id === "AGTECH");
  check("AGTECH: code is null (was foutief 946 U0060)", agtech.code, null);
  check("AGTECH: onbekendeVelden bevat code, room en studiepunten", [...agtech.onbekendeVelden].sort().join(","), "code,room,studiepunten");

  const py = courses.find((c) => c.id === "PY");
  check("PY: vak bestaat", Boolean(py), true);
  check("PY: weekdays === [woensdag]", py.weekdays.join(","), "2");
  check("PY: start === 13:20", py.start, "13:20");
  check("PY: end === 16:20", py.end, "16:20");
  check("PY: inschrijving === onbevestigd", py.inschrijving, "onbevestigd");
  check("PY: room ONBEKEND", py.room, null);
  check("PY: groepsgrootte ONBEKEND", py.groepsproject.groepsgrootte, null);
  check("PY: vormingstermijn ONBEKEND (niet verzonnen)", py.groepsproject.vormingstermijn, null);
}

for (const d of psyDates) checkItem(`psyDates: ${d.date}`, d);
for (const d of agtechDates) checkItem(`agtechDates: ${d.date}`, d);
for (const d of rteDates) checkItem(`rteDates: ${d.date}`, d);
for (const d of pythonDates) checkItem(`pythonDates: ${d.date}`, d);
for (const d of rteActionItems) checkItem(`rteActionItems: ${d.date} ${d.label}`, d);
for (const d of chineseLessons) checkItem(`chineseLessons: ${d.date}`, d);
for (const d of chineseTentamens) checkItem(`chineseTentamens: ${d.date} ${d.onderdeel}`, d);

for (const t of trips) checkItem(`trips: ${t.label}`, t);

checkItem("chinaVisaFreeDeadline", chinaVisaFreeDeadline);
checkItem("flexWeekAnnouncementDeadline", flexWeekAnnouncementDeadline);
for (const a of academicDeadlines) checkItem(`academicDeadlines: ${a.label}`, a);
check("flexWeekAnnouncementDeadline valt op einde week12", flexWeekAnnouncementDeadline.date, week12.end);

// --- lesdag-tellingen (belangrijkste typefoutcheck in de datalaag) ---
check("psyDates.length === 16", psyDates.length, 16);
check("agtechDates.length === 16", agtechDates.length, 16);
check("rteDates.length === 16", rteDates.length, 16);
check("pythonDates.length === 16", pythonDates.length, 16);

for (const d of psyDates) check(`${d.date} is woensdag (PSY)`, dayOfWeek(d.date), DAG.wo);
for (const d of agtechDates) check(`${d.date} is donderdag (AgTech)`, dayOfWeek(d.date), DAG.do);
for (const d of rteDates) check(`${d.date} is donderdag (RTE)`, dayOfWeek(d.date), DAG.do);
for (const d of pythonDates) check(`${d.date} is woensdag (Python)`, dayOfWeek(d.date), DAG.wo);

// Python-weekindeling is generatie-consistent: elke woensdag 09-09 t/m 12-23,
// geen enkele feestdag valt op een woensdag (FASE-8-1.md 0B, correctie 2)
{
  const gegenereerd = rangeDays("2026-09-09", "2026-12-23").filter((d) => dayOfWeek(d) === DAG.wo);
  check(
    "pythonDates: datums zijn gelijk aan elke woensdag 09-09 t/m 12-23",
    pythonDates.map((d) => d.date).join(","),
    gegenereerd.join(",")
  );
}

// --- General Chinese generator vs. controlelijst DATA.md §3.4 (CORRECTIE-CHINEES.md) ---
const chiMondays = chineseLessons.filter((l) => dayOfWeek(l.date) === DAG.ma);
const chiWednesdays = chineseLessons.filter((l) => dayOfWeek(l.date) === DAG.wo);
check("General Chinese: aantal maandagen", chiMondays.length, 14);
check("General Chinese: aantal woensdagen", chiWednesdays.length, 16);
check("General Chinese: totaal aantal lessen", chineseLessons.length, 30);
check("General Chinese: loopt door tot 2026-12-23", chineseLessons.some((l) => l.date === "2026-12-23"), true);
check("General Chinese: 2026-09-28 (feestdag) niet in de lijst", chineseLessons.some((l) => l.date === "2026-09-28"), false);
check("General Chinese: 2026-10-26 (feestdag) niet in de lijst", chineseLessons.some((l) => l.date === "2026-10-26"), false);

// --- FASE-9.md A1: Chinees-tentamens over drie dagen (vervangt "mogelijk tentamenmoment") ---
check("chineseTentamens: precies 6 onderdelen", chineseTentamens.length, 6);
check(
  "chineseTentamens: alle 6 zijn type tentamen, vak CHI",
  chineseTentamens.every((t) => t.type === "tentamen" && t.course === "CHI"),
  true
);
{
  const verwacht = [
    ["2026-10-28", "midterm", "mondeling", 8, 20],
    ["2026-11-02", "midterm", "schriftelijk", 9, 20],
    ["2026-11-04", "midterm", "presentatie", 9, 20],
    ["2026-12-16", "final", "mondeling", 15, 25],
    ["2026-12-21", "final", "schriftelijk", 16, 25],
    ["2026-12-23", "final", "presentatie", 16, 25],
  ];
  for (const [date, tentamen, onderdeel, week, weging] of verwacht) {
    const item = chineseTentamens.find((t) => t.date === date);
    check(`chineseTentamens ${date}: bestaat`, Boolean(item), true);
    check(`chineseTentamens ${date}: tentamen === ${tentamen}`, item?.tentamen, tentamen);
    check(`chineseTentamens ${date}: onderdeel === ${onderdeel}`, item?.onderdeel, onderdeel);
    check(`chineseTentamens ${date}: week === ${week}`, item?.week, week);
    check(`chineseTentamens ${date}: weging === ${weging} (ongedeeld, niet /3)`, item?.weging, weging);
  }
}
check(
  "chineseTentamens: de zes datums staan óók gewoon als les in chineseLessons (generator kent geen tentamens)",
  chineseTentamens.every((t) => chineseLessons.some((l) => l.date === t.date)),
  true
);

// --- FASE-9.md A1 "Nieuwe controlewaarden": samenloop op specifieke dagen ---
{
  const d1028 = dayStatus("2026-10-28");
  check("2026-10-28: twee tentamenmomenten (PSY-midterm, CHI mondeling)", d1028.vakken.filter((v) => v.type === "tentamen").length, 2);
  check("2026-10-28: PSY-midterm aanwezig", d1028.vakken.some((v) => v.course === "PSY" && v.type === "tentamen"), true);
  check("2026-10-28: CHI mondeling aanwezig", d1028.vakken.some((v) => v.course === "CHI" && v.onderdeel === "mondeling"), true);

  const d1223 = dayStatus("2026-12-23");
  check(
    "2026-12-23: drie momenten (PSY final, PY projectpresentatie, CHI presentatie)",
    new Set(d1223.vakken.filter((v) => v.type === "tentamen" || v.label.includes("Project Presentation")).map((v) => v.course)).size,
    3
  );
  check("2026-12-23: PSY final aanwezig", d1223.vakken.some((v) => v.course === "PSY" && v.type === "tentamen"), true);
  check("2026-12-23: PY Project Presentation aanwezig", d1223.vakken.some((v) => v.course === "PY" && v.label === "Project Presentation"), true);
  check("2026-12-23: CHI presentatie aanwezig", d1223.vakken.some((v) => v.course === "CHI" && v.onderdeel === "presentatie"), true);

  const d1221 = dayStatus("2026-12-21");
  check("2026-12-21: CHI schriftelijk aanwezig", d1221.vakken.some((v) => v.course === "CHI" && v.onderdeel === "schriftelijk"), true);

  const d1224 = dayStatus("2026-12-24");
  check("2026-12-24: RTE comprehensive exam aanwezig (los van CHI)", d1224.vakken.some((v) => v.course === "RTE" && v.type === "tentamen"), true);
  check("2026-12-24: geen CHI-item", d1224.vakken.some((v) => v.course === "CHI"), false);
}

// --- FASE-9.md A1 punt 4: quizzes/weektoetsen/huiswerk vanaf week 4 ---
{
  const chi = courses.find((c) => c.id === "CHI");
  check("CHI: weektoetsen.vanafWeek === 4", chi.weektoetsen.vanafWeek, 4);
  check("CHI: weektoetsen.besteAantalTelt === 15", chi.weektoetsen.besteAantalTelt, 15);
  check("CHI: weektoetsen.datums is ONBEKEND (niet verzonnen)", chi.weektoetsen.datums, null);
  checkBronZekerheid("courses: CHI.weektoetsen", chi.weektoetsen);
}

// --- geen dubbele datum binnen hetzelfde vak ---
function checkNoDuplicateDates(label, items) {
  const dates = items.map((i) => i.date);
  const unique = new Set(dates);
  check(`${label}: geen dubbele datum`, dates.length, unique.size);
}
checkNoDuplicateDates("psyDates", psyDates);
checkNoDuplicateDates("agtechDates", agtechDates);
checkNoDuplicateDates("rteDates", rteDates);
checkNoDuplicateDates("pythonDates", pythonDates);
checkNoDuplicateDates("chineseLessons", chineseLessons);

// =====================================================================
// Fase 2 — dagen genereren en statisch tonen
// =====================================================================

check("genereerKalenderDagen(): precies 181 dagen", genereerKalenderDagen().length, 181);

// 2026-10-28: PSY-midterm 's ochtends, status tentamen, Chinees 's avonds
{
  const dag = dayStatus("2026-10-28");
  check("2026-10-28 status === tentamen", dag.status, "tentamen");
  check("2026-10-28 bevat PSY-midterm", dag.vakken.some((v) => v.course === "PSY" && v.type === "tentamen"), true);
  check("2026-10-28 ochtend bezet (PSY-midterm)", dag.dagdelen.ochtend.bezet, true);
  check("2026-10-28 avond bezet (Chinees)", dag.dagdelen.avond.bezet, true);
}

// FASE-8-1.md 0B "klaar als": een gewone woensdag heeft nu alle drie de
// dagdelen bezet (PSY ochtend, Python middag, Chinees avond) — was ochtend+avond
{
  const dag = dayStatus("2026-11-18"); // gewone lesweek-woensdag, geen tentamen
  check("2026-11-18 ochtend bezet (PSY)", dag.dagdelen.ochtend.bezet, true);
  check("2026-11-18 middag bezet (Python)", dag.dagdelen.middag.bezet, true);
  check("2026-11-18 avond bezet (Chinees)", dag.dagdelen.avond.bezet, true);
  check(
    "2026-11-18 bevat Python-onderwerp Pandas",
    dag.vakken.some((v) => v.course === "PY" && v.label.includes("Pandas")),
    true
  );
}

// 2026-10-29: AgTech + RTE, valt in de midterm-periode
{
  const dag = dayStatus("2026-10-29");
  check("2026-10-29 heeft AgTech", dag.vakken.some((v) => v.course === "AGTECH"), true);
  check("2026-10-29 heeft RTE", dag.vakken.some((v) => v.course === "RTE"), true);
  check("2026-10-29 valt in tentamenperiode", dag.tentamenperiode, true);
}

// 2026-10-30 t/m 2026-11-09: vaste boeking
for (const ymd of rangeDays("2026-10-30", "2026-11-09")) {
  check(`${ymd} status === vaste-boeking`, dayStatus(ymd).status, "vaste-boeking");
}

// 2026-10-10: feestdag (National Day), geen les — niet gedekt door een vaste boeking
{
  const dag = dayStatus("2026-10-10");
  check("2026-10-10 status === feestdag", dag.status, "feestdag");
  check("2026-10-10 geen vakken", dag.vakken.length, 0);
}

// 2026-09-25 en 2026-09-28: feestdag, normaal een Chinees-maandag (28e), maar
// vallen nu binnen de Filipijnen-boeking (2026-09-25 → 09-30) — vaste boeking
// wint per de voorrangsorde, en er wordt sowieso geen Chinese les gegenereerd
// op een feestdag.
{
  const dag25 = dayStatus("2026-09-25");
  check("2026-09-25 status === vaste-boeking (wint van feestdag)", dag25.status, "vaste-boeking");
  check("2026-09-25 is nog altijd geregistreerd als feestdag", dag25.feestdagen.length > 0, true);

  const dag28 = dayStatus("2026-09-28");
  check("2026-09-28 status === vaste-boeking (wint van feestdag)", dag28.status, "vaste-boeking");
  check("2026-09-28 geen Chinese les", dag28.vakken.some((v) => v.course === "CHI"), false);
}

// 2026-09-30: terugkomst Filipijnen (± 10:00) — hele dag telt als vaste
// boeking, dus ook de PSY-les die ochtend wordt hierdoor "verborgen" achter
// de vaste-boeking-status (het vak zelf blijft wel in dag.vakken staan).
{
  const dag = dayStatus("2026-09-30");
  check("2026-09-30 status === vaste-boeking", dag.status, "vaste-boeking");
  check("2026-09-30 heeft PSY die dag (gemist)", dag.vakken.some((v) => v.course === "PSY"), true);
}

// 2026-11-16 (maandag): ochtend/middag vrij, avond bezet (Chinees)
{
  const dag = dayStatus("2026-11-16");
  check("2026-11-16 is maandag", dag.weekday, DAG.ma);
  check("2026-11-16 ochtend vrij", dag.dagdelen.ochtend.bezet, false);
  check("2026-11-16 middag vrij", dag.dagdelen.middag.bezet, false);
  check("2026-11-16 avond bezet", dag.dagdelen.avond.bezet, true);
}

// 2027-01-15: vakantie
check("2027-01-15 status === vakantie", dayStatus("2027-01-15").status, "vakantie");

// =====================================================================
// Fase 3 — vrije-blokken-motor
// =====================================================================

// isFree: een lesdag is niet vrij, een vrije dag wel
check('isFree("2026-11-16") === false (Chinees)', isFree("2026-11-16"), false);
check('isFree("2026-11-14") === true (zaterdag)', isFree("2026-11-14"), true);

// Terugkerend blok zonder absenties: vrijdag 00:00 → maandag 18:00 = 3,5 dag
{
  const week = blocksWithCost(0).find((b) => b.start === "2026-11-13");
  check("N=0: blok bestaat voor de week van 2026-11-13", Boolean(week), true);
  check("N=0: eindigt op maandag 2026-11-16", week.end, "2026-11-16");
  check("N=0: lengte === 3.5 dagen, niet 4", week.length, 3.5);
  check("N=0: geen enkel gemist lesmoment", week.gemisteLessen.length, 0);
}

// Bij één toegestane absentie: verlengt naar vrijdag → dinsdag = 5 dagen, 1x Chinees
{
  const week = blocksWithCost(1).find((b) => b.start === "2026-11-13");
  check("N=1: eindigt op dinsdag 2026-11-17", week.end, "2026-11-17");
  check("N=1: lengte === 5 dagen", week.length, 5);
  check("N=1: precies 1 gemiste les", week.gemisteLessen.length, 1);
  check("N=1: de gemiste les is Chinees op maandag", week.gemisteLessen[0].course === "CHI" && week.gemisteLessen[0].date === "2026-11-16", true);
}

// Bij twee absenties: loopt door tot en met woensdag, kosten 2x Chinees + 1x PSY
// (bevestigd door Idries: kosten leidend boven de eindtijd-frasering in DATA.md)
// + 1x Python sinds FASE-8-1.md 0B (woensdagmiddag is nu ook bezet)
{
  const week = blocksWithCost(2).find((b) => b.start === "2026-11-13");
  check("N=2: eindigt op woensdag 2026-11-18", week.end, "2026-11-18");
  check("N=2: lengte === 6 dagen", week.length, 6);
  const chinees = week.gemisteLessen.filter((l) => l.course === "CHI").length;
  const psy = week.gemisteLessen.filter((l) => l.course === "PSY").length;
  const py = week.gemisteLessen.filter((l) => l.course === "PY").length;
  check("N=2: 2x Chinees gemist", chinees, 2);
  check("N=2: 1x PSY gemist", psy, 1);
  check("N=2: 1x Python gemist", py, 1);
}

// blocksWithCost(0) bevat nooit een lesmoment, ook geen maandag-/woensdagavond
check("blocksWithCost(0): nergens een gemist lesmoment", blocksWithCost(0).every((b) => b.gemisteLessen.length === 0), true);

// Het langste blok: na het laatste tentamen (2026-12-24) tot de spring semester start (2027-02-22)
{
  const langste = freeBlocks().reduce((a, b) => (b.length > a.length ? b : a));
  check("langste blok: start 2026-12-25 (na de laatste tentamen)", langste.start, "2026-12-25");
  check("langste blok: eindigt 2027-02-21 (dag vóór spring-semesterstart)", langste.end, "2027-02-21");
  check("langste blok: bevat de flexibele week als risico", langste.bevatRisicoperiode, true);
}

// Japan-controlewaarde (DATA.md §3.6, FASE-8-1.md 0B correctie 5): 3 Chinees-
// sessies / 9 uur is de belangrijkste controlewaarde in de hele app.
// AgTech/RTE blijven 1x elk (10-29 telt niet mee — bevestigd door Idries,
// FASE-8-1.md noemde per abuis weer 2x, genegeerd na navraag).
{
  const kosten = costOfRange("2026-10-30", "2026-11-09").perVak;
  check("Japan: 3x Chinees (belangrijkste controlewaarde)", kosten.CHI, 3);
  check("Japan: 1x AgTech", kosten.AGTECH, 1);
  check("Japan: 1x RTE", kosten.RTE, 1);
  check("Japan: 1x PSY", kosten.PSY, 1);
  check("Japan: 1x Python (11-04, week 9)", kosten.PY, 1);

  const chi = courses.find((c) => c.id === "CHI");
  const chiUren = kosten.CHI * chi.absentieregels.puntenaftrek.uurPerSessie;
  check("Japan: 3 Chinees-sessies × 3 uur = 9 uur absentie", chiUren, 9);
  const urenBovenVrijstelling = Math.max(0, chiUren - chi.absentieregels.puntenaftrek.vrijstellingUren);
  const puntenaftrek = urenBovenVrijstelling * chi.absentieregels.puntenaftrek.aftrekPerUurBovenVrijstelling;
  check("Japan: 3 uur boven de vrijstelling van 6 uur", urenBovenVrijstelling, 3);
  check("Japan: −1,5 punt op aanwezigheid/participatie", puntenaftrek, 1.5);
}

// =====================================================================
// Fase 4 — plannen en opslaan
// =====================================================================

// leegState()
check("leegState() heeft de actuele schemaVersion", leegState().schemaVersion, CURRENT_SCHEMA_VERSION);
check("leegState() heeft geen items", leegState().items.length, 0);

// migrate(): schemaVersion 0 -> 1 mag niets weggooien
{
  const v0 = {
    schemaVersion: 0,
    items: [
      { id: "a1", naam: "Bezoek familie", datum: "2026-10-05", notitie: "treinreis" },
      { id: "a2", naam: "Weekendje weg", datum: "2026-11-14" },
    ],
  };
  const gemigreerd = migrate(v0);
  check("migrate: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate: aantal items blijft gelijk", gemigreerd.items.length, 2);
  check("migrate: naam blijft behouden", gemigreerd.items[0].naam, "Bezoek familie");
  check("migrate: datum wordt start én end", gemigreerd.items[0].start === "2026-10-05" && gemigreerd.items[0].end === "2026-10-05", true);
  check("migrate: notitie blijft behouden", gemigreerd.items[0].notitie, "treinreis");
  check("migrate: ontbrekende notitie wordt lege string, niet weggelaten", gemigreerd.items[1].notitie, "");
  check("migrate: ontbrekende status krijgt default idee", gemigreerd.items[1].status, "idee");
  check("migrate op actuele versie is een no-op", migrate(leegState()).schemaVersion, CURRENT_SCHEMA_VERSION);
}

// valideerItem(): geldig item is oké, ongeldig item gooit een fout
{
  const geldig = { id: "x", naam: "Test", start: "2026-10-01", end: "2026-10-02", status: "idee", notitie: "" };
  let wierpGeenFout = true;
  try {
    valideerItem(geldig);
  } catch {
    wierpGeenFout = false;
  }
  check("valideerItem: geldig item werpt geen fout", wierpGeenFout, true);

  const ongeldigeStatus = { ...geldig, status: "vast-en-zeker" };
  let wierpFout = false;
  try {
    valideerItem(ongeldigeStatus);
  } catch {
    wierpFout = true;
  }
  check("valideerItem: ongeldige status werpt een fout", wierpFout, true);

  const omgekeerdBereik = { ...geldig, start: "2026-10-05", end: "2026-10-01" };
  let wierpFout2 = false;
  try {
    valideerItem(omgekeerdBereik);
  } catch {
    wierpFout2 = true;
  }
  check("valideerItem: start na end werpt een fout", wierpFout2, true);
}

// voegItemToe / verwijderItem: pure state-transformaties
{
  let state = leegState();
  state = voegItemToe(state, { naam: "Strand", start: "2026-10-10", end: "2026-10-12", status: "idee", notitie: "" });
  check("voegItemToe: item toegevoegd", state.items.length, 1);
  check("voegItemToe: item heeft een id", typeof state.items[0].id === "string" && state.items[0].id.length > 0, true);

  const id = state.items[0].id;
  state = verwijderItem(state, id);
  check("verwijderItem: item weer weg", state.items.length, 0);
}

// =====================================================================
// Fase 5 — export en import
// =====================================================================

// huidigeYMD(): geldig YYYY-MM-DD formaat
{
  const vandaag = huidigeYMD();
  check("huidigeYMD() heeft geldig formaat", /^\d{4}-\d{2}-\d{2}$/.test(vandaag), true);
  let parseerdeZonderFout = true;
  try {
    parseYMD(vandaag);
  } catch {
    parseerdeZonderFout = false;
  }
  check("huidigeYMD() is een geldige datum", parseerdeZonderFout, true);
}

// migrate(): schemaVersion 1 -> 2 mag niets weggooien
{
  const v1 = {
    schemaVersion: 1,
    items: [{ id: "b1", naam: "Oud item", start: "2026-10-05", end: "2026-10-06", status: "vast", notitie: "" }],
  };
  const gemigreerd = migrate(v1);
  check("migrate v1->actueel: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v1->actueel: laatsteExport default null", gemigreerd.laatsteExport, null);
  check("migrate v1->actueel: item blijft behouden", gemigreerd.items.length, 1);
  check("migrate v1->actueel: bijgewerkt default null", gemigreerd.items[0].bijgewerkt, null);
  check("migrate v1->actueel: naam blijft behouden", gemigreerd.items[0].naam, "Oud item");
  check("migrate v1->actueel: ui krijgt een default", gemigreerd.ui.activeScreen, "maand");

  // volledige keten v0 -> actueel
  const v0 = { schemaVersion: 0, items: [{ id: "c1", naam: "Zeer oud item", datum: "2026-11-01" }] };
  const vanV0 = migrate(v0);
  check("migrate v0->actueel: schemaVersion wordt de actuele versie", vanV0.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v0->actueel: start/end afgeleid van datum", vanV0.items[0].start === "2026-11-01" && vanV0.items[0].end === "2026-11-01", true);
}

// migrate(): schemaVersion 2 -> actueel (v3 ui, v4 afgevinkteDeadlines) gooit niets weg
{
  const v2 = {
    schemaVersion: 2,
    laatsteExport: "2026-10-01",
    items: [{ id: "d1", naam: "Item", start: "2026-10-05", end: "2026-10-06", status: "vast", notitie: "", bijgewerkt: "2026-10-01" }],
  };
  const gemigreerd = migrate(v2);
  check("migrate v2->actueel: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v2->actueel: laatsteExport blijft behouden", gemigreerd.laatsteExport, "2026-10-01");
  check("migrate v2->actueel: item blijft behouden", gemigreerd.items.length, 1);
  check("migrate v2->actueel: ui.activeScreen default maand", gemigreerd.ui.activeScreen, "maand");
  check("migrate v2->actueel: ui.thema default systeem", gemigreerd.ui.thema, "systeem");
  check("migrate v2->actueel: ui.scrollPositions heeft alle schermen", SCHERMEN.every((s) => gemigreerd.ui.scrollPositions[s] === 0), true);
  check("migrate v2->actueel: afgevinkteDeadlines default leeg", gemigreerd.afgevinkteDeadlines.length, 0);

  // een export met een gedeeltelijk ui-veld (bijv. een oudere v3-export) verliest niets
  const v3MetGedeeltelijkeUi = { ...v2, schemaVersion: 3, ui: { activeScreen: "weken", scrollPositions: { maand: 40 } } };
  const behouden = migrate(v3MetGedeeltelijkeUi);
  check("migrate v3: bestaand activeScreen blijft staan", behouden.ui.activeScreen, "weken");
  check("migrate v3: bestaande scrollpositie blijft staan", behouden.ui.scrollPositions.maand, 40);
  check("migrate v3: ontbrekende scrollpositie krijgt default 0", behouden.ui.scrollPositions.weken, 0);
  check("migrate v3->v4: afgevinkteDeadlines default leeg", behouden.afgevinkteDeadlines.length, 0);
}

// migrate(): schemaVersion 4 (actueel) met bestaande afgevinkteDeadlines blijft ongewijzigd
{
  const v4 = { ...leegState(), afgevinkteDeadlines: ["2026-09-24::Term project topic + groepen (5 pers.)"] };
  const gemigreerd = migrate(v4);
  check("migrate v4: bestaande afgevinkteDeadlines blijft staan", gemigreerd.afgevinkteDeadlines.length, 1);
}

// bereidExportVoor(): bestandsnaam met datum, geldige JSON-inhoud
{
  const state = voegItemToe(leegState(), { naam: "Strand", start: "2026-10-10", end: "2026-10-12", status: "idee", notitie: "" });
  const { state: nieuweState, bestandsnaam, inhoud } = bereidExportVoor(state);
  check("export: bestandsnaam bevat vandaag", bestandsnaam, `planner-export-${huidigeYMD()}.json`);
  check("export: state krijgt laatsteExport", nieuweState.laatsteExport, huidigeYMD());
  check("export: inhoud is geldige JSON met dezelfde items", JSON.parse(inhoud).items.length, 1);
}

// Klaar-criterium fase 5: export -> state wissen -> import geeft exact de oude state terug
{
  const origineel = voegItemToe(leegState(), { naam: "Strand", start: "2026-10-10", end: "2026-10-12", status: "idee", notitie: "" });
  const { inhoud } = bereidExportVoor(origineel);
  const geimporteerd = JSON.parse(inhoud);

  const gewisteState = leegState(); // "state wissen"
  const { items, conflicten } = bereidSamenvoegingVoor(gewisteState, geimporteerd);
  check("import in gewiste state: geen conflicten", conflicten.length, 0);
  check("import in gewiste state: exact hetzelfde item terug", JSON.stringify(items), JSON.stringify(origineel.items));
}

// Samenvoegen: onbekend id wordt toegevoegd, identiek item genegeerd, afwijkend item -> conflict
{
  let huidig = leegState();
  huidig = voegItemToe(huidig, { naam: "Blijft", start: "2026-10-01", end: "2026-10-01", status: "idee", notitie: "" });
  huidig = voegItemToe(huidig, { naam: "Botst", start: "2026-10-05", end: "2026-10-05", status: "idee", notitie: "" });
  const botsendId = huidig.items[1].id;

  const geimporteerd = {
    schemaVersion: 2,
    laatsteExport: "2026-10-02",
    items: [
      { id: "nieuw-1", naam: "Nieuw uit import", start: "2026-10-08", end: "2026-10-08", status: "idee", notitie: "", bijgewerkt: "2026-10-02" },
      { ...huidig.items[0] }, // identiek -> geen conflict, geen dubbele
      { id: botsendId, naam: "Botst (gewijzigd)", start: "2026-10-05", end: "2026-10-06", status: "vast", notitie: "", bijgewerkt: "2026-10-03" },
    ],
  };

  const { items, conflicten } = bereidSamenvoegingVoor(huidig, geimporteerd);
  check("samenvoegen: nieuw item toegevoegd", items.some((i) => i.id === "nieuw-1"), true);
  check("samenvoegen: identiek item niet verdubbeld", items.filter((i) => i.id === huidig.items[0].id).length, 1);
  check("samenvoegen: afwijkend item levert precies 1 conflict op", conflicten.length, 1);
  check("samenvoegen: totaal blijft correct (geen items verloren)", items.length, 3);

  const opgelost = pasConflictKeuzesToe(items, conflicten, { [botsendId]: "geimporteerd" });
  const gekozenItem = opgelost.find((i) => i.id === botsendId);
  check("conflict opgelost met 'geimporteerd': naam bijgewerkt", gekozenItem.naam, "Botst (gewijzigd)");
}

// =====================================================================
// Fase 6 — deadlines en waarschuwingen (op een gesimuleerde datum)
// =====================================================================

const GESIMULEERD_VANDAAG = "2026-11-01";

// China-aftelling
{
  const china = chinaAftelling(GESIMULEERD_VANDAAG);
  check("China-aftelling: dagen resterend", china.dagenResterend, diffDays(GESIMULEERD_VANDAAG, "2026-12-31"));
  check("China-aftelling: zekerheid TE VERIFIËREN zichtbaar", china.zekerheid, "TE VERIFIËREN");
}

// Flexibele-week-waarschuwing
{
  const flexVoorDeadline = flexWeekStatus("2026-11-01");
  check("flexWeek vóór 2026-11-28: nog niet gepasseerd", flexVoorDeadline.gepasseerd, false);
  const flexNaDeadline = flexWeekStatus("2026-12-01");
  check("flexWeek ná 2026-11-28: gepasseerd", flexNaDeadline.gepasseerd, true);
}

// Chinees Nieuwjaar-drukte, afgeleid uit holidays.js (niet hardcoded)
{
  const cny = cnyDrukte();
  check("cnyDrukte: start", cny.start, "2027-02-04");
  check("cnyDrukte: end", cny.end, "2027-02-10");
  check("cnyDrukte: notitie", cny.notitie, "vervoer en hotels extreem druk");
}

// Overzichtspaneel: aantal resterende blokken op de gesimuleerde datum
{
  const blokken = resterendeBlokken(GESIMULEERD_VANDAAG);
  check("resterendeBlokken: 3,5-dagenblokken > 0", blokken.drieËnHalf > 0, true);
  check("resterendeBlokken: 5-dagenblokken > 0", blokken.vijfMetEenAbsentie > 0, true);
  check("resterendeBlokken: precies 1 lang blok in de wintervakantie", blokken.langBlokInVakantie, 1);
}

// Absentieteller: alleen status "vast" telt mee, "idee" niet
{
  const items = [
    { start: "2026-10-30", end: "2026-11-09", status: "vast", naam: "x", notitie: "", id: "1" },
    { start: "2026-09-25", end: "2026-09-30", status: "idee", naam: "y", notitie: "", id: "2" },
  ];
  const totaal = absentieTotaal(items);
  check("absentieTotaal: CHI van het vaste item", totaal.CHI, 3);
  check("absentieTotaal: PSY van het vaste item", totaal.PSY, 1);
  check("absentieTotaal: idee-item niet meegeteld (geen extra PSY uit Filipijnen)", absentieTotaal([items[1]]).PSY, undefined);
}

// Seizoensdata: elke maand zonder data toont de vaste tekst, nooit een schatting
for (const m of [9, 10, 11, 12, 1, 2]) {
  check(`seizoensdataLabel(${m}) === "seizoensdata ontbreekt"`, seizoensdataLabel(m), "seizoensdata ontbreekt");
}

// =====================================================================
// Fase 7 — PWA en deploy
// =====================================================================

// manifest.json: verplichte velden voor installeerbaarheid op Chrome Android
// (bron: zie CLAUDE-sessie fase 7-rapport — web.dev/learn/pwa/web-app-manifest,
// developer.chrome.com/docs/lighthouse/pwa/installable-manifest)
{
  const manifest = JSON.parse(readFileSync(join(PROJECT_ROOT, "manifest.json"), "utf8"));
  check("manifest: name aanwezig", typeof manifest.name === "string" && manifest.name.length > 0, true);
  check("manifest: short_name aanwezig", typeof manifest.short_name === "string" && manifest.short_name.length > 0, true);
  check("manifest: start_url aanwezig", typeof manifest.start_url === "string" && manifest.start_url.length > 0, true);
  check("manifest: display is standalone/fullscreen/minimal-ui", ["standalone", "fullscreen", "minimal-ui"].includes(manifest.display), true);
  check("manifest: background_color aanwezig", typeof manifest.background_color === "string", true);
  check("manifest: theme_color aanwezig", typeof manifest.theme_color === "string", true);

  const heeft192 = manifest.icons.some((i) => i.sizes === "192x192");
  const heeft512Any = manifest.icons.some((i) => i.sizes === "512x512" && (i.purpose ?? "any") === "any");
  const heeft512Maskable = manifest.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable");
  check("manifest: icoon 192x192 aanwezig", heeft192, true);
  check("manifest: icoon 512x512 (any) aanwezig", heeft512Any, true);
  check("manifest: icoon 512x512 (maskable) aanwezig", heeft512Maskable, true);

  for (const icon of manifest.icons) {
    check(`manifest: icoonbestand bestaat op schijf (${icon.src})`, existsSync(join(PROJECT_ROOT, icon.src)), true);
  }
}

// index.html verwijst naar het manifest en de service worker registreert zich
{
  const html = readFileSync(join(PROJECT_ROOT, "index.html"), "utf8");
  check('index.html linkt manifest.json', html.includes('rel="manifest" href="manifest.json"'), true);
  const mainJs = readFileSync(join(PROJECT_ROOT, "src/ui/main.js"), "utf8");
  check("main.js registreert de service worker", mainJs.includes("serviceWorker.register"), true);
}

// sw.js: elk bestand in de app-shell-lijst moet echt bestaan (voorkomt een
// cache.addAll() die faalt op een ontbrekend bestand, wat installatie breekt)
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  const match = swBron.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  check("sw.js: APP_SHELL-lijst gevonden", Boolean(match), true);
  const bestanden = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  check("sw.js: APP_SHELL is niet leeg", bestanden.length > 0, true);
  for (const pad of bestanden) {
    if (pad === "./") continue; // navigatie-alias voor index.html, geen los bestand
    check(`sw.js: app-shell-bestand bestaat (${pad})`, existsSync(join(PROJECT_ROOT, pad.replace(/^\.\//, ""))), true);
  }
}

// =====================================================================
// Fase 8A — visueel systeem
// =====================================================================

// Zelf-gehoste fonts: bestaan op schijf, en styles.css verwijst ernaar met
// @font-face (geen fonts.googleapis.com-link — CLAUDE.md §2, herzien in fase 8)
{
  const lettertypen = ["DMSans-Variable.woff2", "Outfit-Variable.woff2", "SchibstedGrotesk-Variable.woff2"];
  for (const bestand of lettertypen) {
    check(`fonts/${bestand} bestaat op schijf`, existsSync(join(PROJECT_ROOT, "fonts", bestand)), true);
  }

  const css = readFileSync(join(PROJECT_ROOT, "styles.css"), "utf8");
  check('styles.css: geen fonts.googleapis.com-link', css.includes("fonts.googleapis.com"), false);
  check('styles.css: geen fonts.gstatic.com-link', css.includes("fonts.gstatic.com"), false);
  for (const bestand of lettertypen) {
    check(`styles.css: @font-face verwijst naar fonts/${bestand}`, css.includes(`fonts/${bestand}`), true);
  }
  check("styles.css: --ff-display token aanwezig", css.includes("--ff-display"), true);
  check("styles.css: --ff-head token aanwezig", css.includes("--ff-head"), true);
  check("styles.css: --ff-body token aanwezig", css.includes("--ff-body"), true);

  // fonts moeten ook in de service-worker-cache staan (FASE-8.md §0)
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  for (const bestand of lettertypen) {
    check(`sw.js: APP_SHELL bevat fonts/${bestand}`, swBron.includes(`fonts/${bestand}`), true);
  }
}

// =====================================================================
// Fase 8B — navigatie en schermen
// =====================================================================

// kortDatum(): "wo 4 nov"-formaat, geverifieerd tegen bekende weekdagen
{
  check("kortDatum: 2026-11-04 is een woensdag", kortDatum("2026-11-04"), "wo 4 nov");
  check("kortDatum: 2026-09-07 is een maandag (semesterstart)", kortDatum("2026-09-07"), "ma 7 sep");
  check("kortDatum: jaargrens 2026-12-31", kortDatum("2026-12-31"), "do 31 dec");
  check("kortDatum: jaargrens 2027-01-01", kortDatum("2027-01-01"), "vr 1 jan");
  check("kortDatum: 28 februari 2027 (geen schrikkeljaar)", kortDatum("2027-02-28"), "zo 28 feb");
}

// collegeWeek(): afgeleid uit semesterMarkers + de week-velden in coursedates.js,
// niet hardcoded — 2026-11-04 staat als week 9 bij alle vier de wekelijkse vakken.
{
  const w = collegeWeek("2026-11-04");
  check("collegeWeek: 2026-11-04 is week 9", w?.week, 9);
  check("collegeWeek: totaal is 16 (afgeleid uit coursedates.js, niet ingevoerd)", w?.totaal, 16);
  check("collegeWeek: semesterstart zelf is week 1", collegeWeek("2026-09-07")?.week, 1);
  check("collegeWeek: voor semesterstart is null", collegeWeek("2026-09-01"), null);
  check("collegeWeek: diep in de wintervakantie is null", collegeWeek("2027-01-15"), null);
}

// index.html: de vier schermen, de tabbalk en het instellingenpaneel bestaan
{
  const html = readFileSync(join(PROJECT_ROOT, "index.html"), "utf8");
  for (const scherm of SCHERMEN) {
    check(`index.html: scherm-${scherm} aanwezig`, html.includes(`id="scherm-${scherm}"`), true);
    check(`index.html: navknop voor ${scherm} aanwezig`, html.includes(`data-scherm="${scherm}"`), true);
  }
  check("index.html: topbar aanwezig", html.includes('id="topbar"'), true);
  check("index.html: bottomnav aanwezig", html.includes('id="bottomnav"'), true);
  check("index.html: instellingenpaneel aanwezig", html.includes('id="instellingen-paneel"'), true);
  check("index.html: geen title-attributen (tooltips bestaan niet op Android)", /\stitle=/.test(html), false);
}

// Geen title-attributen in de nieuwe UI-laag van fase 8B
{
  for (const bestand of ["src/ui/main.js", "src/ui/nav.js", "src/ui/datumlabels.js", "src/ui/planner.js"]) {
    const bron = readFileSync(join(PROJECT_ROOT, bestand), "utf8");
    check(`${bestand}: geen title-attributen`, /\.title\s*=|setAttribute\(\s*["']title["']/.test(bron), false);
  }
}

// main.js: de thema-waarden ("licht"/"donker") moeten mappen op de Engelse
// data-theme-attribuutwaarden ("light"/"dark") die styles.css (fase 8A)
// daadwerkelijk gebruikt — anders werkt de handmatige schakelaar niet.
{
  const mainBron = readFileSync(join(PROJECT_ROOT, "src/ui/main.js"), "utf8");
  check('main.js: "licht" mapt naar data-theme="light"', /licht:\s*"light"/.test(mainBron), true);
  check('main.js: "donker" mapt naar data-theme="dark"', /donker:\s*"dark"/.test(mainBron), true);
}

// sw.js: de oude fase 1-6 UI-bestanden zijn vervangen, niet blijven hangen
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  check("sw.js: render.js niet meer gecachet (vervangen in 8B)", swBron.includes("render.js"), false);
  check("sw.js: overzicht.js (oud) niet meer gecachet (vervangen in 8B)", swBron.includes("ui/overzicht.js"), false);
  for (const bestand of ["nav.js", "datumlabels.js"]) {
    check(`sw.js: APP_SHELL bevat ui/${bestand}`, swBron.includes(`ui/${bestand}`), true);
  }
}

// =====================================================================
// Fase 8C — scherm "Maand"
// =====================================================================

// maandWeken(): volledige weekrijen (ma-zo), grenzen kloppen voor de drie
// maanden uit het "Klaar als"-criterium (semestergrens, gewone maand, en de
// laatste maand van de app-periode — geen schrikkeljaar).
{
  for (const [jaar, maand, eersteDagVanMaand, laatsteDagVanMaand] of [
    [2026, 9, "2026-09-01", "2026-09-30"],
    [2026, 10, "2026-10-01", "2026-10-31"],
    [2027, 2, "2027-02-01", "2027-02-28"],
  ]) {
    const weken = maandWeken(jaar, maand);
    const alleDagen = weken.flat();
    check(`maandWeken(${jaar},${maand}): elke week heeft 7 dagen`, weken.every((w) => w.length === 7), true);
    check(`maandWeken(${jaar},${maand}): grid begint op maandag`, dayOfWeek(alleDagen[0]), 0);
    check(`maandWeken(${jaar},${maand}): grid eindigt op zondag`, dayOfWeek(alleDagen.at(-1)), 6);
    check(`maandWeken(${jaar},${maand}): bevat ${eersteDagVanMaand}`, alleDagen.includes(eersteDagVanMaand), true);
    check(`maandWeken(${jaar},${maand}): bevat ${laatsteDagVanMaand}`, alleDagen.includes(laatsteDagVanMaand), true);
    check(`maandWeken(${jaar},${maand}): geen duplicaten`, new Set(alleDagen).size, alleDagen.length);
  }
}

// dagblad van 2026-11-04: drie lessen (PSY, Python, Chinees), elk met het
// juiste syllabusonderwerp uit coursedates.js — het expliciete "Klaar als"-
// voorbeeld uit FASE-8.md 8C.
{
  const dag = dayStatus("2026-11-04");
  const lessen = dag.vakken.filter((v) => v.type === "les");
  check("dayStatus(2026-11-04): precies drie lessen", lessen.length, 3);
  const perVak = Object.fromEntries(lessen.map((v) => [v.course, v.label]));
  check("dayStatus(2026-11-04): PSY-onderwerp", perVak.PSY, "Learning");
  check("dayStatus(2026-11-04): Python-onderwerp", perVak.PY, "Nested Structure");
  check("dayStatus(2026-11-04): Chinees-onderwerp", perVak.CHI, "General Chinese");
}

// isStipMoment() via de labels: tentamens en presentatie-lessen krijgen een
// stip, gewone lessen een streepje — heuristiek werkt op de bestaande
// letterlijke labels, geen nieuw dataveld.
{
  const presentatieLes = { type: "les", label: "Term Project Presentations" };
  const gewoneLes = { type: "les", label: "Signal & Train Control" };
  const tentamen = { type: "tentamen", label: "Midterm Exam (35%)" };
  check("isStipMoment: presentatie-les is een stip", isStipMoment(presentatieLes), true);
  check("isStipMoment: gewone les is geen stip", isStipMoment(gewoneLes), false);
  check("isStipMoment: tentamen is een stip", isStipMoment(tentamen), true);
}

// deadlineSleutel(): stabiel en uniek genoeg om af te vinken, ook voor
// deadlines met alleen een start (geen los date-veld).
{
  check("deadlineSleutel: date-veld", deadlineSleutel({ date: "2026-09-24", label: "X" }), "2026-09-24::X");
  check("deadlineSleutel: start-veld (geen date)", deadlineSleutel({ start: "2026-09-23", end: "2026-09-24", label: "Y" }), "2026-09-23::Y");

  const alleDeadlineSleutels = [...rteActionItems, ...academicDeadlines, chinaVisaFreeDeadline, flexWeekAnnouncementDeadline].map(deadlineSleutel);
  check("deadlineSleutel: elke deadline heeft een unieke sleutel", new Set(alleDeadlineSleutels).size, alleDeadlineSleutels.length);
}

// zetDeadlineAfgevinkt(): pure state-transformatie, geen duplicaten
{
  let state = leegState();
  state = zetDeadlineAfgevinkt(state, "sleutel-a", true);
  check("zetDeadlineAfgevinkt: toevoegen", state.afgevinkteDeadlines, ["sleutel-a"]);
  state = zetDeadlineAfgevinkt(state, "sleutel-a", true);
  check("zetDeadlineAfgevinkt: nogmaals afvinken is geen duplicaat", state.afgevinkteDeadlines, ["sleutel-a"]);
  state = zetDeadlineAfgevinkt(state, "sleutel-a", false);
  check("zetDeadlineAfgevinkt: uitvinken", state.afgevinkteDeadlines, []);
}

// sw.js: de fase 8C-bestanden zitten in de app-shell
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  for (const bestand of ["schermMaand.js", "maandGrid.js", "dagblad.js"]) {
    check(`sw.js: APP_SHELL bevat ui/${bestand}`, swBron.includes(`ui/${bestand}`), true);
  }
}

// Geen title-attributen in de fase 8C-bestanden
{
  for (const bestand of ["src/ui/maandGrid.js", "src/ui/dagblad.js", "src/ui/schermMaand.js"]) {
    const bron = readFileSync(join(PROJECT_ROOT, bestand), "utf8");
    check(`${bestand}: geen title-attributen`, /\.title\s*=|setAttribute\(\s*["']title["']/.test(bron), false);
  }
}

// =====================================================================
// Fase 8D — scherm "Weken"
// =====================================================================

// migrate(): schemaVersion 4 -> 5 voegt weekWeergave toe zonder iets weg te gooien
{
  const v4 = { ...leegState(), schemaVersion: 4 };
  delete v4.weekWeergave;
  const gemigreerd = migrate(v4);
  check("migrate v4->v5: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v4->v5: weekWeergave.periode default 1w", gemigreerd.weekWeergave.periode, "1w");
  check("migrate v4->v5: weekWeergave.startWeek default null", gemigreerd.weekWeergave.startWeek, null);

  const metOnbekendePeriode = { ...leegState(), weekWeergave: { periode: "onbekend", startWeek: "2026-10-05" } };
  const genormaliseerd = migrate(metOnbekendePeriode);
  check("migrate: onbekende periode valt terug op default", genormaliseerd.weekWeergave.periode, "1w");
  check("migrate: bestaande startWeek blijft staan", genormaliseerd.weekWeergave.startWeek, "2026-10-05");
}

// maandagVan(): altijd een maandag, ook als ymd zelf al maandag is
{
  check("maandagVan: woensdag terug naar maandag", maandagVan("2026-11-04"), "2026-11-02");
  check("maandagVan: maandag blijft gelijk", maandagVan("2026-11-02"), "2026-11-02");
  check("maandagVan: zondag terug naar maandag", maandagVan("2026-11-08"), "2026-11-02");
}

// weekAantal() / weekStarts(): elke periodekeuze levert het juiste aantal weken
{
  check("weekAantal: 1w", weekAantal("1w", null, null), 1);
  check("weekAantal: 2w", weekAantal("2w", null, null), 2);
  check("weekAantal: 4w", weekAantal("4w", null, null), 4);
  check("weekAantal: 1m", weekAantal("1m", null, null), 5);
  check("weekAantal: 3m", weekAantal("3m", null, null), 13);
  check("weekAantal: eigen (2 weken bereik)", weekAantal("eigen", "2026-09-07", "2026-09-20"), 2);
  check("weekAantal: eigen zonder geldig bereik valt terug op 1", weekAantal("eigen", null, null), 1);

  for (const periode of PERIODES.filter((p) => p !== "eigen")) {
    const starts = weekStarts("2026-10-05", periode, null, null);
    check(`weekStarts(${periode}): aantal weken klopt met weekAantal`, starts.length, weekAantal(periode, null, null));
    check(`weekStarts(${periode}): elke start is een maandag`, starts.every((s) => dayOfWeek(s) === 0), true);
  }
}

// verschuifVenster(): schuift correct over de jaargrens 2026 -> 2027
{
  const overJaargrens = verschuifVenster("2026-12-21", "2w", null, null, 1);
  check("verschuifVenster: 2 weken vooruit vanaf 21 dec 2026", overJaargrens, "2027-01-04");
  check("verschuifVenster: 1 week terug", verschuifVenster("2027-01-04", "1w", null, null, -1), "2026-12-28");
}

// dagdelenMetKleur(): woensdag 4 nov 2026 heeft alle drie de dagdelen bezet
// (PSY ochtend, Python middag, Chinees avond) — het "Klaar als"-voorbeeld uit 8D.
{
  const dagdelen = dagdelenMetKleur(dayStatus("2026-11-04"));
  check("dagdelenMetKleur: ochtend bezet (PSY)", dagdelen.ochtend?.kleurVar, "--vak-psy-text");
  check("dagdelenMetKleur: middag bezet (Python)", dagdelen.middag?.kleurVar, "--vak-py-text");
  check("dagdelenMetKleur: avond bezet (Chinees)", dagdelen.avond?.kleurVar, "--vak-chi-text");
}

// sw.js: de fase 8D-bestanden zitten in de app-shell
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  for (const bestand of ["schermWeken.js", "wekenGrid.js"]) {
    check(`sw.js: APP_SHELL bevat ui/${bestand}`, swBron.includes(`ui/${bestand}`), true);
  }
}

// Geen title-attributen in de fase 8D-bestanden
{
  for (const bestand of ["src/ui/wekenGrid.js", "src/ui/schermWeken.js"]) {
    const bron = readFileSync(join(PROJECT_ROOT, bestand), "utf8");
    check(`${bestand}: geen title-attributen`, /\.title\s*=|setAttribute\(\s*["']title["']/.test(bron), false);
  }
}

// =====================================================================
// Fase 8E — scherm "Overzicht"
// =====================================================================

// projects.js: beide projecten uit FASE-8.md 8E staan erin, met geldige bron/zekerheid
{
  check("projects.js: precies twee projecten (RTE + Python)", projects.length, 2);
  const rte = projects.find((p) => p.id === "RTE_TERMPROJECT");
  const py = projects.find((p) => p.id === "PY_GROEPSPROJECT");
  check("projects.js: RTE termproject aanwezig", Boolean(rte), true);
  check("projects.js: Python groepsproject aanwezig", Boolean(py), true);
  check("projects.js: RTE heeft 5 mijlpalen (§3.3)", rte?.mijlpalen.length, 5);
  check("projects.js: Python heeft 3 mijlpalen (weken 14-16)", py?.mijlpalen.length, 3);
  check("projects.js: Python-mijlpalen matchen pythonDates-presentatiedata", py?.mijlpalen.map((m) => m.datum), ["2026-12-09", "2026-12-16", "2026-12-23"]);
  check("projects.js: Python groepsproject heeft een waarschuwing", Boolean(py?.waarschuwing), true);
  check("projects.js: Python groepsgrootte staat op null (ONBEKEND)", py?.groepsgrootte, null);

  for (const project of projects) {
    checkBronZekerheid(`projects.js: ${project.id}`, project);
    for (const mijlpaal of project.mijlpalen) {
      check(`projects.js: ${project.id} mijlpaal "${mijlpaal.label}" heeft geldige datum`, YMD_PATTERN.test(mijlpaal.datum), true);
    }
  }
}

// valideerProject() / voegProjectToe() / verwijderProject(): pure state-transformaties
{
  let state = leegState();
  state = voegProjectToe(state, { naam: "Eigen project", vak: null, mijlpalen: [{ datum: "2026-10-01", label: "Start" }] });
  check("voegProjectToe: project toegevoegd", state.eigenProjecten.length, 1);
  check("voegProjectToe: project heeft een id", typeof state.eigenProjecten[0].id === "string" && state.eigenProjecten[0].id.length > 0, true);

  let wierpFout = false;
  try {
    valideerProject({ id: "x", naam: "Zonder mijlpalen", mijlpalen: [] });
  } catch {
    wierpFout = true;
  }
  check("valideerProject: project zonder mijlpalen werpt een fout", wierpFout, true);

  const id = state.eigenProjecten[0].id;
  state = verwijderProject(state, id);
  check("verwijderProject: project weer weg", state.eigenProjecten.length, 0);
}

// zetMijlpaalAfgevinkt(): pure state-transformatie, geen duplicaten
{
  let state = leegState();
  state = zetMijlpaalAfgevinkt(state, "sleutel-a", true);
  check("zetMijlpaalAfgevinkt: toevoegen", state.afgevinkteMijlpalen, ["sleutel-a"]);
  state = zetMijlpaalAfgevinkt(state, "sleutel-a", false);
  check("zetMijlpaalAfgevinkt: uitvinken", state.afgevinkteMijlpalen, []);
}

// migrate(): schemaVersion 5 -> 6 voegt afgevinkteMijlpalen/eigenProjecten toe
{
  const v5 = { ...leegState(), schemaVersion: 5 };
  delete v5.afgevinkteMijlpalen;
  delete v5.eigenProjecten;
  const gemigreerd = migrate(v5);
  check("migrate v5->v6: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v5->v6: afgevinkteMijlpalen default leeg", gemigreerd.afgevinkteMijlpalen.length, 0);
  check("migrate v5->v6: eigenProjecten default leeg", gemigreerd.eigenProjecten.length, 0);
}

// mijlpaalSleutel(): stabiel per project+mijlpaal
{
  const project = { id: "P1" };
  const mijlpaal = { datum: "2026-10-01", label: "X" };
  check("mijlpaalSleutel: verwachte vorm", mijlpaalSleutel(project, mijlpaal), "P1::2026-10-01::X");
}

// volgendeTentamenOfPresentatie(): vindt tentamens én presentatie-labels,
// op een gesimuleerde datum — geen systeemklok nodig om dit te testen.
{
  const vlakVoorMidterm = volgendeTentamenOfPresentatie("2026-10-20");
  check("volgendeTentamenOfPresentatie(2026-10-20): vindt het eerstvolgende tentamen", vlakVoorMidterm?.datum, "2026-10-28");

  const vlakVoorPresentaties = volgendeTentamenOfPresentatie("2026-12-01");
  check("volgendeTentamenOfPresentatie(2026-12-01): vindt de eerstvolgende presentatie (Python, 12-09, vóór RTE's 12-10)", vlakVoorPresentaties?.datum, "2026-12-09");

  const naAlles = volgendeTentamenOfPresentatie("2027-01-01");
  check("volgendeTentamenOfPresentatie(2027-01-01): niets meer over, dus null", naAlles, null);
}

// aantalOpenstaandeDeadlines(): telt alleen nog-niet-afgevinkte, nog-niet-verstreken deadlines
{
  const alleOpen = aantalOpenstaandeDeadlines("2026-09-01", []);
  const eenAfgevinkt = aantalOpenstaandeDeadlines("2026-09-01", [deadlineSleutel({ date: "2026-09-19", label: "Laatste dag online vakken laten vallen" })]);
  check("aantalOpenstaandeDeadlines: afvinken vermindert de telling met 1", eenAfgevinkt, alleOpen - 1);
  check("aantalOpenstaandeDeadlines: na de app-periode is alles verstreken", aantalOpenstaandeDeadlines("2027-03-01", []), 0);
}

// rijen*(): elke bouwer levert alleen rijen met een geldige YYYY-MM-DD-datum
{
  for (const [naam, rijen] of [
    ["rijenSchooldagen", rijenSchooldagen()],
    ["rijenTentamens", rijenTentamens()],
    ["rijenDeadlines", rijenDeadlines()],
    ["rijenProjecten", rijenProjecten()],
    ["rijenFeestdagen", rijenFeestdagen()],
    ["rijenEigenItems", rijenEigenItems([{ naam: "Test", start: "2026-10-01", end: "2026-10-01", status: "idee", notitie: "" }])],
    ["rijenVrijeBlokken", rijenVrijeBlokken()],
  ]) {
    check(`${naam}: levert rijen`, rijen.length > 0, true);
    check(`${naam}: elke rij heeft een geldige datum`, rijen.every((r) => YMD_PATTERN.test(r.datum)), true);
    check(`${naam}: elke rij heeft inhoud`, rijen.every((r) => typeof r.inhoud === "string" && r.inhoud.length > 0), true);
  }
  check("rijenProjecten: bevat zowel RTE als Python", new Set(rijenProjecten().map((r) => r.project.id)).size, 2);
  check("rijenTentamens: bevat geen presentaties (alleen type tentamen)", rijenTentamens().every((r) => !/presentat/i.test(r.inhoud)) , true);
}

// sw.js: de fase 8E-bestanden zitten in de app-shell
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  for (const bestand of ["schermOverzicht.js", "overzichtData.js"]) {
    check(`sw.js: APP_SHELL bevat ui/${bestand}`, swBron.includes(`ui/${bestand}`), true);
  }
  check("sw.js: APP_SHELL bevat data/projects.js", swBron.includes("data/projects.js"), true);
}

// Geen title-attributen in de fase 8E-bestanden
{
  for (const bestand of ["src/ui/schermOverzicht.js", "src/ui/overzichtData.js", "src/data/projects.js"]) {
    const bron = readFileSync(join(PROJECT_ROOT, bestand), "utf8");
    check(`${bestand}: geen title-attributen`, /\.title\s*=|setAttribute\(\s*["']title["']/.test(bron), false);
  }
}

// =====================================================================
// Fase 8F — scherm "Vakken" (laatste subfase)
// =====================================================================

// courses.js: de docent-gaten die 8F ontdekte (DATA.md §3.1/§3.2 noemden geen
// naam) zijn later opgelost door VAKKEN.md §3/§5 — niet meer ONBEKEND, en niet
// meer in onbekendeVelden.
{
  const psy = courses.find((c) => c.id === "PSY");
  check("PSY: docent is nu bekend (VAKKEN.md §3)", psy.docent, "周珮雯 (Catherine P. Chou)");
  check("PSY: onbekendeVelden bevat geen docent meer", psy.onbekendeVelden.includes("docent"), false);

  const agtech = courses.find((c) => c.id === "AGTECH");
  check("AGTECH: docent is nu bekend (VAKKEN.md §5)", agtech.docent, "Chih-Wei Tung (programmadirecteur MS Global ATGS)");
  check("AGTECH: onbekendeVelden bevat geen docent meer", agtech.onbekendeVelden.includes("docent"), false);
}

// dayStatus()/blocks.js: pythonAfgewezen=true sluit Python uit, zonder de
// bestaande (default false) uitkomst te veranderen — 2026-09-09 is de eerste
// woensdag van het semester met alle drie de vakken.
{
  const metPython = dayStatus("2026-09-09");
  const zonderPython = dayStatus("2026-09-09", true);
  check("dayStatus(2026-09-09): default heeft 3 lessen", metPython.vakken.filter((v) => v.type === "les").length, 3);
  check("dayStatus(2026-09-09, pythonAfgewezen): nog maar 2 lessen", zonderPython.vakken.filter((v) => v.type === "les").length, 2);
  check("dayStatus(2026-09-09, pythonAfgewezen): PY niet meer aanwezig", zonderPython.vakken.some((v) => v.course === "PY"), false);
  check("dayStatus(2026-09-09, pythonAfgewezen): PSY blijft aanwezig", zonderPython.vakken.some((v) => v.course === "PSY"), true);

  const kostenMet = costOfRange("2026-09-09", "2026-09-09");
  const kostenZonder = costOfRange("2026-09-09", "2026-09-09", true);
  check("costOfRange: default telt PY mee", kostenMet.perVak.PY, 1);
  check("costOfRange: pythonAfgewezen telt PY niet mee", kostenZonder.perVak.PY, undefined);
}

// lib/overzicht.js: pythonAfgewezen-parameter is optioneel en verandert het
// default gedrag niet
{
  const vandaag = "2026-10-01";
  check(
    "resterendeBlokken: met/zonder expliciete pythonAfgewezen=false is identiek",
    JSON.stringify(resterendeBlokken(vandaag)),
    JSON.stringify(resterendeBlokken(vandaag, false))
  );
  const items = [{ start: "2026-09-09", end: "2026-09-09", status: "vast" }];
  check(
    "absentieTotaal: pythonAfgewezen=true telt PY niet mee",
    absentieTotaal(items, true).PY,
    undefined
  );
}

// vakkenData.js: lesoverzicht() per vak klopt met de tellingen die validate.mjs
// elders al bevestigt (16 per typed vak, 30 gegenereerde Chinese lessen)
{
  check("lesoverzicht(PSY): 16 lesmomenten", lesoverzicht("PSY").length, 16);
  check("lesoverzicht(AGTECH): 16 lesmomenten", lesoverzicht("AGTECH").length, 16);
  check("lesoverzicht(RTE): 16 lesmomenten", lesoverzicht("RTE").length, 16);
  check("lesoverzicht(PY): 16 lesmomenten", lesoverzicht("PY").length, 16);
  check("lesoverzicht(CHI): 30 gegenereerde lessen", lesoverzicht("CHI").length, 30);
  check("lesoverzicht: chronologisch gesorteerd", lesoverzicht("PSY").every((l, i, arr) => i === 0 || arr[i - 1].date <= l.date), true);
}

// gemisteSessies(): telt alleen "vast" items, per vak apart
{
  const items = [
    { start: "2026-09-09", end: "2026-09-09", status: "vast" }, // PSY + PY + CHI die woensdag
    { start: "2026-09-10", end: "2026-09-10", status: "idee" }, // telt niet mee (geen "vast")
  ];
  const psyGemist = gemisteSessies("PSY", items);
  check("gemisteSessies(PSY): 1 sessie gemist door het vast-item", psyGemist.length, 1);
  check("gemisteSessies(PSY): datum klopt", psyGemist[0]?.date, "2026-09-09");
  check("gemisteSessies(AGTECH): 0 — het idee-item op 09-10 telt niet mee", gemisteSessies("AGTECH", items).length, 0);
  check("gemisteSessies(PY, pythonAfgewezen): PY telt niet mee als afgewezen", gemisteSessies("PY", items, true).length, 0);
}

// chineseAbsentieStand(): twee onafhankelijke grenzen, niet met elkaar verrekend
{
  const geenAbsenties = chineseAbsentieStand([]);
  check("chineseAbsentieStand: 0 absenties -> 0 uur gebruikt", geenAbsenties.urenGebruikt, 0);
  check("chineseAbsentieStand: 0 absenties -> geen aftrek", geenAbsenties.aftrek, 0);
  check("chineseAbsentieStand: 0 absenties -> drempel niet bereikt", geenAbsenties.drempelBereikt, false);

  // 3 gemiste Chinese sessies (ma 07-09, wo 09-09, ma 14-09) = 9 uur, 3 boven
  // de 6-uursvrijstelling -> 1,5 punt aftrek. Nog ver onder de 1/3-drempel.
  const items = [
    { start: "2026-09-07", end: "2026-09-07", status: "vast" },
    { start: "2026-09-09", end: "2026-09-09", status: "vast" },
    { start: "2026-09-14", end: "2026-09-14", status: "vast" },
  ];
  const stand = chineseAbsentieStand(items);
  check("chineseAbsentieStand: 3 sessies gemist", stand.gemisteSessies, 3);
  check("chineseAbsentieStand: 9 uur gebruikt", stand.urenGebruikt, 9);
  check("chineseAbsentieStand: 3 uur boven de vrijstelling", stand.urenBovenVrijstelling, 3);
  check("chineseAbsentieStand: 1.5 punt aftrek", stand.aftrek, 1.5);
  check("chineseAbsentieStand: fractie nog ver onder 1/3", stand.fractieGemist < 1 / 3, true);
  check("chineseAbsentieStand: drempel niet bereikt bij 3 van 30", stand.drempelBereikt, false);
}

// migrate(): schemaVersion 6 -> 7 voegt pythonInschrijving/vakkenVeldwaarden toe
{
  const v6 = { ...leegState(), schemaVersion: 6 };
  delete v6.pythonInschrijving;
  delete v6.vakkenVeldwaarden;
  const gemigreerd = migrate(v6);
  check("migrate v6->v7: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v6->v7: pythonInschrijving default onbevestigd", gemigreerd.pythonInschrijving, "onbevestigd");
  check("migrate v6->v7: vakkenVeldwaarden default leeg object", Object.keys(gemigreerd.vakkenVeldwaarden).length, 0);

  const ongeldigeWaarde = migrate({ ...leegState(), pythonInschrijving: "iets-anders" });
  check("migrate: ongeldige pythonInschrijving valt terug op onbevestigd", ongeldigeWaarde.pythonInschrijving, "onbevestigd");
}

// zetPythonInschrijving() / zetVakVeld(): pure state-transformaties
{
  check("PYTHON_INSCHRIJVING_WAARDEN bevat de drie statussen", PYTHON_INSCHRIJVING_WAARDEN, ["onbevestigd", "bevestigd", "afgewezen"]);

  let state = leegState();
  state = zetPythonInschrijving(state, "afgewezen");
  check("zetPythonInschrijving: status bijgewerkt", state.pythonInschrijving, "afgewezen");

  state = zetVakVeld(state, "AGTECH.room", "博雅 305");
  check("zetVakVeld: waarde opgeslagen", state.vakkenVeldwaarden["AGTECH.room"], "博雅 305");
  state = zetVakVeld(state, "PY.opdrachtenIngeleverd", "3");
  check("zetVakVeld: tweede sleutel blijft naast de eerste staan", Object.keys(state.vakkenVeldwaarden).length, 2);
}

// sw.js: de fase 8F-bestanden zitten in de app-shell, het oude schermen.js niet meer
{
  const swBron = readFileSync(join(PROJECT_ROOT, "sw.js"), "utf8");
  check("sw.js: schermen.js niet meer gecachet (vervangen in 8F)", swBron.includes("ui/schermen.js"), false);
  for (const bestand of ["schermVakken.js", "vakkenData.js"]) {
    check(`sw.js: APP_SHELL bevat ui/${bestand}`, swBron.includes(`ui/${bestand}`), true);
  }
}

// Geen title-attributen in de fase 8F-bestanden
{
  for (const bestand of ["src/ui/schermVakken.js", "src/ui/vakkenData.js"]) {
    const bron = readFileSync(join(PROJECT_ROOT, bestand), "utf8");
    check(`${bestand}: geen title-attributen`, /\.title\s*=|setAttribute\(\s*["']title["']/.test(bron), false);
  }
}

// =====================================================================
// VAKKEN.md-correctiepas — bij tegenspraak met DATA.md geldt VAKKEN.md
// =====================================================================

// AgTech: vijf onderwerpen die in de oude data waren afgekort t.o.v. de
// letterlijke titel in VAKKEN.md §5, plus de nieuw toegevoegde sprekerdata.
{
  const gevonden = Object.fromEntries(agtechDates.map((d) => [d.week, d]));
  check("AGTECH wk6: volledige titel (was afgekort met een pijl)", gevonden[6].label, "Smart Agriculture: field monitoring to postharvest quality evaluation");
  check("AGTECH wk6: spreker Shih-Fang Chen", gevonden[6].spreker, "Shih-Fang Chen");
  check("AGTECH wk8: volledige titel (miste 'and Trends')", gevonden[8].label, "Global Pest Management Technologies and Trends");
  check("AGTECH wk10: volledige titel (was 'FarmiSpace / DATAYOO')", gevonden[10].label, "Unlocking the Infinite Possibilities of Agriculture using FarmiSpace");
  check("AGTECH wk10: DATAYOO Company nu als spreker, niet als deel van de titel", gevonden[10].spreker, "DATAYOO Company");
  check("AGTECH wk11: volledige titel (miste 'and Green Biotechnology')", gevonden[11].label, "Plant-Microbe Interactions and Green Biotechnology");
  check("AGTECH wk13: volledige titel (miste 'Applications of')", gevonden[13].label, "Applications of Plant Phenology and Crop Modeling");
  check("AGTECH wk1: spreker Chih-Wei Tung", gevonden[1].spreker, "Chih-Wei Tung");
  check("AGTECH wk3 (invited talk): spreker ONBEKEND blijft null, niet gegokt", gevonden[3].spreker, null);
  check("AGTECH: alle 16 weken hebben een spreker-veld (ook als het null is)", agtechDates.every((d) => "spreker" in d), true);
}

// Python: twee onderwerpen die waren afgekort t.o.v. de letterlijke titel
{
  const gevonden = Object.fromEntries(pythonDates.map((d) => [d.week, d]));
  check("PY wk10: volledige titel (was kort 'NumPy')", gevonden[10].label, "Something just like vectors and matrices: NumPy");
  check("PY wk11: volledige titel (was kort 'Pandas')", gevonden[11].label, "Something just like spreadsheets: Pandas");
}

// Python: drie cursusrestricties i.p.v. de ene die er eerder stond
{
  const py = courses.find((c) => c.id === "PY");
  check("PY: drie afzonderlijke cursusrestricties (was er maar één)", py.cursusrestricties.length, 3);
  check(
    "PY: restrictie 1 is de EECS-uitsluitingsregel (ontbrak volledig)",
    py.cursusrestricties[0].tekst.includes("Electrical Engineering and Computer Science"),
    true
  );
  check(
    "PY: restrictie 3 is de master/PhD-goedkeuringsbrief (ontbrak volledig)",
    py.cursusrestricties[2].tekst.includes("goedkeuringsbrief"),
    true
  );
  for (const [i, restrictie] of py.cursusrestricties.entries()) {
    check(`PY: cursusrestrictie[${i}] heeft geldige zekerheid`, ZEKERHEID_WAARDEN.includes(restrictie.zekerheid), true);
  }
}

// Docenten die 8F als ONBEKEND markeerde, zijn nu bekend (zie hierboven, fase
// 8F-sectie) — hier alleen de studiepunten-aanvulling die VAKKEN.md §1 gaf.
{
  check("CHI: studiepunten = 3 (VAKKEN.md §1)", courses.find((c) => c.id === "CHI").studiepunten, 3);
  check("PY: studiepunten = 3 (VAKKEN.md §1)", courses.find((c) => c.id === "PY").studiepunten, 3);
  check("PSY: studiepunten blijft ONBEKEND (VAKKEN.md §1 geeft geen waarde)", courses.find((c) => c.id === "PSY").studiepunten, null);
  check("AGTECH: studiepunten blijft ONBEKEND", courses.find((c) => c.id === "AGTECH").studiepunten, null);
  check("RTE: studiepunten blijft ONBEKEND", courses.find((c) => c.id === "RTE").studiepunten, null);
}

// RTE termproject: beschrijvende tekst die er nog niet stond
{
  const rte = projects.find((p) => p.id === "RTE_TERMPROJECT");
  check("RTE_TERMPROJECT: heeft nu een beschrijvende tekst", typeof rte.tekst === "string" && rte.tekst.length > 0, true);
  check("RTE_TERMPROJECT: tekst noemt groepen van 5", rte.tekst.includes("5 personen"), true);
  check("RTE_TERMPROJECT: tekst noemt de 15/10-verdeling", rte.tekst.includes("15%") && rte.tekst.includes("10%"), true);
}

// PSY: de expliciete "syllabus noemt geen wekelijkse opdrachten"-waarschuwing
// uit VAKKEN.md §3 mag nooit alsnog wekelijkse PSY-deadlines opleveren
{
  const psyGerelateerdeDeadlines = academicDeadlines.filter((d) => d.label?.toLowerCase().includes("psychol"));
  check("Geen verzonnen wekelijkse PSY-opdrachten in academicDeadlines (VAKKEN.md §3 waarschuwing)", psyGerelateerdeDeadlines.length, 0);
}

// =====================================================================
// FASE-9.md A2 — Japan-reis: omboeking in behandeling
// =====================================================================

// trips.js: structuur — status/variant/groep per item, geen boeking overschreven
{
  check("trips: precies 7 items (3 japan-geboekt + 3 japan-voorgenomen + 1 filipijnen)", trips.length, 7);
  check("TRIP_STATUSSEN bevat de drie statussen", TRIP_STATUSSEN, ["geboekt", "wijziging-aangevraagd", "vervallen"]);
  check("trips: elk item heeft een geldige status", trips.every((t) => TRIP_STATUSSEN.includes(t.status)), true);
  check("trips: elk item heeft variant + groep", trips.every((t) => typeof t.variant === "string" && typeof t.groep === "string"), true);

  const japanGeboekt = trips.filter((t) => t.variant === "japan-geboekt");
  check("japan-geboekt: 3 items (heenvlucht, verblijf, terugvlucht)", japanGeboekt.length, 3);
  check("japan-geboekt: allemaal status geboekt", japanGeboekt.every((t) => t.status === "geboekt"), true);
  check("japan-geboekt: verblijf 2026-10-30 → 2026-11-09 (ongewijzigd)", japanGeboekt.find((t) => t.type === "vaste-boeking").start, "2026-10-30");

  const japanVoorgenomen = trips.filter((t) => t.variant === "japan-voorgenomen");
  check("japan-voorgenomen: 3 items", japanVoorgenomen.length, 3);
  check("japan-voorgenomen: allemaal status wijziging-aangevraagd", japanVoorgenomen.every((t) => t.status === "wijziging-aangevraagd"), true);
  const voorgenomenVerblijf = japanVoorgenomen.find((t) => t.type === "vaste-boeking");
  check("japan-voorgenomen: verblijf 2026-11-05 → 2026-11-16", `${voorgenomenVerblijf.start} → ${voorgenomenVerblijf.end}`, "2026-11-05 → 2026-11-16");

  check("filipijnen: nog altijd 1 item, status geboekt, datums ongewijzigd", trips.find((t) => t.variant === "filipijnen-geboekt").start, "2026-09-25");
}

// effectieveTripStatus(): override wint van het standaardveld
{
  const item = trips.find((t) => t.variant === "japan-voorgenomen" && t.type === "vaste-boeking");
  check("effectieveTripStatus zonder override: standaardstatus", effectieveTripStatus(item), "wijziging-aangevraagd");
  check("effectieveTripStatus met override: override wint", effectieveTripStatus(item, { "japan-voorgenomen": "geboekt" }), "geboekt");
}

// dayStatus(): beide Japan-varianten zichtbaar in de overlap (05-11 t/m 09-11),
// maar alleen de geboekte telt mee voor status/dagdelen
{
  const dag = dayStatus("2026-11-06");
  check("2026-11-06: beide reisvarianten zichtbaar in vasteBoekingen", dag.vasteBoekingen.length, 2);
  check(
    "2026-11-06: statussen zijn geboekt en wijziging-aangevraagd",
    dag.vasteBoekingen.map((v) => v.status).sort().join(","),
    "geboekt,wijziging-aangevraagd"
  );
  check("2026-11-06: dagstatus === vaste-boeking (via de geboekte variant)", dag.status, "vaste-boeking");
}

// dayStatus(): met een override die japan-voorgenomen "geboekt" maakt, gaat
// 2026-11-16 (alleen gedekt door de voorgenomen variant) ook op vaste-boeking
{
  const zonder = dayStatus("2026-11-16");
  check("2026-11-16 zonder override: geen vaste boeking (voorgenomen telt niet mee)", zonder.status !== "vaste-boeking", true);

  const metOverride = dayStatus("2026-11-16", false, { "japan-voorgenomen": "geboekt" });
  check("2026-11-16 met japan-voorgenomen=geboekt: status === vaste-boeking", metOverride.status, "vaste-boeking");
}

// zetTripStatus(): cascade — nieuwe variant op geboekt zet de oude op vervallen
{
  let state = leegState();
  state = zetTripStatus(state, "japan-voorgenomen", "geboekt");
  check("zetTripStatus: japan-voorgenomen is nu geboekt", state.tripStatusOverrides["japan-voorgenomen"], "geboekt");
  check("zetTripStatus: japan-geboekt (dezelfde groep) automatisch vervallen", state.tripStatusOverrides["japan-geboekt"], "vervallen");
  check("zetTripStatus: filipijnen (andere groep) blijft ongemoeid", state.tripStatusOverrides["filipijnen-geboekt"], undefined);

  const nuVervallen = trips.find((t) => t.variant === "japan-geboekt" && t.type === "vaste-boeking");
  check(
    "2026-11-02 na de omwissel: de oude Japan-boeking is niet meer zichtbaar in vasteBoekingen",
    dayStatus("2026-11-02", false, state.tripStatusOverrides).vasteBoekingen.some((v) => v.variant === "japan-geboekt"),
    false
  );
  check("de vervallen variant blijft wél in trips.js staan (data niet weggegooid)", Boolean(nuVervallen), true);
}

// zetTripStatus(): ongeldige status of variant gooit een fout
{
  let fout = null;
  try {
    zetTripStatus(leegState(), "japan-voorgenomen", "onzin");
  } catch (e) {
    fout = e;
  }
  check("zetTripStatus: ongeldige status gooit een Error", fout instanceof Error, true);

  fout = null;
  try {
    zetTripStatus(leegState(), "bestaat-niet", "geboekt");
  } catch (e) {
    fout = e;
  }
  check("zetTripStatus: onbekende variant gooit een Error", fout instanceof Error, true);
}

// migrate(): schemaVersion 7 -> 8 voegt tripStatusOverrides toe, filtert ongeldige entries
{
  const v7 = { ...leegState(), schemaVersion: 7 };
  delete v7.tripStatusOverrides;
  const gemigreerd = migrate(v7);
  check("migrate v7->v8: schemaVersion wordt de actuele versie", gemigreerd.schemaVersion, CURRENT_SCHEMA_VERSION);
  check("migrate v7->v8: tripStatusOverrides default leeg object", Object.keys(gemigreerd.tripStatusOverrides).length, 0);

  const metOngeldigeData = migrate({
    ...leegState(),
    tripStatusOverrides: { "japan-voorgenomen": "geboekt", "onbekende-variant": "geboekt", "japan-geboekt": "onzin-status" },
  });
  check("migrate: geldige override blijft staan", metOngeldigeData.tripStatusOverrides["japan-voorgenomen"], "geboekt");
  check("migrate: onbekende variant wordt genegeerd", "onbekende-variant" in metOngeldigeData.tripStatusOverrides, false);
  check("migrate: ongeldige statuswaarde wordt genegeerd", "japan-geboekt" in metOngeldigeData.tripStatusOverrides, false);
}

// Uiterste terugkomst: 2026-11-19 als deadline-item, los van welke variant actief is
{
  check("japanUitersteTerugkomstDeadline: datum === 2026-11-19", japanUitersteTerugkomstDeadline.date, "2026-11-19");
  const dag = dayStatus("2026-11-19");
  check("2026-11-19: uiterste-terugkomst-deadline aanwezig", dag.deadlines.some((d) => d.label === japanUitersteTerugkomstDeadline.label), true);
  check("2026-11-19: RTE Assignment #7 (visit) staat er ook los van", dag.deadlines.some((d) => d.label.includes("Assignment #7")), true);
}

// Kostenvergelijking (DATA.md §4.1 / FASE-9.md A2-tabel): "laat de motor dit
// zelf uitrekenen" — costOfRange() rekent, wij kiezen alleen de juiste
// datumbereiken. Huidige boeking: het volledige, letterlijke bereik (geen
// tijdsgrens gesteld). Voorgenomen: vertrek na 17:20 (ná RTE) en terugkomst
// vóór 18:25 (vóór Chinees) betekenen dat 11-05 en 11-16 zelf geen les
// missen — het gemiste bereik is dus 11-06 t/m 11-15.
{
  const huidig = costOfRange("2026-10-30", "2026-11-09").perVak;
  check("Kostenvergelijking huidig: 3x Chinees", huidig.CHI, 3);
  check("Kostenvergelijking huidig: 1x AgTech (11-05; 10-29 valt buiten het bereik)", huidig.AGTECH, 1);
  check("Kostenvergelijking huidig: 1x RTE (11-05)", huidig.RTE, 1);
  check("Kostenvergelijking huidig: 1x PSY (11-04)", huidig.PSY, 1);
  check("Kostenvergelijking huidig: 1x Python (11-04)", huidig.PY, 1);

  const tentamensGeraaktHuidig = chineseTentamens.filter((t) => t.date >= "2026-10-30" && t.date <= "2026-11-09");
  check("Kostenvergelijking huidig: 2 van 3 CHI-tentamenonderdelen geraakt (02-11, 04-11)", tentamensGeraaktHuidig.length, 2);
  check(
    "Kostenvergelijking huidig: het zijn schriftelijk en presentatie, niet mondeling",
    tentamensGeraaktHuidig.map((t) => t.onderdeel).sort().join(","),
    "presentatie,schriftelijk"
  );

  const voorgenomen = costOfRange("2026-11-06", "2026-11-15").perVak;
  check("Kostenvergelijking voorgenomen: 2x Chinees (11-09, 11-11 — niet 11-16)", voorgenomen.CHI, 2);
  check("Kostenvergelijking voorgenomen: 1x AgTech (11-12 — niet 11-05)", voorgenomen.AGTECH, 1);
  check("Kostenvergelijking voorgenomen: 1x RTE (11-12)", voorgenomen.RTE, 1);
  check("Kostenvergelijking voorgenomen: 1x PSY (11-11)", voorgenomen.PSY, 1);
  check("Kostenvergelijking voorgenomen: 1x Python (11-11)", voorgenomen.PY, 1);

  const tentamensGeraaktVoorgenomen = chineseTentamens.filter((t) => t.date >= "2026-11-05" && t.date <= "2026-11-16");
  check("Kostenvergelijking voorgenomen: 0 CHI-tentamenonderdelen geraakt", tentamensGeraaktVoorgenomen.length, 0);

  const chi = courses.find((c) => c.id === "CHI");
  check(
    "Kostenvergelijking voorgenomen: 2 sessies × 3 uur = 6 uur, precies de vrijstelling",
    voorgenomen.CHI * chi.absentieregels.puntenaftrek.uurPerSessie,
    chi.absentieregels.puntenaftrek.vrijstellingUren
  );
}

// =====================================================================
// FASE-9.md A3 — PSY-leeshoofdstukken
// =====================================================================

{
  const metLezen = psyDates.filter((d) => d.lezen !== undefined);
  check("psyDates: precies 11 dagen met een leeshoofdstuk", metLezen.length, 11);

  const verwacht = {
    2: "hoofdstuk 1",
    3: "hoofdstuk 2",
    4: "hoofdstuk 14",
    5: "hoofdstuk 15",
    6: "hoofdstuk 5",
    9: "hoofdstuk 6",
    10: "hoofdstuk 7",
    11: "hoofdstuk 4",
    12: "hoofdstuk 12",
    13: "hoofdstuk 16",
    14: "hoofdstuk 11",
  };
  for (const [week, hoofdstuk] of Object.entries(verwacht)) {
    const dag = psyDates.find((d) => d.week === Number(week));
    check(`psyDates week ${week}: lezen === "${hoofdstuk}"`, dag.lezen, hoofdstuk);
  }

  const zonderLezen = [1, 7, 8, 15, 16];
  for (const week of zonderLezen) {
    const dag = psyDates.find((d) => d.week === week);
    check(`psyDates week ${week}: geen leesopdracht (geen veld, geen gok)`, dag.lezen, undefined);
  }
}

// FASE-9.md A3 — RTE-lesvorm: de "Lecture Style"-kolom uit de syllabus staat
// nergens in de repo (zie DATA.md §9-1h), dus alle 15 lesdagen zijn ONBEKEND
// in plaats van de 14-met-waarde/2-ONBEKEND die FASE-9.md veronderstelde.
// Elke lesdag heeft wél het veld — het is geen gok, maar ook niet weggelaten.
{
  const lesdagen = rteDates.filter((d) => d.type === "les");
  check("rteDates: 15 lesdagen", lesdagen.length, 15);
  check("rteDates: elke lesdag heeft het veld vorm", lesdagen.every((d) => "vorm" in d), true);
  check("rteDates: vorm is overal ONBEKEND (null) — niet verzonnen", lesdagen.every((d) => d.vorm === null), true);
  const tentamen = rteDates.find((d) => d.type === "tentamen");
  check("rteDates: het tentamen (geen lesdag) heeft geen vorm-veld", "vorm" in tentamen, false);
}

console.log(`\n${passed} geslaagd, ${failures} mislukt.`);
if (failures > 0) process.exit(1);
