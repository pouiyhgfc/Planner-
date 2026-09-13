/**
 * Pure date functions. Every date is a "YYYY-MM-DD" string. No `Date` object
 * anywhere in this file — see CLAUDE.md §3 for why (DST/tijdzone-fouten
 * tussen Nederland en Taiwan).
 */

/**
 * @param {number} y
 * @returns {boolean}
 */
function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/**
 * @param {number} y
 * @param {number} m 1..12
 * @returns {number}
 */
function daysInMonth(y, m) {
  const lengths = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[m - 1];
}

/**
 * Number of leap years strictly before year y (i.e. among years 1..y-1).
 * @param {number} y
 * @returns {number}
 */
function leapDaysBefore(y) {
  const yy = y - 1;
  return Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400);
}

/**
 * Proleptic-Gregorian ordinal day number, where 0001-01-01 = 1.
 * @param {number} y
 * @param {number} m
 * @param {number} d
 * @returns {number}
 */
function toOrdinal(y, m, d) {
  let days = 365 * (y - 1) + leapDaysBefore(y);
  for (let mm = 1; mm < m; mm++) days += daysInMonth(y, mm);
  return days + d;
}

/**
 * Inverse of toOrdinal.
 * @param {number} ord
 * @returns {{y: number, m: number, d: number}}
 */
function fromOrdinal(ord) {
  let y = Math.floor(ord / 365.2425) + 1;
  while (toOrdinal(y + 1, 1, 1) <= ord) y++;
  while (toOrdinal(y, 1, 1) > ord) y--;
  let remaining = ord - toOrdinal(y, 1, 1) + 1;
  let m = 1;
  while (remaining > daysInMonth(y, m)) {
    remaining -= daysInMonth(y, m);
    m++;
  }
  return { y, m, d: remaining };
}

/**
 * @param {string} s "YYYY-MM-DD"
 * @returns {{y: number, m: number, d: number}}
 */
export function parseYMD(s) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) throw new Error(`geen geldige YYYY-MM-DD datum: ${s}`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) {
    throw new Error(`ongeldige datum: ${s}`);
  }
  return { y, m, d };
}

/**
 * @param {{y: number, m: number, d: number}} ymd
 * @returns {string} "YYYY-MM-DD"
 */
export function toYMD({ y, m, d }) {
  const yy = String(y).padStart(4, "0");
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * @param {string} ymd
 * @param {number} n days to add (may be negative)
 * @returns {string}
 */
export function addDays(ymd, n) {
  const { y, m, d } = parseYMD(ymd);
  const ord = toOrdinal(y, m, d) + n;
  return toYMD(fromOrdinal(ord));
}

/**
 * Day of week via Sakamoto's algorithm. 0 = maandag ... 6 = zondag.
 * @param {string} ymd
 * @returns {number}
 */
export function dayOfWeek(ymd) {
  const { y, m, d } = parseYMD(ymd);
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let yy = y;
  if (m < 3) yy -= 1;
  const sunday0 = (yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) + t[m - 1] + d) % 7;
  return (sunday0 + 6) % 7;
}

/**
 * @param {string} ymd
 * @returns {number} dag-in-jaar, 1-based
 */
function dayOfYear(ymd) {
  const { y, m, d } = parseYMD(ymd);
  return toOrdinal(y, m, d) - toOrdinal(y, 1, 1) + 1;
}

/**
 * ISO 8601 week-nummer. Het isoYear van een datum is het jaar van de
 * donderdag in dezelfde week (ISO 8601 §2.2.10) — daarom kan isoYear
 * afwijken van het kalenderjaar rond de jaargrens.
 * @param {string} ymd
 * @returns {{isoYear: number, week: number}}
 */
export function isoWeek(ymd) {
  const isoDay = dayOfWeek(ymd) + 1; // 1 = maandag ... 7 = zondag
  const thursday = addDays(ymd, 4 - isoDay);
  const { y: isoYear } = parseYMD(thursday);
  const doy = dayOfYear(thursday);
  const week = Math.floor((doy - 1) / 7) + 1;
  return { isoYear, week };
}

/**
 * @param {string} startYmd inclusief
 * @param {string} endYmd inclusief
 * @returns {string[]}
 */
export function rangeDays(startYmd, endYmd) {
  const { y: sy, m: sm, d: sd } = parseYMD(startYmd);
  const { y: ey, m: em, d: ed } = parseYMD(endYmd);
  const startOrd = toOrdinal(sy, sm, sd);
  const endOrd = toOrdinal(ey, em, ed);
  const out = [];
  for (let ord = startOrd; ord <= endOrd; ord++) {
    out.push(toYMD(fromOrdinal(ord)));
  }
  return out;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} aantal dagen van a naar b (negatief als b vóór a ligt)
 */
export function diffDays(a, b) {
  const { y: ay, m: am, d: ad } = parseYMD(a);
  const { y: by, m: bm, d: bd } = parseYMD(b);
  return toOrdinal(by, bm, bd) - toOrdinal(ay, am, ad);
}
