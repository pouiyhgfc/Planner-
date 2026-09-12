# CLAUDE.md — harde regels voor dit project

Lees dit bestand volledig voordat je iets doet. Lees daarna `DATA.md` en `PLAN.md`.
Deze regels gaan boven je eigen voorkeuren. Bij twijfel: stop en vraag.

---

## 1. Wat we bouwen

Een statische web-app: **schoolkalender** voor de periode **2026-09-01 t/m
2027-02-28** (181 dagen). Doel: de gebruiker (Idries, uitwisselingsstudent NTU
Taipei) ziet in één verticale lijst alle lessen, tentamens, deadlines en vrije
dagdelen, plus wat het kost om een bepaald dagdeel te missen.

**De app plant geen reizen.** Hij stelt geen bestemmingen voor, zoekt geen
vluchten, geeft geen advies. De gebruiker vult zelf in; de app laat alleen
zien wat waar past en wat het kost. Bouw geen enkele suggestiefunctie.

Draait op Chrome Android en desktop. Wordt gedeployed op Vercel als statische site.

## 2. Techniek — niet negotiabel

- **Geen framework.** Geen React, Vue, Svelte, Alpine, jQuery.
- **Geen build-stap.** Geen bundler, geen transpiler, geen PostCSS, geen Tailwind.
- **Geen runtime-dependencies.** `package.json` bestaat alleen voor dev-scripts
  (validatie/tests). De app in de browser laadt nul externe bestanden — geen CDN,
  geen webfont, geen icon-library.
- Vanilla JS met native ES modules (`<script type="module">`).
- Plain CSS in één bestand. CSS custom properties voor kleuren.
- Geen TypeScript. JSDoc-annotaties mogen wel.

## 3. Datum- en tijdregels — hier gaat het altijd fout, dus lees twee keer

- **Elke datum is een string in het formaat `YYYY-MM-DD`.** Altijd. In data, in
  state, in localStorage/IndexedDB, in vergelijkingen, als object-key.
- **Gebruik `new Date(...)` NIET voor kalenderlogica.** Geen `new Date(str)`, geen
  `setDate(d.getDate()+1)`, geen `getTimezoneOffset()`. Dat introduceert tijdzone-
  en DST-fouten. De gebruiker reist tussen Nederland (DST) en Taiwan (geen DST).
- Schrijf in `src/lib/date.js` eigen pure functies die alléén op strings en
  integers werken:
  - `parseYMD(s) -> {y, m, d}`
  - `toYMD({y,m,d}) -> "YYYY-MM-DD"`
  - `addDays(ymd, n) -> ymd` (eigen implementatie met dagen-in-maand + schrikkeljaar)
  - `dayOfWeek(ymd) -> 0..6` (0 = maandag) — via Zeller of Sakamoto, geen Date
  - `isoWeek(ymd) -> {isoYear, week}`
  - `rangeDays(startYmd, endYmd) -> string[]`
  - `diffDays(a, b) -> int`
- **Gebruik de Temporal API niet.** Die is nog geen Baseline en werkt niet op alle
  doelbrowsers. Geen polyfill.
- Elke functie in `date.js` moet een test hebben met minstens: maandgrens,
  jaargrens (2026-12-31 → 2027-01-01), 28-februari-2027 (geen schrikkeljaar),
  en de exacte dagen uit `DATA.md`.

## 4. Opslag

- **Primaire opslag: IndexedDB.** Niet localStorage — die is 5 MB, synchroon en
  even kwetsbaar voor eviction.
- Vraag bij eerste start `navigator.storage.persist()` aan. Log de uitkomst,
  maar laat de app werken ongeacht het antwoord.
- **Verplichte export/import naar JSON-bestand.** De browser kan opslag wissen
  en daar is geen absolute bescherming tegen. Export is de echte backup.
  Bouw dit in fase 5, niet later.
- Eén enkel state-object, één versienummer erin (`schemaVersion`), en een
  migratiefunctie die nooit stilzwijgend data weggooit.

## 5. Data-integriteit — de belangrijkste regel

- `DATA.md` is de **enige bron van waarheid** voor kalenderfeiten. Alles daarin
  wordt overgezet naar `src/data/*.js` met behoud van het veld `bron` en
  `zekerheid` per item.
- **Verzin geen kalendergegevens.** Geen feestdag, lesdatum, tentamendatum of
  deadline die niet letterlijk in `DATA.md` staat. Ook niet als je "weet" dat het
  klopt. Ook niet om een gat te vullen.
- Staat er `ONBEKEND` of `TE VERIFIËREN` in `DATA.md`? Dan komt dat item in de
  app met een zichtbare markering, niet met een gok.
- **Hardcode geen datum in UI-code of logica.** Elke datum komt uit `src/data/`.
  Als je ergens `"2026-12-31"` in een component typt, is dat een fout.
- Afgeleide feiten (weekdag, weeknummer, vrije blokken, aantal gemiste lessen)
  worden **berekend**, nooit ingevoerd.

## 6. Anti-slop

- Geen placeholder-content, geen `// TODO: implement`, geen mock-data die "later
  echt wordt". Wat je oplevert werkt of bestaat niet.
- Geen defensieve `try/catch` die fouten stil doorslikt. Fouten horen zichtbaar
  te zijn.
- Geen functie die je niet gebruikt. Geen abstractielaag "voor later".
- Geen commentaar dat herhaalt wat de code doet. Commentaar alleen voor *waarom*.
- UI: functioneel en dicht, zoals een spreadsheet. Geen gradients, geen
  decoratieve animaties, geen emoji in de interface, geen afgeronde
  "card"-stapels. Informatiedichtheid boven sfeer.
- Nederlandse labels in de UI. Code, bestandsnamen en commits in het Engels.

## 7. Werkwijze — gefaseerd, met stops

- Werk `PLAN.md` af van fase 0 naar fase 7. **Sla geen fase over.**
- Per fase: bouw alleen wat die fase beschrijft. Bouw niet vooruit.
- Aan het eind van elke fase: run de validatie van die fase, print de uitkomst,
  en **STOP. Vraag expliciet om akkoord voordat je aan de volgende fase begint.**
- Kom je iets tegen dat in strijd is met `DATA.md` of met dit bestand: stop,
  benoem het conflict, en wacht. Los het niet zelf op.
- Commit per fase, één commit, met een bericht dat het fasenummer noemt.

## 8. Definitie van "klaar" per fase

Een fase is pas klaar als:
1. De validatie/test van die fase draait en groen is (`node scripts/validate.mjs`).
2. Er geen `TODO`, `FIXME`, `mock`, of ongebruikte export in de nieuwe code staat.
3. Geen enkele datum hardcoded buiten `src/data/`.
4. Je in één alinea kunt zeggen wat er nu werkt en wat expliciet nog niet werkt.
