# FASE-8.md — herontwerp: visueel systeem, navigatie en schermen

Vervangt de vorige versie van dit bestand. Aanleiding: er is een vijfde vak
bijgekomen (Computer Programming in Python) en daarmee verandert de
weekstructuur.

Deze fase vervangt de complete UI-laag en corrigeert de datalaag. `src/lib/`
blijft ongewijzigd.

Werk 0A → 8F af. Na elke subfase: valideren, tonen, **STOP** en om akkoord vragen.

---

## 0A — WIJZIGING OP CLAUDE.md

CLAUDE.md §2 verbood webfonts en externe bestanden. Dat verbod wordt beperkt:

- **Nog steeds verboden:** frameworks, build-stap, runtime-dependencies, CDN's.
- **Nieuw toegestaan:** zelf-gehoste `.woff2`-fontbestanden in `/fonts/`,
  geladen met `@font-face` uit `styles.css`.

Download de variable woff2-bestanden van DM Sans, Outfit en Schibsted Grotesk
één keer, commit ze in `/fonts/`, en voeg ze toe aan de service-worker-cache.
Geen `fonts.googleapis.com`-link: dat is een CDN en breekt offline gebruik.

Al het overige in CLAUDE.md blijft gelden, in het bijzonder §3 (datumstrings),
§5 (DATA.md is de enige bron van waarheid) en §6 (anti-slop).

---

## 0B — CORRECTIES OP DE DATALAAG

Voer deze correcties uit vóór 8A. Werk eerst DATA.md bij, dan `src/data/`,
dan valideren.

### Correctie 1 — foute vakcode bij AgTech

DATA.md §1 schrijft `946 U0060 (ser. 52089)` toe aan Global AgTech Foresight.
**Dat is fout.** Die code hoort bij het Python-vak (zie correctie 2).

De code van AgTech Foresight is **ONBEKEND**. Haal de code weg, laat de rest
van de AgTech-regel staan, en zet de code op `null` met
`zekerheid: "ONBEKEND"`.

### Correctie 2 — nieuw vak: Computer Programming in Python

Bron: NTU-cursuspagina, aangeleverd door Idries. Zekerheid **ZEKER** voor de
cursusgegevens, **TE VERIFIËREN** voor de inschrijving (zie correctie 3).

| Veld | Waarde |
|---|---|
| Naam | Computer Programming in Python |
| Curriculum Number | Data5006 |
| Curriculum Identity Number | 946EU0060 |
| Klas | 03 |
| Serienummer | 52089 |
| Docent | LIN, TSE-YU |
| Dag en tijd | **woensdag, periodes 6/7/8 — 13:20–16:20** |
| Zaal | ONBEKEND |
| Studiepunten | 3 |
| Type | half jaar |
| Maximum studenten | 80 |

**Weekindeling** (genereren uit weekdag + semestergrenzen, niet intypen;
lijst staat er ter controle):

| Week | Datum | Onderwerp |
|---|---|---|
| 1 | 2026-09-09 | Course Introduction and Google Colab |
| 2 | 2026-09-16 | Your First Python Program |
| 3 | 2026-09-23 | Basic Types in Python |
| 4 | 2026-09-30 | More Python Types |
| 5 | 2026-10-07 | More Python Types |
| 6 | 2026-10-14 | Self-defined Functions |
| 7 | 2026-10-21 | Control Flow |
| 8 | 2026-10-28 | Text Processing |
| 9 | 2026-11-04 | Nested Structure |
| 10 | 2026-11-11 | NumPy |
| 11 | 2026-11-18 | Pandas |
| 12 | 2026-11-25 | Invited Speaker (TBD) |
| 13 | 2026-12-02 | Invited Speaker (TBD) |
| 14 | 2026-12-09 | Project Presentation |
| 15 | 2026-12-16 | Project Presentation |
| 16 | 2026-12-23 | Project Presentation |

Controlewaarde: **16 woensdagen, geen enkele valt op een feestdag.**

**Beoordeling:** aanwezigheid 10%, opdrachten 65% (ongeveer 10–12 stuks,
programmeeropdrachten en online quizzes), groepsproject 25%.

**Aanwezigheidsregels:** minstens drie keer een presentiecontrole, mogelijk
meer dan één keer per week. Verlof uitsluitend **vóór** de les aanvragen via
MyNTU; achteraf wordt niet geaccepteerd. Bewijsstukken vereist bij alle
verlofcategorieën behalve mentale gezondheid en menstruatieverlof.
**Weken 12 t/m 16 zijn aangemerkt als tentamenperiode**; in die periode
worden alleen bepaalde verlofsoorten geaccepteerd. Er is geen losse
tentamendatum; weken 14–16 zijn projectpresentaties.

