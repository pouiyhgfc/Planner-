# FASE-9.md — datacorrecties en UI-verbeteringen

Één document. Deel A zijn datacorrecties, deel B zijn vijf UI-verbeteringen op
basis van wat er na fase 8 niet goed werkte.

**Werk A1 → A3 af vóór B1.** De UI-fases bouwen op deze data; bouw je ze op de
oude data, dan moet je het twee keer doen.

Na elke subfase: valideren, tonen, **STOP** en om akkoord vragen.

CLAUDE.md blijft volledig gelden. Waar hieronder `ONBEKEND` staat, blijft dat
`ONBEKEND` — geen datum, deadline of weging verzinnen, ook niet als die
plausibel is.

---

# DEEL A — DATACORRECTIES

## A1 — General Chinese: tentamens over drie dagen

**Wat er fout staat.** De huidige data gaat uit van één Chinees-tentamen
ergens in week 9 en één in week 16, met twee dagen gemarkeerd als "mogelijk
tentamenmoment". Dat is achterhaald.

**Wat het wordt** — bron: opgave Idries, bevestigd bij de docent.
Zekerheid `ZEKER`.

| Tentamen | Onderdeel | Datum | Dag |
|---|---|---|---|
| Midterm (20%) | mondeling | 2026-10-28 | wo, week 8 |
| Midterm (20%) | schriftelijk | 2026-11-02 | ma, week 9 |
| Midterm (20%) | presentatie | 2026-11-04 | wo, week 9 |
| Final (25%) | mondeling | 2026-12-16 | wo, week 15 |
| Final (25%) | schriftelijk | 2026-12-21 | ma, week 16 |
| Final (25%) | presentatie | 2026-12-23 | wo, week 16 |

**Te doen:**

1. Voeg zes losse tentamenitems toe aan `coursedates.js` voor CHI, type
   `tentamen`, met een veld `onderdeel` (`mondeling` / `schriftelijk` /
   `presentatie`) en een veld `tentamen` (`midterm` / `final`), zodat de drie
   delen als één tentamen herkenbaar blijven.
2. Haal de twee "mogelijk tentamenmoment"-markeringen uit week 9 en week 16 weg.
3. **De weging blijft ongedeeld.** Toon bij elk onderdeel de weging van het
   hele tentamen (20% of 25%) met de vermelding dat de onderverdeling over de
   drie delen `ONBEKEND` is. **Deel niet door drie.**
4. Voeg aan `courses.js` bij CHI toe: vanaf **week 4** worden quizzes,
   weektoetsen en huiswerk gegeven, en de **beste 15** resultaten tellen.
   Datums staan op NTU COOL en zijn `ONBEKEND` — genereer er geen.

**Nieuwe controlewaarden:**
- CHI heeft 30 lessessies **plus** 6 tentamenonderdelen
- 2026-10-28 heeft twee tentamenmomenten: PSY-midterm (ochtend) en
  CHI mondeling (avond)
- 2026-12-23 heeft drie momenten: PSY final, PY projectpresentatie,
  CHI presentatie
- 2026-12-21 heeft CHI schriftelijk; 2026-12-24 heeft RTE comprehensive exam

**Klaar als:** de zes onderdelen in de kalender staan en 2026-12-23 drie
momenten toont. **STOP.**

---

## A2 — Japan-reis: omboeking in behandeling

**Situatie.** De huidige boeking in `trips.js` is **2026-10-30 → 2026-11-09**
(TPE→KIX op 30 oktober, NRT→TPE op 9 november). Idries heeft wijzigingsrecht
op de tickets en is de reis aan het verschuiven, omdat de huidige datums twee
van de drie Chinees-midterm-onderdelen raken.

**Voorgenomen nieuwe datums:** vertrek **donderdag 2026-11-05 na 17:20**
(ná RTE), terug **maandag 2026-11-16 vóór 18:25** (vóór Chinees).

**Te doen — en dit is de belangrijkste regel van deze subfase:**

1. **Overschrijf de bestaande boeking niet.** De oude datums zijn geboekt,
   de nieuwe nog niet. Geef reisitems een veld `status` met de waarden
   `geboekt` / `wijziging-aangevraagd` / `vervallen`.
