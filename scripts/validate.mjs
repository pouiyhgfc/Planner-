import { parseYMD, toYMD, addDays, dayOfWeek, isoWeek, rangeDays, diffDays } from "../src/lib/date.js";
import { appPeriod, timezone, week12, semesterMarkers, calendarNotes } from "../src/data/semester.js";
import { holidays } from "../src/data/holidays.js";
import { courses } from "../src/data/courses.js";
import { psyDates, agtechDates, rteDates, rteActionItems, chineseLessons, chineseExamSlots } from "../src/data/coursedates.js";
import { trips } from "../src/data/trips.js";
import { chinaVisaFreeDeadline, flexWeekAnnouncementDeadline, academicDeadlines } from "../src/data/deadlines.js";
import { dayStatus, genereerKalenderDagen } from "../src/lib/dayStatus.js";

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
}

for (const d of psyDates) checkItem(`psyDates: ${d.date}`, d);
for (const d of agtechDates) checkItem(`agtechDates: ${d.date}`, d);
for (const d of rteDates) checkItem(`rteDates: ${d.date}`, d);
for (const d of rteActionItems) checkItem(`rteActionItems: ${d.date} ${d.label}`, d);
for (const d of chineseLessons) checkItem(`chineseLessons: ${d.date}`, d);
for (const d of chineseExamSlots) checkItem(`chineseExamSlots: ${d.label}`, d);

for (const t of trips) checkItem(`trips: ${t.label}`, t);

checkItem("chinaVisaFreeDeadline", chinaVisaFreeDeadline);
checkItem("flexWeekAnnouncementDeadline", flexWeekAnnouncementDeadline);
for (const a of academicDeadlines) checkItem(`academicDeadlines: ${a.label}`, a);
check("flexWeekAnnouncementDeadline valt op einde week12", flexWeekAnnouncementDeadline.date, week12.end);

// --- lesdag-tellingen (belangrijkste typefoutcheck in de datalaag) ---
check("psyDates.length === 16", psyDates.length, 16);
check("agtechDates.length === 16", agtechDates.length, 16);
check("rteDates.length === 16", rteDates.length, 16);

for (const d of psyDates) check(`${d.date} is woensdag (PSY)`, dayOfWeek(d.date), DAG.wo);
for (const d of agtechDates) check(`${d.date} is donderdag (AgTech)`, dayOfWeek(d.date), DAG.do);
for (const d of rteDates) check(`${d.date} is donderdag (RTE)`, dayOfWeek(d.date), DAG.do);

// --- General Chinese generator vs. controlelijst DATA.md §3.4 ---
const chiMondays = chineseLessons.filter((l) => dayOfWeek(l.date) === DAG.ma);
const chiWednesdays = chineseLessons.filter((l) => dayOfWeek(l.date) === DAG.wo);
check("General Chinese: aantal maandagen", chiMondays.length, 13);
check("General Chinese: aantal woensdagen", chiWednesdays.length, 15);
check("General Chinese: totaal aantal lessen", chineseLessons.length, 28);
check("General Chinese: 2026-09-28 (feestdag) niet in de lijst", chineseLessons.some((l) => l.date === "2026-09-28"), false);
check("General Chinese: 2026-10-26 (feestdag) niet in de lijst", chineseLessons.some((l) => l.date === "2026-10-26"), false);

// --- geen dubbele datum binnen hetzelfde vak ---
function checkNoDuplicateDates(label, items) {
  const dates = items.map((i) => i.date);
  const unique = new Set(dates);
  check(`${label}: geen dubbele datum`, dates.length, unique.size);
}
checkNoDuplicateDates("psyDates", psyDates);
checkNoDuplicateDates("agtechDates", agtechDates);
checkNoDuplicateDates("rteDates", rteDates);
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

console.log(`\n${passed} geslaagd, ${failures} mislukt.`);
if (failures > 0) process.exit(1);