**Groepsproject:** verplicht in groepsverband, individueel werk wordt niet
geaccepteerd. Geen groep vormen binnen de gestelde termijn betekent een F
voor het hele vak. De groepsgrootte en de termijn worden in de les
aangekondigd en zijn nu **ONBEKEND** — maak hiervoor een leeg veld met een
invoermogelijkheid, en zet in `projects.js` een project "Python groepsproject"
met alleen de bekende presentatiedata. **Verzin geen termijn.**

**Cursusrestricties die relevant zijn:** voor bachelorstudenten met een
hoofd-, tweede of bijvak in een afdeling die programmeervakken aanbiedt geldt
een strengere cijfergrens (voorbeeld uit de syllabus: 95+ in plaats van 90+
voor een A+). Registreer dit als open punt; of dat op civiele techniek van
toepassing is, is niet vastgesteld.

### Correctie 3 — inschrijving onbevestigd

De inschrijving liep via een Google Form met deadline **2026-09-13 09:13
(Taipei)**, waarna beperkte permissienummers worden verloot. Die deadline is
verstreken en het is niet bekend of Idries een plek heeft.

Geef het vak in het datamodel een veld `inschrijving: "onbevestigd"`. Zolang
dat zo staat:
- toont de app het vak met een zichtbare markering "inschrijving onbevestigd"
- rekent de motor het vak **wel** mee in de bezetting van woensdagmiddag
- staat er in het vakkenscherm één knop om de status op bevestigd of
  afgewezen te zetten; bij afgewezen verdwijnt het vak uit de kalender en
  klapt de blokberekening automatisch terug

### Correctie 4 — nieuwe weekstructuur

DATA.md §1 moet dit worden:

| Vak | Dag | Tijd |
|---|---|---|
| General Chinese | maandag | 18:25–21:05 |
| General Psychology | woensdag | 09:10–12:10 |
| **Computer Programming in Python** | **woensdag** | **13:20–16:20** |
| General Chinese | woensdag | 18:25–21:05 |
| AgTech Foresight | donderdag | 09:10–12:10 |
| RTE | donderdag | 14:20–17:20 |

**Afgeleid — laat de app dit berekenen:**
- maandag: alleen avond bezet
- dinsdag: volledig vrij
- **woensdag: alle drie de dagdelen bezet** (was ochtend + avond)
- donderdag: ochtend en middag bezet
- vrijdag, zaterdag, zondag: volledig vrij

De vrije blokken zelf **veranderen niet**: het venster zonder absenties blijft
vrijdag 00:00 → maandag 18:25 (3,5 dag), en met één gemiste Chinees-les op
maandagavond vrijdag → dinsdag 23:59 (5 dagen). Wat verandert is de **prijs
van een woensdag**: die kost nu drie lesmomenten in plaats van twee.

### Correctie 5 — nieuwe controlewaarden

Vervang DATA.md §3.5 hierdoor:

| Venster | Chinees | Overige lesmomenten |
|---|---|---|
| vrijdag → maandag 18:25 | 0 | 0 |
| vrijdag → dinsdag 23:59 | 1 | 0 |
| vrijdag → woensdag 16:20 | 1 | 2 (PSY + Python) |
| vrijdag → woensdag 23:59 | 2 | 2 (PSY + Python) |

**Harde controlewaarde — Japan 2026-10-30 → 11-09:**
- Chinees: 3 sessies (11-02, 11-04, 11-09) = 9 uur
- **Python: 1 (11-04, week 9, Nested Structure)**
- PSY: 1 (11-04) · AgTech: 2 (10-29, 11-05) · RTE: 2 (10-29, 11-05)

Komt er iets anders uit de motor, stop en meld het.

### Correctie 6 — open punten toevoegen aan DATA.md §9

- vakcode en zaal van AgTech Foresight
- zaal van Python
- uitkomst van de Python-loting (inschrijving)
- groepsgrootte en vormingstermijn van het Python-groepsproject
- of de strengere cijfergrens voor programmeer-gerelateerde opleidingen op
  civiele techniek van toepassing is

**Klaar als:** Python genereert 16 woensdagen, de AgTech-code staat op
ONBEKEND, woensdag heeft drie bezette dagdelen, en de Japan-controlewaarde
klopt. **STOP.**

---

## 8A — Visueel systeem

