# PLAN.md — gefaseerd bouwplan

Werk fase 0 → 7 af. **Na elke fase: valideren, resultaat tonen, STOPPEN en om
akkoord vragen.** Bouw nooit vooruit op een latere fase.

Bestandsstructuur die we aanhouden (niet afwijken zonder te vragen):

```
/
  index.html
  styles.css
  CLAUDE.md
  DATA.md
  PLAN.md
  package.json          (alleen dev-scripts)
  src/
    lib/date.js         pure datumfuncties, geen Date-object
    lib/blocks.js       vrije-blokken-detectie
    data/semester.js    periode, semestergrenzen
    data/holidays.js    feestdagen + geen-lesdagen
    data/courses.js     vakken + wekelijks rooster
    data/coursedates.js per vak de losse datums en deadlines
    data/trips.js       vaste boekingen (Japan)
    data/deadlines.js   harde deadlines (China, flexibele week)
    state/store.js      state + IndexedDB
    state/schema.js     schemaVersion + migratie
    ui/*.js             rendering
  scripts/
    validate.mjs        alle checks, uitvoerbaar met node
```

---

## Fase 0 — Fundament en datumbibliotheek

**Alleen dit. Nog geen data, nog geen UI, nog geen HTML-inhoud.**

Bouw:
- Lege repo-structuur zoals hierboven, `index.html` met alleen een skelet.
- `src/lib/date.js` met alle functies uit CLAUDE.md §3, puur op strings/integers.
- `scripts/validate.mjs` dat de datumfuncties test.

Tests die moeten slagen:
- `addDays("2026-12-31", 1) === "2027-01-01"`
- `addDays("2027-02-28", 1) === "2027-03-01"` (2027 is geen schrikkeljaar)
- `addDays("2026-10-31", 1) === "2026-11-01"`
- `addDays("2026-09-01", 180) === "2027-02-28"`
- `diffDays("2026-09-01", "2027-02-28") === 180`
- `dayOfWeek` op alle datums in deze lijst, met verwachte uitkomst:
  2026-09-07 ma · 2026-09-25 vr · 2026-09-28 ma · 2026-10-09 vr · 2026-10-10 za ·
  2026-10-25 zo · 2026-10-26 ma · 2026-10-28 wo · 2026-10-29 do · 2026-10-30 vr ·
  2026-11-09 ma · 2026-12-18 vr · 2026-12-23 wo · 2026-12-24 do · 2026-12-25 vr ·
  2026-12-31 do · 2027-01-01 vr · 2027-02-04 do · 2027-02-09 di · 2027-02-22 ma ·
  2027-02-28 zo
- `rangeDays("2026-09-01","2027-02-28").length === 181`
- `isoWeek("2026-12-31")` en `isoWeek("2027-01-01")` — controleer handmatig dat
  de ISO-jaargrens correct wordt behandeld en documenteer de verwachte waarde
  in de test.

**Klaar als:** `node scripts/validate.mjs` groen is. Geen enkele `new Date()` in
`src/lib/date.js`. **STOP.**

---

## Fase 1 — Datalaag uit DATA.md

Zet `DATA.md` om naar `src/data/*.js`. Handmatig, regel voor regel. Niets
genereren, niets aanvullen.

Datamodel per item minimaal:
```js
{ date: "2026-10-28", type: "exam", course: "PSY1007",
  label: "Midterm Exam", bron: "syllabus PSY1007-09", zekerheid: "ZEKER" }
```

- `semester.js`: app-periode, semesterstart/einde, tentamenperiodes, flexibele
  week, wintervakantie.
- `holidays.js`: alle feestdagen en geen-lesdagen uit DATA.md §2.
- `courses.js`: de drie vakken met weekdag, begin- en eindtijd, zaal
  (AgTech-zaal = `null` met `zekerheid: "ONBEKEND"`).
- `coursedates.js`: alle rijen uit DATA.md §3.1, §3.2, §3.3 inclusief deadlines.
- `trips.js`: de Japan-boeking als bereik 2026-10-30 → 2026-11-09.
- `deadlines.js`: China 2026-12-31, flexibele-week-aankondiging 2026-11-28.

Validatie in `validate.mjs` uitbreiden:
- Elke datum in elk data-bestand valideert tegen `YYYY-MM-DD` en valt binnen de
  app-periode. Uitzondering: niets. Valt iets erbuiten, dan is het een fout.
- Elk item heeft `bron` en `zekerheid`; `zekerheid` is één van de drie waardes.
- Aantal PSY-lesdagen === 16, AgTech === 16, RTE === 16.
- Elke PSY-datum is een woensdag; elke AgTech- en RTE-datum is een donderdag.
  (Dit is de belangrijkste check: hij vangt typefouten in de datalaag direct.)