2. Zet de bestaande Japan-boeking op `geboekt` en voeg de voorgenomen datums
   toe als een tweede item met status `wijziging-aangevraagd`.
3. In de kalender worden beide zichtbaar, maar visueel onderscheiden: de
   geboekte reis als volle band, de voorgenomen als band met streepjesrand.
4. Eén knop per reisitem om de status te wijzigen. Zet je de nieuwe op
   `geboekt`, dan gaat de oude automatisch naar `vervallen` en verdwijnt uit
   de kalender — maar niet uit de data.
5. **De kostenberekening rekent met de status `geboekt`.** Toon de kosten van
   de voorgenomen wijziging apart, als vergelijking, niet als vervanging.

**Wat de twee varianten kosten** — laat de motor dit zelf uitrekenen, dit
staat er ter controle:

| | Huidige boeking 30-10 → 09-11 | Voorgenomen 05-11 → 16-11 |
|---|---|---|
| Chinees | 3 sessies = 9 uur (3 uur boven vrijstelling) | 2 sessies = 6 uur (precies binnen vrijstelling) |
| CHI-tentamenonderdelen geraakt | **2 van 3** (02-11, 04-11) | **0** |
| AgTech | 2 absenties (10-29, 11-05) | 1 absentie (11-12) |
| RTE | 2 lessen, incl. A#5 in de les op 11-05 | 1 les (11-12) + **2e draft PPT due** |
| PSY | 1 les (11-04) | 1 les (11-11) |
| Python | 1 les (11-04) | 1 les (11-11) |

**Harde grens die de app moet markeren:** de reis moet zijn afgelopen vóór
**donderdag 2026-11-19**, de RTE technical visit met assignment #7. Een
excursie is niet in te halen. Maak hiervan een deadline-item met het label
"uiterste terugkomst".

**Klaar als:** beide reisvarianten zichtbaar zijn met verschillende status, de
kostenvergelijking klopt op bovenstaande tabel, en 2026-11-19 als uiterste
terugkomst gemarkeerd staat. **STOP.**

---

## A3 — PSY-leeshoofdstukken en RTE-lesvorm in de data

Deze velden bestaan nog niet en daardoor voelt het dagblad leeg.

1. **Veld `lezen` bij de PSY-lesdagen** in `coursedates.js`:
   week 2 hst 1 · week 3 hst 2 · week 4 hst 14 · week 5 hst 15 · week 6 hst 5 ·
   week 9 hst 6 · week 10 hst 7 · week 11 hst 4 · week 12 hst 12 ·
   week 13 hst 16 · week 14 hst 11.
   Weken 1, 7, 8, 15 en 16 hebben geen leesopdracht.
   **Alleen deze elf. Voor de andere vakken geven de syllabi geen
   leesopdracht per week — verzin die niet.**
2. **Veld `vorm` bij de RTE-lesdagen**: `in de les` of `discussietijd`,
   conform de kolom "Lecture Style" in de syllabus. Weken 9 en 11 hebben daar
   geen opgave: `ONBEKEND`.

**Klaar als:** elf PSY-lesdagen hebben een hoofdstuk, veertien RTE-lesdagen
hebben een vorm, en validate.mjs controleert beide aantallen. **STOP.**

---

# DEEL B — UI-VERBETERINGEN

## B1 — Reizen zichtbaar maken

**Diagnose.** `src/data/trips.js` bevat Japan én de Filipijnen (2026-09-25 →
2026-09-30). `src/lib/dayStatus.js:59` leest ze uit en zet ze in
`vasteBoekingen`. Maar het woord `trip` komt **nul keer** voor in
`src/ui/maandGrid.js` en `src/ui/dagblad.js`. De data is er; de weergave niet.

**Te bouwen:**

1. **Maandkalender.** Een dag binnen een reis krijgt een doorlopende band over
   de volle breedte van het vakje, in `--accent-bg` met een rand in
   `--accent-border` — geen vakkleur, en niet `--purple-*` want dat is Python.
   Eerste en laatste reisdag krijgen een afgeronde hoek aan die kant. Een losse
   vlucht krijgt een gevulde ruit, geen emoji. Een reis met status
   `wijziging-aangevraagd` krijgt een streepjesrand (zie A2).