Neem het designsysteem over van de Routine Tracker
(`pouiyhgfc/vvvvvvvvvvvvvv`), zodat beide apps hetzelfde aanvoelen.

### Fonts
```
--ff-display: 'Schibsted Grotesk Variable', sans-serif;   /* cijfers, datums */
--ff-head:    'Outfit Variable', sans-serif;              /* schermtitels */
--ff-body:    'DM Sans Variable', sans-serif;             /* alles verder */
```
`body` gebruikt `--ff-body`. Basisgrootte **15px**. Kleinste maat: 12px.

### Kleuren — licht
```
--bg:#f6f5f1        --card:#ffffff      --card2:#fbfaf7
--text:#1a211e      --text-muted:#697069 --text-faint:#a2a8a2
--border:#e9e7e1    --border-soft:#f1efe9
--input-bg:#f8f7f3  --shadow:rgba(20,30,25,.06)
--accent:#0e7a52    --accent-strong:#0a5a3c  --accent-contrast:#ffffff
--accent-bg:#eef7f2 --accent-border:#c5e6d6  --accent-text:#0a5a3c
--sel-bg:#f0f8f4
--danger-bg:#fdf3f2 --danger-border:#f3d2cf  --danger-text:#c0392f
--purple-bg:#f5f3ff --purple-border:#ddd6fe  --purple-text:#6d28d9
```

### Kleuren — donker (`html[data-theme="dark"]`)
```
--bg:#0e1210        --card:#171c19      --card2:#1f2521
--text:#e8ece9      --text-muted:#98a09a --text-faint:#646b66
--border:#2a312d    --border-soft:#242b27
--input-bg:#1f2521  --shadow:rgba(0,0,0,.45)
--accent:#1fa06a    --accent-strong:#5fd6a0 --accent-contrast:#06140d
--accent-bg:#10251b --accent-border:#1d4534 --accent-text:#5fd6a0
--sel-bg:#13271d
--danger-bg:#2a1614 --danger-border:#4a2521 --danger-text:#f0867c
--purple-bg:#1c1830 --purple-border:#352c54 --purple-text:#c4b5fd
```
Thema volgt `prefers-color-scheme`, met een handmatige schakelaar in
instellingen die de keuze in de state bewaart.

### Vakkleuren — vijf vakken, vast, overal identiek
Kleur codeert het **vak**, nooit de status.

| Vak | Afkorting | Licht vlak | Tekst | Donker vlak | Tekst |
|---|---|---|---|---|---|
| General Psychology | PSY | `#fdf3f2` | `#c0392f` | `#2a1614` | `#f0867c` |
| Computer Programming in Python | PY | `#f5f3ff` | `#6d28d9` | `#1c1830` | `#c4b5fd` |
| AgTech Foresight | AGT | `#eef7f2` | `#0a5a3c` | `#10251b` | `#5fd6a0` |
| RTE | RTE | `#eef4fb` | `#185fa5` | `#132435` | `#8cc0f0` |
| General Chinese | CHI | `#fdf5e7` | `#854f0b` | `#2b2008` | `#f0c47a` |

Status wordt uitgedrukt met randdikte en tekstgewicht, niet met kleur.
Uitzondering: een tentamen of presentatie krijgt een volle rand in de
vakkleur plus een stip.

### Vorm
Kaarten `border-radius: 14px`, bedieningselementen `10px`, dagvakjes `8px`.
Randen `1px solid var(--border)`. Eén zachte schaduw `0 1px 3px var(--shadow)`
op kaarten, nergens anders. Geen gradients.

### Tikdoelen
Minstens **44×44px**. `-webkit-tap-highlight-color: transparent` en
`:active { transform: scale(0.98) }`, zoals in de routine-app.

**Klaar als:** `styles.css` staat, fonts laden offline, licht en donker werken,
en er is één demopagina met alle tokens en de vijf vakkleuren. **STOP.**

---

## 8B — Navigatie en schermen

Vier schermen, vaste balk onderaan met vier tikdoelen van 44px:

```
[ Maand ]  [ Weken ]  [ Overzicht ]  [ Vakken ]
```

Vaste balk bovenaan, één regel hoog:
- links: huidige week ("week 11 van 16") en de datum van vandaag
- rechts: absentiestand. **Vijf vakken passen niet op 380px**, dus toon alleen
  de vakken waar iets staat, plus een totaal. Staat er nergens iets, dan
  "geen absenties". Tik erop → Vakken.