- General Chinese wordt **niet als lijst ingevoerd** maar gegenereerd uit
  weekdag (ma + wo) + semestergrenzen (2026-09-07 → 2026-12-18) − feestdagen.
  De gegenereerde lijst moet exact overeenkomen met DATA.md §3.4:
  13 maandagen, 15 woensdagen, 28 lessen totaal. Wijkt het af, dan is de
  feestdagenlijst of de generator fout — niet de controlelijst aanpassen.
- Geen dubbele datum binnen hetzelfde vak.

**Klaar als:** alle checks groen. **STOP.**

---

## Fase 2 — Dagen genereren en statisch tonen

Genereer de 181 dagen en render ze als één verticale lijst. Read-only, geen
interactie, geen opslag.

Per dag tonen:
- datum, weekdag, ISO-weeknummer
- status: `les` / `tentamen` / `feestdag` / `geen-les` / `vakantie` / `vrij`
- de vakken met tijden die op die dag vallen
- deadlines die op die dag vallen
- of de dag binnen een vaste boeking valt (Japan)

Regels:
- Statusbepaling is één pure functie `dayStatus(ymd, data) -> {...}`. Niet
  verspreid over de UI.
- **Een dag is geen binaire vrij/bezet.** Werk met dagdelen: `ochtend`
  (tot 12:10), `middag` (12:10–18:00), `avond` (18:00–21:00). Een maandag met
  alleen Chinees is 's ochtends en 's middags vrij en 's avonds bezet, en dat
  moet je in de rij kunnen zien. Dit is de reden dat het standaardvenster op
  maandag 18:00 eindigt en niet op maandag 00:00.
- Voorrangsorde bij samenloop expliciet vastleggen in code-commentaar en in de
  functie: `vaste boeking` > `tentamen` > `feestdag / geen-les` > `les` >
  `vakantie` > `vrij`.
- Maandkoppen tussen de dagen. Weekgrenzen visueel zichtbaar.
- Geen scroll-magie, geen virtualisatie. 181 rijen is niets.

Validatie:
- Precies 181 gerenderde dagrijen.
- 2026-10-28 heeft status `tentamen` met PSY-midterm.
- 2026-10-29 heeft twee vakken (AgTech + RTE) én valt in de midterm-periode.
- 2026-10-28 heeft PSY-midterm 's ochtends **en** Chinees 's avonds.
- 2026-10-30 t/m 2026-11-09 zijn gemarkeerd als vaste boeking.
- 2026-09-25 is `feestdag`, geen les — ook al is het geen lesdag voor hem.
- 2026-09-28 is feestdag én normaal gesproken een Chinees-maandag: er staat
  géén les op die dag.
- 2026-11-16 (maandag) is ochtend en middag vrij, avond bezet.
- 2027-01-15 is `vakantie`.

**Klaar als:** de lijst klopt op deze zes steekproeven. **STOP.**

---

## Fase 3 — Vrije-blokken-motor

Dit is de kern van de app. Pure functies in `src/lib/blocks.js`, geen UI.

Definieer:
- `isFree(ymd, data)` — een dag is vrij als er geen les, tentamen, deadline-actie
  of vaste boeking op valt. Feestdag en vakantie tellen als vrij.
- `freeBlocks(data)` — alle maximale aaneengesloten reeksen vrije dagen, met
  `start`, `end`, `length`.
- `blocksWithCost(data, maxMissedClassDays)` — blokken die je krijgt als je
  bereid bent N lesdagen te missen, met per blok een `cost`-object:
  welke vakken, welke datums, en de puntenconsequentie (AgTech −15 per absentie,
  RTE gemiste in-class assignment, PSY gemist tentamen = 0).

Validatie — deze uitkomsten moeten kloppen:
- Het terugkerende blok **met nul absenties** is vrijdag 00:00 → maandag 18:00,
  en komt in elke volledige lesweek voor. De motor moet dit als 3,5 dag
  rapporteren, niet als 4.
- Bij **één** toegestane absentie verlengt datzelfde blok naar vrijdag → dinsdag
  23:59 = 5 dagen, met kosten: 1× General Chinese (maandagavond). Dit moet als
  aparte, expliciet gelabelde optie uit de motor komen.
- Bij twee absenties: vrijdag → woensdag 18:00, kosten 2× Chinees + 1× PSY.
- Het langste blok in de hele periode begint na het laatste tentamen
  (2026-12-24) en loopt door tot de spring semester start (2027-02-22),
  met de flexibele week 2026-12-28 → 12-31 als gemarkeerd risico erin.
- `blocksWithCost(data, 0)` bevat geen enkel blok dat een lesmoment uit het
  semester omvat — ook geen maandag- of woensdagavond.