2. **Dagblad.** Nieuw kopje **Reizen**, tussen "Datum" en "Lessen": label,
   of het de eerste, laatste of een tussenliggende dag is, de status, en de
   vlucht als die op deze dag valt.
3. **Weekstrips.** Een week met een reis krijgt een band onder de 3×7-strip
   over de betrokken dagen, en de reisnaam in de badge rechtsboven.
4. **Overzicht.** Nieuwe filterchip **Reizen**, standaard aan.
5. **Eigen reizen toevoegen.** Naam, begin- en einddatum, optioneel losse
   vluchten met datum en tijd, en dezelfde statusveld. In de state, niet in
   `src/data/`. Visueel identiek aan een reis uit `trips.js`, met in het
   dagblad een klein onderscheid in bron.

**Niet verzinnen.** Van de Filipijnen-reis staat alleen het bereik en "terug
± 10:00 op woensdag" vast. Vluchtnummers, luchthavens en overnachtingen zijn
`ONBEKEND`. Zet ze als invulbare velden klaar.

**Klaar als:** Japan (beide varianten) en de Filipijnen zichtbaar zijn in
maand, week, dagblad en overzicht; 2026-09-30 toont de laatste reisdag én drie
lessen; een zelf toegevoegde reis rendert identiek. **STOP.**

---

## B2 — Navigatiefouten

**Diagnose.** `src/ui/wekenGrid.js:234` doet
`erbijKnop.addEventListener("click", () => onItemErbij(weekMaandag))`.
Er wordt altijd de maandag van de week doorgegeven, dus het dagblad opent
altijd op maandag — ook als je een zaterdag in december bedoelt.

**Te bouwen:**

1. **"Item erbij" opent eerst een dagkiezer:** een rij van zeven tikdoelen
   met de dagen van díe week (datumcijfer plus weekdag). Na de keuze opent het
   dagblad van die dag met het invoerformulier al open.
2. **"Open week" springt naar de maandkalender** van de maand waarin die week
   valt, met de maandag van die week geselecteerd en in beeld.
3. **Elke dagcel in de weekstrip wordt zelf tikbaar** en opent het dagblad van
   die dag. Dat is de kortste route; bouw hem naast punt 1.
4. **Terug-gedrag.** Sluit je het dagblad, dan kom je terug op het scherm waar
   je vandaan kwam, op dezelfde scrollpositie.

**Klaar als:** vanuit week 16 een item op zaterdag 26 december toevoegen lukt
zonder eerst naar Maand te gaan, en "Open week" op week 11 de maandkalender van
november opent met 16 november geselecteerd. **STOP.**

---

## B3 — Splitsen per vak in plaats van één lijst

**Diagnose.** `src/ui/schermOverzicht.js` zet alles in één chronologische
lijst. Dat toont wel *wanneer* iets is, maar niet *wat een vak van je vraagt*.
`src/ui/schermVakken.js` heeft deadlines per vak, maar presentaties en
verslagen hebben geen eigen groep.

**Te bouwen:**

1. **Nieuw datatype: opleveringen.** Naast `deadlines` een lijst van producten
   die je moet maken: vak, naam, soort (`presentatie`, `verslag`, `opdracht`,
   `tentamen`), weging, datum, afvinkstatus. Vul alleen wat `ZEKER` is:
   - **RTE termproject**: presentatie **15%** (20 min Engels, 5 min per
     persoon, groep van 5) en verslag **10%**; presentaties 2026-12-10 en
     2026-12-17
   - **RTE opdrachten #1 t/m #7** met hun datums uit `coursedates.js`, waarvan
     #3, #5 en #6 in de les
   - **AgTech studentpresentatie 2026-12-17**, onderdeel van de 40%
     presentatie/opdracht. Onderwerp, vorm, lengte, verslagplicht: `ONBEKEND`
   - **Python projectpresentatie** in week 14, 15 of 16 (2026-12-09, 12-16,
     12-23) — welke week voor hem geldt is `ONBEKEND`
   - **Chinees**: de presentatie-onderdelen van midterm en final zijn al
     tentamenitems uit A1. Maak er geen tweede regel van.
   - **PSY**: vier schriftelijke opdrachten, datums `ONBEKEND`. Vier lege
     regels met status onbekend en een invoerveld. **Geen datums verzinnen.**