Regels:
- Het actieve scherm en de scrollpositie staan in de state en worden bewaard.
  Een actie mag **nooit** de scrollpositie resetten. Herbouw alleen de
  gewijzigde cel of rij, niet de hele lijst.
- Bij openen: scherm Maand, maand van vandaag, vandaag in beeld.
- **Geen enkele informatie in een `title`-attribuut.** Tooltips bestaan niet
  op Android.

**Klaar als:** de vier schermen wisselen, de balken staan, en scrollpositie en
schermkeuze overleven een herlaad. **STOP.**

---

## 8C — Scherm "Maand" (hoofdbeeld)

Klassieke maandkalender, 7 kolommen (ma–zo), rijen per week.

### Per dagvakje
- datumcijfer linksboven, 15px, in `--ff-display`
- gekleurde streepjes onderaan, één per vak met een moment die dag.
  **Maximaal drie per dag** (woensdag: PSY, PY, CHI), dus drie streepjes naast
  elkaar passen. Vaste volgorde op tijd van de dag: ochtend links, avond rechts.
- tentamen of presentatie: gevulde stip in plaats van streepje
- feestdag of geen lesdag: achtergrond `--card2`, datumcijfer `--text-faint`
- eigen items: dun balkje in `--accent` over de volle breedte
- **vandaag:** rand van 2px in `--accent`, nooit een vulling
- geselecteerde dag: achtergrond `--sel-bg`

Geen tekst in de vakjes behalve het datumcijfer.

### Boven de kalender
- maandnaam in `--ff-head`, 20px, met pijlen links/rechts en een
  "vandaag"-knop
- één regel met de maandtelling: lesmomenten, tentamens, vrije blokken

### Onder de kalender
Legenda van vijf regels: kleur, afkorting, dag en tijd. Permanent zichtbaar.
Zonder legenda zijn vijf kleuren onleesbaar.

### Tik op een dag → dagblad
Paneel dat over het scherm schuift, met vaste kopjes in deze orde. Een leeg
kopje wordt weggelaten, niet leeg getoond:

1. **Datum** — "woensdag 4 november 2026 · week 10"
2. **Lessen** — per les: vaknaam, tijd, zaal, en het **syllabusonderwerp van
   die dag** uit `coursedates.js`. Bij PSY het hoofdstuk, bij AgTech de
   spreker, bij RTE de opdracht die uitgaat of in moet, bij Python het
   onderwerp uit de weekindeling.
3. **Tentamens en presentaties** — naam, weging, herkansingsregel van dat vak
4. **Deadlines** — met afvinkvakje
5. **Projecten** — mijlpalen die op deze dag vallen
6. **Eigen items** — bewerken en verwijderen
7. **Wat deze dag kost** — bij absentie per vak de gevolgen, uit `blocks.js`

Onderaan altijd dezelfde drie knoppen: **Item toevoegen** ·
**Absentie markeren** · **Notitie**.

Verwijderen vraagt om bevestiging.

**Klaar als:** september 2026, oktober 2026 en februari 2027 kloppen, vandaag
is gemarkeerd, en het dagblad van 2026-11-04 toont drie lessen (PSY, Python,
Chinees) met elk het juiste syllabusonderwerp. **STOP.**

---

## 8D — Scherm "Weken" met periodekiezer

Per week een strip van 3 rijen (ochtend, middag, avond) × 7 kolommen in
vakkleuren, met daaronder alleen de uitzonderingen in tekst. Gewone weken
blijven daardoor kort.

### Periodekiezer
Bovenaan één rij knoppen: **1 week · 2 weken · 4 weken · 1 maand · 3 maanden ·
Alles · Eigen**

- de keuze bepaalt hoeveel weken onder elkaar staan, vanaf de gekozen startweek
- "Eigen": twee datumvelden met validatie tegen de app-periode
- pijlen links/rechts schuiven het venster één eenheid op
- de keuze wordt bewaard in de state

### Per weekkaart
- weeknummer, datumbereik, en "week N van 16" binnen het semester
- badge rechtsboven met het grootste feit van die week
- twee knoppen: **Open week** en **Item erbij**

**Klaar als:** alle zeven periodekeuzes werken, de strip toont woensdag met
drie bezette dagdelen, en het venster schuift correct over de jaargrens
2026 → 2027. **STOP.**

---

## 8E — Scherm "Overzicht" met filters

Eén lijst, gefilterd. Schakelbare chips bovenaan, meerdere tegelijk:

**Schooldagen · Tentamens · Deadlines · Projecten · Feestdagen · Eigen items ·
Vrije blokken**