- **Harde controlewaarde:** de Japan-boeking 2026-10-30 → 11-09 kost
  **3× General Chinese** (11-02, 11-04, 11-09), 2× AgTech (10-29, 11-05),
  2× RTE (10-29, 11-05) en 1× PSY (11-04). De motor rekent dit zelf uit.
  Komt er iets anders uit, dan stop je en meld je het.

**Klaar als:** deze vier uitkomsten door de validatie worden bevestigd. **STOP.**

---

## Fase 4 — Plannen en opslaan

Nu pas interactie.

De gebruiker plant zijn reizen zelf. De app plant niks en stelt niks voor; hij
laat alleen zien wat een dag kost. Houd de invoer daarom minimaal.

- Een eigen item toewijzen aan één dag of aan een bereik.
- Velden per item, en niet meer: naam, bereik, status (`idee` / `vast`), notitie.
  Geen reistype, geen bestemmingsveld, geen boekingsvelden, geen prijzen.
- Opslag in IndexedDB via `store.js`, één state-object, `schemaVersion: 1`.
- `navigator.storage.persist()` aanvragen bij eerste start; uitkomst in de UI
  tonen als één regel, niet als popup.
- Toewijzen aan een dag met een les of tentamen: toegestaan, maar de UI toont de
  kosten uit fase 3 erbij. Geen blokkade, wel een waarschuwing.

Validatie:
- State overleeft een herlaad van de pagina.
- State overleeft het sluiten en heropenen van de browser.
- Migratiefunctie: laad een state met `schemaVersion: 0` en controleer dat er
  niets verdwijnt.

**Klaar als:** dit alle drie werkt. **STOP.**

---

## Fase 5 — Export en import

Niet uitstellen. Dit is de enige echte backup.

- Export: hele state als JSON-bestand downloaden, bestandsnaam met datum.
- Import: JSON inlezen, valideren tegen het schema, en **samenvoegen** — niet
  blind overschrijven. Bij conflict per item vragen of de nieuwste voorrang krijgt.
- Een zichtbare regel in de UI: wanneer de laatste export was. Ouder dan 14
  dagen → waarschuwing.

**Klaar als:** export → state wissen → import geeft exact de oude state terug. **STOP.**

---

## Fase 6 — Deadlines en waarschuwingen

Pas nu de intelligentie erbovenop. Alles berekend, niets hardcoded.

- Aftelling naar 2026-12-31 (China visumvrij) met de markering dat de regel
  onbevestigd is.
- Waarschuwing bij 2026-11-28: flexibele week moet dan bekend zijn.
- Chinees Nieuwjaar 2027-02-04 t/m 02-10 gemarkeerd als "vervoer en hotels
  extreem druk".
- Overzichtspaneel bovenaan, in deze volgorde:
  1. aantal resterende blokken van 3,5 dag zonder absentie
  2. aantal resterende blokken van 5 dagen bij 1 absentie
  3. blokken van ≥ 7 dagen (alleen in de wintervakantie)
  4. lopend totaal van al ingeplande absenties per vak
- Punt 4 is het belangrijkste cijfer voor de gebruiker: hij wil zien hoeveel
  Chinees-lessen hij al kwijt is voordat hij een volgende reis erin zet.
- Elke maand zonder seizoensdata toont "seizoensdata ontbreekt" — geen schatting.
- Geen boekingsherinneringen, geen reisvoorstellen, geen bestemmingen. De app
  toont de schoolkalender en de kosten; de gebruiker vult zelf in.

**Klaar als:** de China-aftelling, het blokoverzicht en de absentieteller
kloppen op een gesimuleerde datum. **STOP.**

---

## Fase 7 — PWA en deploy

1. **Eerst opzoeken** (dit staat op ONBEKEND in DATA.md §8): de minimale
   verplichte `manifest.json`-velden en iconformaten voor "Toevoegen aan
   startscherm" in Chrome Android. Rapporteer wat je vindt, met bron, vóór je
   het implementeert.
2. `manifest.json` + iconen.
3. Minimale service worker: cache de app-shell, netwerk-first voor niets
   (er is geen netwerkverkeer). App moet volledig offline werken.
4. Vercel: `index.html` in de root, geen build-stap, geen `vercel.json` tenzij
   nodig gebleken.
5. Test: installeren op Android, offline openen, state nog aanwezig.

**Klaar als:** de app vanaf het startscherm offline opent met behouden data.

---

## Wat expliciet NIET in versie 1 komt

Noem dit niet als beperking in de UI, bouw het simpelweg niet:
- synchronisatie met Google/Apple Calendar
- notificaties
- meerdere apparaten
- prijzen, vluchtzoeken, kaartweergave
- seizoens- of weerlogica (data ontbreekt)
- accounts of backend