2. **Scherm Vakken** krijgt per vak drie gescheiden secties met eigen kop en
   eigen teller: **Tentamens** · **Opleveringen** · **Opdrachten en deadlines**.

3. **Overzicht** houdt de chronologische lijst, met één schakelaar bovenaan:
   **op datum** ↔ **per vak**. In "per vak" worden dezelfde gefilterde items
   gegroepeerd onder vijf kopjes in vakkleur, binnen elk kopje chronologisch.

4. **Nieuwe filterchips:** **Presentaties** en **Verslagen**, los van
   **Deadlines**.

**Klaar als:** de RTE-pagina toont presentatie en verslag apart met 15% en 10%,
de PSY-pagina toont vier opdrachten met status onbekend, en de schakelaar
"per vak" werkt op elke filtercombinatie. **STOP.**

---

## B4 — Dagblad: ontbrekende informatie

**Diagnose.** `src/ui/dagblad.js:82` maakt van een les één platte string:
`${course.name} — ${course.start}–${course.end} — ${zaal} — ${les.label}${spreker}`.
Daar past niets meer bij. Op regel 129 staat nog een stub uit fase 8C:
*"Projecten — nog geen projectdata (volgt in fase 8E), dus altijd leeg"* —
`src/data/projects.js` bestaat inmiddels maar wordt niet ingelezen.

**Elke les wordt een blok, geen regel:**

```
[vakkleur-balkje]  General Psychology          09:10 – 12:10
                   博雅101 · week 9
                   Learning
                   Lezen: hoofdstuk 6
```

Per lesblok, veld weglaten als het leeg is:
- vaknaam, tijd, zaal (of "zaal onbekend"), weeknummer
- onderwerp van die dag
- spreker (AgTech)
- leesopdracht (PSY, uit A3)
- lesvorm (RTE: in de les of discussietijd, uit A3)
- **wat er die dag ingeleverd of uitgegeven wordt** — nu staat dat alleen in
  de aparte deadlinesectie, waardoor je bij de les zelf niet ziet dat je iets
  mee moet nemen
- een tikdoel **"Naar vak"** naar de vakpagina

**Kopjes van het dagblad worden:**

1. Datum
2. **Reizen** (nieuw, uit B1)
3. Lessen — als blokken
4. Tentamens en presentaties
5. **Opleveringen** (nieuw, uit B3)
6. Deadlines
7. **Projecten** — stub vervangen door echte inlezing van
   `src/data/projects.js` plus eigen projecten uit de state
8. Eigen items
9. Wat deze dag kost

**Klaar als:** 2026-11-04 toont drie lesblokken met hoofdstuk 6 bij
psychologie én het CHI-presentatieonderdeel; 2026-10-15 toont bij RTE dat
draft PPT en Assignment #1 in moeten en #4 wordt uitgegeven; 2026-09-24 toont
het RTE-termproject onder Projecten. **STOP.**

---

## B5 — In één blik zien hoe zwaar een week is

**Diagnose.** In de maandkalender zijn alle dagen visueel gelijkwaardig:
een datumcijfer plus streepjes. Een gewone woensdag en de woensdag met de
midterm zien er bijna hetzelfde uit, en je kunt niet zien *wat* er die dag in
de les gebeurt zonder erop te tikken.

**Te bouwen:**

1. **Weekgewicht per weekrij.** Links van elke weekrij een smalle kolom met
   het weeknummer en het aantal tentamens, presentaties en harde deadlines in
   die week als getal. Nul blijft leeg, niet "0". Drie of meer zware momenten:
   rand in `--danger-border`.
2. **Eén regel tekst per dag, alleen waar het telt.** Onder de streepjes ruimte
   voor één korte regel, uitsluitend bij een tentamen, presentatie of harde
   deadline. Geen tekst bij gewone lesdagen — dat was precies de ruis.
   Afkorting plus type: `PSY midterm`, `RTE exam`, `CHI mondeling`. Twee zware
   momenten wordt `2 tentamens`.
3. **Schakelaar compact / uitgebreid** boven de kalender. Uitgebreid geeft elke
   dag de onderwerpen als afgekorte tekst (`Learning · Nested Structure ·
   Lesson 4`); compact alleen streepjes plus de zware regels uit punt 2. Keuze
   in de state, standaard compact.