Chronologisch, datum en weekdag links, inhoud rechts. Standaard aan:
Tentamens, Deadlines, Vrije blokken.

Vier telkaarten bovenaan (2×2), elk tikbaar naar de gefilterde lijst:
- dagen tot het volgende tentamen of de volgende presentatie
- openstaande deadlines
- vrije blokken van 5 dagen die nog komen
- dagen tot 2026-12-31 (China), met de markering dat de regel onbevestigd is

### Projecten
`src/data/projects.js`. Een project heeft naam, vak, en mijlpalen met datum,
label en afvinkstatus.

Vul alleen in wat bekend is:
- **RTE termproject**: mijlpalen uit DATA.md §3.3 — onderwerp en groepen
  2026-09-24, eerste concept-PPT 2026-10-15, tweede concept 2026-11-12,
  presentaties 2026-12-10 en 2026-12-17
- **Python groepsproject**: presentaties in de weken 14, 15 en 16
  (2026-12-09, 12-16, 12-23). Groepsgrootte en vormingstermijn ONBEKEND, met
  een waarschuwing in de app dat geen groep vormen een F oplevert.
  **Verzin geen termijn.**

Eigen projecten kan de gebruiker zelf toevoegen, met dezelfde velden.

**Klaar als:** elke filtercombinatie geeft een kloppende lijst, de telkaarten
kloppen op een gesimuleerde datum, en beide projecten staan erin. **STOP.**

---

## 8F — Scherm "Vakken"

Vijf kaarten, één per vak, in de vakkleur. Tik → detailpagina met:

1. **Kop** — naam, code, docent, zaal, dag en tijd. Bij Python bovenaan de
   markering "inschrijving onbevestigd" met de knop om dat bij te werken.
2. **Weging** — alle onderdelen met percentage, als staafjes
3. **Absentie** — de regels van dat vak plus de huidige stand:
   - PSY: gemist tentamen zonder documentatie is 0
   - Python: presentiecontroles, verlof alleen vóór de les via MyNTU, en de
     aparte regel dat weken 12–16 als tentamenperiode gelden
   - AgTech: −15 per absentie, −10 per goedgekeurd verlof
   - RTE: welke in-class momenten gemist zijn
   - Chinees: **twee grenzen apart geteld** — de 6-uursvrijstelling met
     puntenaftrek erna, en de 1/3-faaldrempel met het label onbevestigd.
     Verreken ze niet met elkaar.
4. **Deadlines** — chronologisch, met afvinkvakjes
5. **Tellers "beste N van M"** — RTE beste 5 van 7, Chinees beste 15 dictees.
   Python heeft ongeveer 10–12 opdrachten zonder "beste N"-regel: toon een
   simpele teller ingeleverd/totaal, met het totaal als ONBEKEND tot bekend.
6. **Lesoverzicht** — alle 16 weken met datum en onderwerp uit `coursedates.js`

Onbekende velden krijgen zichtbaar het label "onbekend" plus een invoerveld
waarmee de gebruiker het zelf aanvult. Dat wordt in de state bewaard, niet
in `src/data`.

**Klaar als:** de vijf detailpagina's kloppen tegen DATA.md §3, Python toont
"inschrijving onbevestigd", en Chinees toont twee losse absentiegrenzen. **STOP.**

---

## Losse fouten die in deze fase mee opgelost worden

1. **Service worker.** `CACHE_NAAM` krijgt een versienummer dat bij elke
   wijziging omhoog gaat. Vervang cache-first door **network-first met
   cache-fallback** voor `index.html`, `styles.css` en alles onder `src/`;
   cache-first alleen voor `/fonts/` en `/icons/`. Anders blijft de telefoon
   een oude versie serveren na een deploy.
2. **Foutzichtbaarheid.** Faalt IndexedDB of een module, dan komt er een
   leesbare foutmelding in beeld. Nooit een wit scherm.
3. **Import-listener.** De `{ once: true }`-listener die bij elke render
   opnieuw op hetzelfde element wordt gezet, is een fout. Bind hem eenmalig
   bij het opstarten.
4. **Datumnotatie.** Overal `wo 4 nov` in de UI. `YYYY-MM-DD` blijft
   uitsluitend het interne formaat.
5. **Geen `title`-attributen** als informatiedrager, nergens.

---

## Wat niet in fase 8 komt

Geen cijferadministratie, geen behaalde punten invoeren, geen berekend
eindcijfer, geen reisadvies, geen bestemmingen, geen seizoenslogica.
