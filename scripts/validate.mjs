import { parseYMD, toYMD, addDays, dayOfWeek, isoWeek, rangeDays, diffDays } from "../src/lib/date.js";

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

console.log(`\n${passed} geslaagd, ${failures} mislukt.`);
if (failures > 0) process.exit(1);