4. **Weekbalk bovenaan het Maand-scherm.** Onder de topbalk één regel voor de
   week van de geselecteerde dag: weeknummer plus de zware momenten van die
   week als korte opsomming.

**Klaar als:** november 2026 toont week 9 met rand en getal, 4 november toont
een zware regel, 18 november toont geen tekst in compacte stand en drie
onderwerpen in uitgebreide stand, en december toont week 16 als zwaarste week
van het semester. **STOP.**

---

# Openstaande vragen

Blijven `ONBEKEND` in de app. Zet ze bij elkaar in een paneel onder
instellingen, met een invoerveld per punt.

**Gebouwd, en daarna teruggesnoeid tot 10 punten.** Instellingen →
*Openstaande vragen*, gevuld uit `src/data/openstaandeVragen.js`. Een punt
staat er alleen in als het antwoord verandert wat de app toont; zes gaten zijn
om die reden geen vraag meer (zie de tabel in DATA.md §9). Elk punt heeft een invoerveld, een
toelichting waarom het leeg staat en een verwijzing naar de plek in DATA.md.
Een antwoord wordt opgeslagen onder dezelfde sleutel als het losse invulveld
dat er elders al voor bestond, dus wie hier de AgTech-vakcode invult, ziet hem
ook op het vakkenscherm staan. Bovenaan staat hoeveel er beantwoord zijn.

**Stand op 2026-09-15: Idries heeft er acht beantwoord.** De antwoorden staan
in DATA.md (§1, §3.1, §3.2, §3.4, §3.5, §4.0) en in `src/data/`. Hieronder de
oorspronkelijke twaalf, met wat er nog van over is.

1. Verdeling van de 20% en 25% over mondeling, schriftelijk en presentatie
   (CHI) — **open.** De syllabus noemt vier onderdelen (schriftelijk,
   luistertoets, mondeling, individuele presentatie) maar geen percentages.
2. ~~Datums van de quizzes en weektoetsen vanaf week 4 (CHI)~~ — **beantwoord:**
   elke les een dictee, elke week huiswerk; datums staan op NTU COOL en worden
   per les aangekondigd. Losse datums zijn daarmee niet meer nodig.
3. Vluchtgegevens ~~en overnachtingen~~ van de Filipijnen-reis — **vluchten
   beantwoord** (boekingsbevestiging 838759427, DATA.md §4.0); de
   **overnachtingen** zijn nog open.
4. ~~Zaal van Python en van AgTech~~; vakcode en serienummer van AgTech —
   **zalen vervallen** (locaties zijn voor de planning niet van belang); de
   **vakcode van AgTech** is nog open.
5. Inleverdatums van de vier PSY-opdrachten — **open**, de syllabus noemt ze
   niet. ~~En of er daarnaast wekelijks huiswerk of een paper is~~ —
   **beantwoord: nee**, de vier opdrachten zijn de enige inlevermomenten.
6. Onderwerp, vorm, lengte en verslagplicht van de AgTech-presentatie —
   **open.** Staat niet in de presentatie-pdf.
7. ~~In welke week de Python-projectpresentatie van Idries valt~~ —
   **vervallen:** presenteren is geen verplichting, dus er is geen week.
8. ~~Groepsgrootte en vormingstermijn van het Python-groepsproject~~ —
   **geen risico meer:** de groep is al gevormd. De twee velden blijven leeg.
9. ~~Uitkomst van de Python-inschrijvingsloting~~ — **bevestigd**, Idries was
   al lid.
10. Aantal ~~en datums~~ van de Python-opdrachten — **aantal beantwoord**
    (ca. 12, waarvan 10 meetellen, TE VERIFIËREN); de **datums** zijn nog open.
11. Datum, tijd ~~en locatie~~ van de AgTech-excursie (week 14) en de RTE
    technical visit (2026-11-19) — **datums staan vast**, locaties zijn niet
    van belang; de **tijden** zijn nog open.
12. ~~Studiepunten van PSY, AgTech en RTE~~ — **beantwoord: 3 elk**, net als
    CHI en PY.

---

# Wat niet in fase 9 komt

Geen cijferadministratie, geen berekend eindcijfer, geen reisadvies of
bestemmingen, geen seizoenslogica, geen synchronisatie met een externe agenda.
