# DATA.md — enige bron van waarheid

Alles hieronder gaat één-op-één naar `src/data/*.js`, met `bron` en `zekerheid`
per item. Niets toevoegen, niets weglaten, niets "verbeteren".

Zekerheidsniveaus:
- **ZEKER** — uit een primair document dat is gecontroleerd
- **TE VERIFIËREN** — plausibel, maar geen gecontroleerde bron; moet zichtbaar
  gemarkeerd worden in de app
- **ONBEKEND** — niet bekend; mag NIET worden ingevuld met een gok

---

## 0. App-periode

| Veld | Waarde |
|---|---|
| Startdatum | 2026-09-01 |
| Einddatum | 2027-02-28 |
| Aantal dagen | 181 |
| Tijdzone gebruiker | Asia/Taipei (UTC+8, geen DST) |
| Thuisbasis | Changchun Road, Zhongshan District, Taipei |

---

## 1. Vaste weekstructuur (lesrooster 115-1)

Bron: de vier syllabi/cursuspagina's (gecontroleerd). Zekerheid: **ZEKER**,
behalve waar vermeld. Vijf vakken sinds FASE-8-1.md 0B (Computer Programming
in Python erbij).

| Vak | Code | Dag | Tijd | Zaal |
|---|---|---|---|---|
| General Chinese (國際生華語(一)) | PTCSL7908, klas 23, course identifier 146 U9080, ser. 34044 | maandag | 18:25–21:05 | 普502 (Pu 502) |
| General Psychology (普通心理學) | PSY1007-09 | woensdag | 09:10–12:10 | 博雅 101 |
| **Computer Programming in Python** | **Data5006, curriculum identity 946EU0060, klas 03, ser. 52089** | **woensdag** | **13:20–16:20** | ONBEKEND |
| General Chinese (國際生華語(一)) | PTCSL7908, klas 23, course identifier 146 U9080, ser. 34044 | woensdag | 18:25–21:05 | 普502 (Pu 502) |
| Global AgTech Foresight | **ONBEKEND** (zie correctie hieronder) | donderdag | 09:10–12:10 | ONBEKEND |
| Railroad Transportation Engineering | 521 EU8770 | donderdag | 14:20–17:20 | 新 103 |

General Chinese: docent 何宣瑩 (HE, SYUAN-YING), 3 studiepunten, keuzevak,
voertaal Chinees met Engels als hulptaal, lesmateriaal *Practical
Audio-Visual Chinese 1* (les 1 t/m 6), alleen voor internationale studenten.
Zie §3.5 voor de volledige gegevens van Python.

**Correctie op de vakcode van AgTech (FASE-8-1.md 0B, correctie 1):** de code
`946 U0060 (ser. 52089)` stond eerder foutief bij Global AgTech Foresight.
Die code hoort bij Computer Programming in Python (curriculum identity
946EU0060). AgTech's eigen vakcode is **ONBEKEND** — niet ingevuld met een
gok. Zaalnummer AgTech: de NOL-link
(`nol.ntu.edu.tw/.../print_table.php?course_id=946%20U0060&ser_no=52089`)
gaf sowieso een serverfout bij ophalen, dus bleef al ONBEKEND.

**De eindtijd van General Chinese was eerder fout in dit bestand** (er stond
18:00–21:00). Overal waar dit tijdstip in berekeningen wordt gebruikt, is de
grens **18:25**.

**Afgeleid (laat de app dit berekenen, niet invoeren):**
- Bezetting per weekdag:
  - maandag: avond 18:25–21:05 (Chinees)
  - dinsdag: vrij
  - **woensdag: 09:10–12:10 (PSY) + 13:20–16:20 (Python) + 18:25–21:05
    (Chinees) — alle drie de dagdelen bezet, was ochtend + avond**
  - donderdag: 09:10–12:10 (AgTech) + 14:20–17:20 (RTE)
  - vrijdag, zaterdag, zondag: vrij
- **Enige blok zonder enige absentie: vrijdag 00:00 → maandag 18:25.**
  Dat is 3,5 kalenderdag, en met heen- en terugreis in de praktijk ± 2,5
  bruikbare dag. Dit is het standaardvenster. **Dit blok verandert niet** door
  de komst van Python.
- **Eén gemiste Chinees-les op maandagavond verlengt dat naar vrijdag → dinsdag
  23:59 = 5 dagen** (terug vóór woensdagochtend PSY). Dit is de goedkoopste
  ruil in het hele rooster en moet de app expliciet als aparte optie tonen.
  **Dit blok verandert ook niet.**
- **Wat wél verandert: de prijs van een woensdag.** Terug tot woensdag 16:20
  kost nog altijd maar 1 Chinees-les (maandag), maar nu ook zowel de
  PSY-ochtend als de Python-middag (2 lesmomenten i.p.v. 1). Pas terug ná
  18:25 (t/m 23:59) kost daarnaast ook de Chinese les van woensdagavond
  (2 Chinees + 2 overige). Een woensdag kost dus drie lesmomenten in plaats
  van twee.
- Woensdagavond na 21:05 is vrij maar te kort om mee te tellen.

---

## 2. NTU academische kalender 2026-2027

Bron: `NTUcalendar115行事曆` (officieel, bekrachtigd op de 3216e Administrative
Meeting). Zekerheid: **ZEKER** voor alle regels in deze tabel.

| Datum / periode | Gebeurtenis | Type |
|---|---|---|
| 2026-09-07 (ma) | Lessen fall semester beginnen | semesterstart |
| 2026-09-19 (za) | Laatste dag online vakken laten vallen | deadline |
| 2026-09-21 (ma) | Laatste dag online vakken toevoegen | deadline |
| 2026-09-23 → 09-24 | Bevestiging vakkeuze (vanaf 10:00) | deadline |
| 2026-09-25 (vr) | Moon Festival | feestdag |
| 2026-09-28 (ma) | Teachers' Day | feestdag |
| 2026-10-09 (vr) | Inhaalvrije dag voor National Day | feestdag |
| 2026-10-10 (za) | National Day | feestdag |
| 2026-10-19 → 11-02 | Midterm course survey | admin |
| 2026-10-25 (zo) | Taiwan Retrocession Day | feestdag |
| 2026-10-26 (ma) | Inhaalvrije dag voor Retrocession Day | feestdag |
| **2026-10-26 → 10-30** | **Officiële midterm-tentamenperiode** | tentamenperiode |
| 2026-11-20 (vr) → 11-21 (za) | University Games — geen lessen | geen lessen |
| 2026-12-11 (vr) | Laatste dag course withdrawal (17:00) | deadline |
| 2026-12-18 (vr) | Laatste lesdag fall semester | semestereinde lessen |
| **2026-12-21 → 12-25** | **Officiële eindtentamenperiode** | tentamenperiode |
| 2026-12-25 (vr) | Constitution Day | feestdag |
| **2026-12-28 → 12-31** | **Flexibele week** — docenten mogen inhaallessen of tentamens plannen | risicoperiode |
| 2026-12-28 | Wintervakantie begint (t/m 2027-02-19) | vakantie |
| 2027-01-01 (vr) | National Founding Day | feestdag |
| 2027-01-31 (zo) | Fall semester eindigt formeel | admin |
| 2027-02-01 (ma) | Spring semester begint formeel (administratief) | admin |
| 2027-02-04 (do) | Avond vóór Chinees Nieuwjaarsavond | feestdag |
| 2027-02-05 (vr) | Chinees Nieuwjaarsavond | feestdag |
| 2027-02-06 (za) → 02-08 (ma) | Chinees Nieuwjaar | feestdag |
| 2027-02-09 (di) | Inhaalvrije dag CNY dag 1 | feestdag |
| 2027-02-10 (wo) | Inhaalvrije dag CNY dag 2 | feestdag |
| 2027-02-19 (vr) | Einde wintervakantie | vakantie-einde |
| 2027-02-22 (ma) | Lessen spring semester beginnen | semesterstart |
| 2027-02-28 (zo) | Peace Memorial Day | feestdag |

**Kalender-opmerking 1 (belangrijk voor de app):** valt een lesdag op een feestdag,
dan mogen docenten inhaallessen, tentamens of activiteiten plannen op andere
weekdagen of in de flexibele week (week 16+1). Docenten moeten dit **uiterlijk aan
het eind van week 12** aankondigen. Week 12 = 2026-11-22 t/m 2026-11-28.
→ De app moet 2026-11-28 als harde deadline tonen: "flexibele week bevestigd?"

**Kalender-opmerking 2:** lesuitval door natuurramp (tyfoon) volgt de aankondiging
van de gemeente Taipei; of er wordt ingehaald bepaalt elke docent zelf.

---

## 3. Vakspecifieke datums

### 3.1 General Psychology (woensdag 09:10–12:10)
Bron: syllabus PSY1007-09. Zekerheid: **ZEKER**. Docent behoudt recht op wijziging.

| Datum | Week | Onderwerp |
|---|---|---|
| 2026-09-09 | 1 | Introductie / syllabus |
| 2026-09-16 | 2 | Introduction to Psychology |
| 2026-09-23 | 3 | Research in Psychology |
| 2026-09-30 | 4 | Lifespan Development |
| 2026-10-07 | 5 | Stress and Health |
| 2026-10-14 | 6 | Consciousness |
| 2026-10-21 | 7 | Review |
| **2026-10-28** | 8 | **Midterm Exam (35%)** |
| 2026-11-04 | 9 | Learning |
| 2026-11-11 | 10 | Memory |
| 2026-11-18 | 11 | Sensation and Perception |
| 2026-11-25 | 12 | Personality |
| 2026-12-02 | 13 | Psychological Disorders |
| 2026-12-09 | 14 | Motivation & Emotion |
| 2026-12-16 | 15 | Review |
| **2026-12-23** | 16 | **Final Exam (35%)** |

Beoordeling: midterm 35%, final 35%, 4 opdrachten 20%, participatie 10%.
Te laat inleveren: −10% per dag inclusief weekend; na 1 week geen punten.
Tentamens zijn niet cumulatief. Gemist tentamen zonder documentatie = 0.

### 3.2 Global AgTech Foresight (donderdag 09:10–12:10)
Bron: presentatie `20260910-_Global_AgTech_Foresight.pdf`. Zekerheid: **ZEKER**.

| Datum | Week | Onderwerp |
|---|---|---|
| 2026-09-10 | 1 | Course introduction |
| 2026-09-17 | 2 | From domestication to design crops |
| 2026-09-24 | 3 | Invited talk |
| 2026-10-01 | 4 | Smart technologies in Taiwan Vanilla Lab |
| 2026-10-08 | 5 | Intelligent Circular Controlled Environment Agriculture |
| 2026-10-15 | 6 | Smart Agriculture: field monitoring → postharvest |
| 2026-10-22 | 7 | Invited talk |
| 2026-10-29 | 8 | Global Pest Management Technologies |
| 2026-11-05 | 9 | Pepper Breeding for Smallholder Farmers |
| 2026-11-12 | 10 | FarmiSpace / DATAYOO |
| 2026-11-19 | 11 | Plant-Microbe Interactions |
| 2026-11-26 | 12 | Invited talk |
| 2026-12-03 | 13 | Plant Phenology and Crop Modeling |
| 2026-12-10 | 14 | **On-site visit** |
| **2026-12-17** | 15 | **Student presentations** |
| 2026-12-24 | 16 | TBA |

**Aanwezigheidsregels — zwaarste risicofactor van het semester:**
- Aanwezigheid 30%, participatie 30%, presentatie/opdracht 40%
- **−15 punten per absentie**
- −5 punten bij 10–15 min te laat; −10 punten bij >15 min te laat
- −10 punten per goedgekeurde (ziekte)verlofaanvraag via het online systeem
- Participatie: vraag stellen = 5 punten/week, maximaal 30

→ De app moet elke gemiste donderdag koppelen aan een puntenverlies-indicatie.

### 3.3 Railroad Transportation Engineering (donderdag 14:20–17:20)
Bron: `2026-NTU_RTE_Syllabus_ver_1.docx`. Docent Yung-Cheng (Rex) Lai. Zekerheid: **ZEKER**.

| Datum | Week | Onderwerp | Deadline / actie |
|---|---|---|---|
| 2026-09-10 | 1 | Syllabus | — |
| 2026-09-17 | 2 | **Quiz 1** + Intro to Rail Transportation | — |
| 2026-09-24 | 3 | Infrastructure – Elements I | **Term project topic + groepen (5 pers.)**; Assignment #1 draft PPT |
| 2026-10-01 | 4 | Infrastructure – Elements II | Assignment #2 uitgegeven |
| 2026-10-08 | 5 | Special Track Work & WCML | **Assignment #2 due**; #3 in-class |
| 2026-10-15 | 6 | Station and Yard | **Term project draft PPT due**; **Assignment #1 due**; #4 uitgegeven |
| 2026-10-22 | 7 | Rolling Stock – Car Types & Coupler | **Assignment #4 due** |
| 2026-10-29 | 8 | Term Project Discussion I | — |
| 2026-11-05 | 9 | Rolling Stock – Bogie & Brake | **Assignment #5 in-class** |
| 2026-11-12 | 10 | Signal & Train Control | **2e draft PPT due** |
| 2026-11-19 | 11 | **Technical Visit** | Assignment #7 (visit) |
| 2026-11-26 | 12 | Term Project Discussion II | — |
| 2026-12-03 | 13 | **Quiz 2** + Brakeless or Unstoppable | Assignment #6 in-class |
| 2026-12-10 | 14 | Term Project Presentations | — |
| 2026-12-17 | 15 | Term Project Presentations | — |
| **2026-12-24** | 16 | **Comprehensive Exam (25%)** | — |

Beoordeling: huiswerk 30% (beste 5 van 7, geen uitstel), term project 25%,
2 quizzes 20%, comprehensive exam 25%, participatie 5%.
Klasregels: geen laat huiswerk, geen telefoon, geen eten.

### 3.4 General Chinese (maandag + woensdag 18:25–21:05)
Bron: NTU Course-pagina + syllabus PTCSL7908-23 (CORRECTIE-CHINEES.md,
aangeleverd door Idries). Zekerheid: **ZEKER**, behalve waar vermeld.

**Dag/zaal-conflict opgelost:** de NTU-pagina bevatte een tegenstrijdig
"Course Description"-blok dat dinsdag/donderdag en zaal 普406 noemde, met een
hoger cursusniveau (deel 4 i.p.v. deel 1). Twee onafhankelijke bronnen (de
syllabus en de gestructureerde cursusvelden) bevestigen **maandag + woensdag,
zaal 普502, deel 1** — dit is nu ZEKER, niet langer een open punt.

Loopt van de eerste lesdag (2026-09-07) t/m **2026-12-23** (binnen de
officiële eindtentamenweek), elke maandag en woensdag, met uitzondering van
feestdagen. Week 1 = Placement Test (Prepared Week).

**Weeknummers → datums (afgeleid, TE VERIFIËREN, door de app te genereren —
niet intypen):**

| Week | Maandag | Woensdag | Onderwerp |
|---|---|---|---|
| 1 | 09-07 | 09-09 | Placement Test (Prepared Week) |
| 2 | 09-14 | 09-16 | Hanyu Pinyin, Classroom Phrases |
| 3 | 09-21 | 09-23 | Hanyu Pinyin + Lesson 1 |
| 4 | ~~09-28 feestdag~~ | 09-30 | Lesson 1 |
| 5 | 10-05 | 10-07 | Lesson 1, Lesson 2 |
| 6 | 10-12 | 10-14 | Lesson 2 |
| 7 | 10-19 | 10-21 | Lesson 3 |
| 8 | ~~10-26 feestdag~~ | 10-28 | Lesson 3 |
| **9** | **11-02** | **11-04** | **★ Midterm Exam (20%)** |
| 10 | 11-09 | 11-11 | Lesson 4 |
| 11 | 11-16 | 11-18 | Lesson 4 |
| 12 | 11-23 | 11-25 | Lesson 5 |
| 13 | 11-30 | 12-02 | Lesson 5, Lesson 6 |
| 14 | 12-07 | 12-09 | Lesson 6 |
| 15 | 12-14 | 12-16 | Lesson 6 |
| **16** | **12-21** | **12-23** | **★ Final Exam (25%)** |

→ **Controlewaarden: 14 maandagen (16 min 2 feestdagen), 16 woensdagen, 30
lessessies totaal.** Dit vervangt de oude waarde van 28 (die stopte op
2026-12-18 — fout, het vak loopt door tot 2026-12-23). Het kalender-effect
van de twee feestdagen (09-28, 10-26) op de lesstof is ONBEKEND — de docent
kan schuiven; niet compenseren in de datalaag.

**Tentamens — binnen welke dag van week 9 en week 16 is ONBEKEND:**
op welke van de twee dagen in week 9 (11-02 of 11-04) en week 16 (12-21 of
12-23) het tentamen precies valt, is niet vastgelegd door de bron. Beide
dagen van beide weken staan als "mogelijk tentamenmoment" met status
TE VERIFIËREN — de app kiest er geen. Elke dag telt intussen ook gewoon als
reguliere les in de gegenereerde lijst (het is onbekend of de andere dag van
dat weekpaar wél gewoon lesstof behandelt).

**11-02 en 11-04 vallen binnen de Japan-boeking (§4) en dus binnen week 9
(de midterm-week).** Status: "in overleg met docent, uitkomst onbekend" —
Idries wil met docent 何宣瑩 afspreken hoe dit wordt opgelost. Dit is een apart
open punt (zie §9), los van de vraag welke dag exact het tentamen is.

#### Absentieregels (§3.4a/b) — twee onafhankelijke, los geteste grenzen

Vervangt "absentiebeleid ONBEKEND". Deze twee regels staan **los** van elkaar
in het datamodel en worden **niet** met elkaar verrekend — de app toont beide
standen naast elkaar.

**a) Puntenaftrek** — bron syllabus PTCSL7908-23, zekerheid **ZEKER**:
6 uur absentie vrij per semester, mits vooraf per e-mail afgemeld. Vanaf het
7e uur: **−0,5 punt per uur** op het onderdeel aanwezigheid/participatie (15%
van het eindcijfer). Eén lessessie = 3 uur (periodes A/B/C). Meer dan 20
minuten te laat, of meer dan 20 minuten te vroeg weg = 1 uur absentie.

**b) Faaldrempel** — bron: hetzelfde "Course Description"-blok dat de
onjuiste dag/zaal noemde, zekerheid **TE VERIFIËREN**: meer dan 1/3 van de
sessies missen kan betekenen niet halen; 5 of meer ongeoorloofde absenties
betekent niet halen. Op 30 sessies is 1/3 = 10 sessies. Ziekte- en
verlofmeldingen met bewijs tellen mee in het absentietotaal, maar kosten geen
punten.

**Overige weging** (bron syllabus, ZEKER): aanwezigheid/participatie 15%,
huiswerk 20%, quizzen/toetsen (dictee, bijna elke les) 20%, midterm 20%,
final 25%.

- Huiswerk: te laat = −10 punten, moet binnen een week alsnog, daarna 0
  punten. Handgeschreven verplicht.
- Dictee-quizzen: bijna elke les, geen herkansing, beste 15 scores tellen.
- Herhalingstoetsen: na elke les, in het laatste lesuur. Eén
  herkansingsaanvraag per student per semester, binnen een week.
- **Midterm en final (samen 45%) hebben geen ruime regeling.** Herkansing
  alleen met melding minstens 1 dag vooraf, een medische verklaring én een
  afgeronde online verlofprocedure — en dan binnen 3 dagen. Lukt dat niet:
  0 punten voor dat tentamen.
- Gedragsregels: vanaf de 4e waarschuwing −1 punt per overtreding (valt
  onder het aanwezigheidscijfer).

### 3.5 Computer Programming in Python (woensdag 13:20–16:20)
Bron: NTU-cursuspagina (FASE-8-1.md 0B, correctie 2, aangeleverd door Idries).
Zekerheid **ZEKER** voor de cursusgegevens, **TE VERIFIËREN** voor de
inschrijving (zie hieronder).

Curriculum Number Data5006, Curriculum Identity Number 946EU0060, klas 03,
serienummer 52089. Docent LIN, TSE-YU. Zaal ONBEKEND. 3 studiepunten, half
jaar, maximum 80 studenten.

**Weekindeling** (data gegenereerd uit weekdag + semestergrenzen — elke
woensdag van 2026-09-09 t/m 2026-12-23, geen enkele valt op een feestdag —
de onderwerpen zijn letterlijk overgenomen, niet af te leiden):

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

→ **Controlewaarde: 16 woensdagen, geen enkele op een feestdag.**

**Beoordeling:** aanwezigheid 10%, opdrachten 65% (ca. 10–12 stuks,
programmeeropdrachten en online quizzes), groepsproject 25%.

**Aanwezigheidsregels:** minstens drie presentiecontroles, mogelijk meer dan
één per week. Verlof uitsluitend **vóór** de les aanvragen via MyNTU;
achteraf wordt niet geaccepteerd. Bewijsstukken vereist bij alle
verlofcategorieën behalve mentale gezondheid en menstruatieverlof. **Weken
12 t/m 16 gelden als tentamenperiode**; in die periode worden alleen bepaalde
verlofsoorten geaccepteerd. Geen losse tentamendatum — weken 14–16 zijn
projectpresentaties.

**Groepsproject:** verplicht in groepsverband, individueel werk wordt niet
geaccepteerd. Geen groep vormen binnen de termijn betekent een **F voor het
hele vak**. Groepsgrootte en vormingstermijn worden in de les aangekondigd en
zijn nu **ONBEKEND** — leeg veld met invoermogelijkheid in de app, geen
termijn verzinnen. Presentaties: weken 14, 15, 16 (2026-12-09, 12-16, 12-23).

**Cursusrestrictie (open punt):** voor bachelorstudenten met een hoofd-,
tweede of bijvak in een afdeling die programmeervakken aanbiedt geldt een
strengere cijfergrens (syllabus-voorbeeld: 95+ i.p.v. 90+ voor een A+). Of
dit op civiele techniek van toepassing is, is niet vastgesteld (zie §9).

**Inschrijving onbevestigd:** de inschrijving liep via een Google Form met
deadline **2026-09-13 09:13 (Taipei)**, waarna beperkte permissienummers
worden verloot. Die deadline is verstreken; onbekend of Idries een plek
heeft. Veld `inschrijving: "onbevestigd"` in het datamodel. Zolang dat zo
staat: de app toont het vak met een zichtbare markering, de motor rekent het
vak **wel** mee in de bezetting van woensdagmiddag (dus in alle
blokberekeningen), en het vakkenscherm krijgt later (fase 8F) een knop om de
status op bevestigd/afgewezen te zetten.

### 3.6 Afgeleide lesbelasting — controlewaarden

**Correctie:** de eindtijd van Chinees is 18:25, niet 18:00 (zie §1), en
Python voegt twee lesmomenten toe aan woensdag (zie §1). Deze tabel vervangt
de vorige versie.

| Trip-venster | Chinees | Overige lesmomenten |
|---|---|---|
| vrijdag 00:00 → maandag 18:25 | 0 | 0 |
| vrijdag → dinsdag 23:59 | 1 (maandag) | 0 |
| vrijdag → woensdag 16:20 | 1 (maandag) | 2 (PSY + Python) |
| vrijdag → woensdag 23:59 | 2 (ma + wo) | 2 (PSY + Python) |

**De harde controlewaarde — Japan, 2026-10-30 → 11-09:**
- Chinees: 3 sessies (11-02, 11-04, 11-09) = **9 uur absentie**, waarvan 6 uur
  binnen de vrijstelling (§3.4a) vallen → **3 uur boven de vrijstelling →
  −1,5 punt** op het aanwezigheidscijfer.
- **11-02 en 11-04 zijn week 9 = de midterm-week (20% van het eindcijfer)** —
  zie de "in overleg met docent"-status in §3.4.
- **Python: 1 sessie (11-04, week 9, Nested Structure).**
- Overige lessen: PSY 11-04 · AgTech 11-05 · RTE 11-05.

De Japan-regel is de belangrijkste controlewaarde in de hele app: komt er iets
anders dan 3 Chinees-sessies / 9 uur uit, dan zit er een fout in de motor.

**Blijft staan (bevestigd door Idries, FASE-8-1.md's correctie 5 noemde per
abuis weer 2x — genegeerd):** AgTech en RTE op 2026-10-29 (donderdag vóór de
boekingsstart) tellen niet mee — Idries gaat die donderdag gewoon naar
college. Elk telt dus 1x (alleen 11-05).

**Eerdere correctie (bevestigd door Idries, blijft staan):** AgTech en RTE op
2026-10-29 (donderdag vóór de boekingsstart) tellen niet mee — Idries gaat die
donderdag gewoon naar college.

---

## 4. Vaste reisboekingen

| Item | Datum | Zekerheid |
|---|---|---|
| Vlucht TPE → KIX (Peach Aviation) | 2026-10-30 | ZEKER |
| Japan: Osaka 2 nachten → Kyoto 3 → Kawaguchiko/Fuji 1 → Tokyo 4 | 2026-10-30 → 11-09 | ZEKER |
| Vlucht NRT → TPE (Peach Aviation) | 2026-11-09 | ZEKER |
| Filipijnen-trip: vertrek vrijdagochtend | 2026-09-25 | ZEKER |
| Filipijnen-trip: terugkomst (± 10:00) | 2026-09-30 | ZEKER |

Bron: opgave Idries. Let op: 2026-09-25 is ook Moon Festival (feestdag, zie §2) —
de vaste boeking heeft voorrang in de statusbepaling (zie fase 2-regels). De
terugkomst is een woensdag; Idries mist daardoor de PSY-les die ochtend
(09:10–12:10, §3.1). Dit vak neemt geen aanwezigheid op.

---

## 5. China — visumvrij

Bron: Gemini-rapport. Zekerheid: **TE VERIFIËREN** (het rapport gaf geen enkele
bron-URL, ondanks het label ZEKER). Moet in de app zichtbaar als onbevestigd.

| Vraag | Opgegeven antwoord |
|---|---|
| Regeling geldig tot | 2026-12-31, 24:00 |
| Maximaal verblijf | 30 dagen, gerekend vanaf 00:00 de dag ná inreis |
| Alleen inreis binnen venster? | Ja — alleen de inreisdatum moet binnen het venster vallen; de 30 dagen lopen daarna door |
| Toegestane doelen | zaken, toerisme, familie/vrienden, uitwisseling, transit. Werk en studie uitgesloten |

→ De app behandelt **2026-12-31 als harde deadline** met een aftelling, en
markeert deze regel als onbevestigd tot Idries een primaire bron bevestigt.

---

## 6. Eilandverbindingen

Bron: Gemini-rapport, grotendeels leeg. Zekerheid zoals vermeld.

| Bestemming | Wat bekend is | Zekerheid |
|---|---|---|
| Okinawa (Naha), vlucht | Peach Aviation en Tigerair Taiwan vanaf TPE; ± 14 vluchten/dag (99/week); hele jaar door; 1 u 40 min; € 67–152 (TWD 5.900–11.000) | TE VERIFIËREN |
| Okinawa, ferry | niets gevonden | ONBEKEND |
| Ishigaki, vlucht | Tigerair Taiwan; ± 1 uur; eerste vlucht 06:35; frequentie en prijs onbekend | TE VERIFIËREN |
| Ishigaki, ferry | niets gevonden | ONBEKEND |
| Kinmen (vlucht en ferry) | niets gevonden | ONBEKEND |
| Penghu (vlucht en ferry) | niets gevonden | ONBEKEND |

---

## 7. Weer en seizoen

**Volledig ONBEKEND.** Tabel 5 van het onderzoeksrapport kwam leeg terug: elke
cel voor elke maand en elke regio staat op NIET GEVONDEN.

→ De app bouwt hier **geen** seizoenslogica op. Het seizoensveld bestaat wel in
het datamodel (zodat het later gevuld kan worden) maar toont per maand
"seizoensdata ontbreekt" in plaats van een schatting. Geen tyfoonrisico,
duikseizoen of bergtoegang invullen op basis van algemene kennis.

---

## 8. Techniek — geverifieerd vs. onbevestigd

Bron: Gemini-rapport tabel 6. **Geen enkel antwoord had een bron-URL.** Alles
hieronder daarom TE VERIFIËREN, maar de conclusies zijn conservatief genoeg om
op te bouwen.

| Onderwerp | Opgegeven antwoord | Gevolg voor de bouw |
|---|---|---|
| Chrome Android eviction | Opslag is standaard "best effort"; kan gewist worden bij ruimtegebrek of langdurige inactiviteit | Export naar bestand is verplicht, niet optioneel |
| PWA-installatie en persistent storage | Installatie op startscherm weegt zwaar mee in de Chromium-heuristiek voor persistent storage, maar geeft het niet automatisch | `persist()` aanvragen, uitkomst loggen, niet vertrouwen |
| `navigator.storage.persist()` op Chrome Android | Werkt; geen gebruikersprompt; stilzwijgend toegekend of geweigerd | App moet werken bij weigering |
| Opslaglimiet per origin | Tot 60% van de schijfruimte (browser totaal max 80%) | Ruim genoeg; geen probleem |
| localStorage vs IndexedDB | localStorage synchroon en ± 5 MB; IndexedDB asynchroon, gigabytes; beide "best effort" indien onbeschermd | IndexedDB voor de data |
| Browsergegevens wissen | Wist ook persistent storage; enige echte bescherming is export naar bestand | Bevestigt fase 5 |
| Temporal API | Chrome 144+ en Firefox 139+ ondersteunen het; Safari alleen Technology Preview; niet Baseline; polyfill nodig in productie | **Temporal niet gebruiken** |
| DST-valkuil | Itereren over dagen met tijdzone-gebonden objecten geeft offset-fouten | Bevestigt de string-only regel in CLAUDE.md |
| ISO-weeknummer | Het klassieke `Date`-object is hiervoor onbetrouwbaar | Eigen `isoWeek()` implementeren + testen |
| Vercel statisch | `index.html` in de root zonder build-stap werkt; `vercel.json` alleen nodig voor rewrites/headers | Geen `vercel.json` tenzij nodig |
| Vercel Hobby-limieten | 100 GB data transfer; max 100 deploys per dag; 50 custom domains per project | Geen beperking voor dit project |
| Manifest-velden en iconformaten Android | Gevonden in fase 7 (web.dev/learn/pwa/web-app-manifest, developer.chrome.com/docs/lighthouse/pwa/installable-manifest): verplicht `name`, `short_name`, `start_url`, `display` (standalone/fullscreen/minimal-ui), `background_color`, `theme_color`, iconen 192×192 en 512×512 PNG; maskable icoon (`purpose: "any maskable"`) heeft de hoofdinhoud binnen een cirkel met straal 40% van de iconbreedte, gecentreerd | ZEKER, met bron — verwerkt in `manifest.json` |
| Offline zonder service worker | Werkt niet offline zonder SW; installeerbaarheid vereist technisch niet altijd een SW | Fase 7: minimale SW |

---

## 9. Gaten die Idries zelf moet aanleveren

De app maakt hiervoor lege, gemarkeerde velden — géén aannames.

1. Vakcode, zaalnummer én docentnaam Global AgTech Foresight (de eerder
   aangenomen code bleek bij Python te horen — zie §1-correctie; §3.2 noemt
   geen docentnaam).
1b. General Chinese: exacte tentamendatum binnen week 9 (11-02 of 11-04) en
    binnen week 16 (12-21 of 12-23). Ook: uitkomst van het gesprek met docent
    何宣瑩 (HE, SYUAN-YING) over de afwezigheid tijdens week 9 door de
    Japan-boeking, en of een herkansing zonder medische verklaring mogelijk is.
    (Vakcode, docent, zaal, startdatum en absentiebeleid zijn nu ZEKER — zie
    §1 en §3.4.)
1c. Computer Programming in Python: zaalnummer; uitkomst van de
    inschrijvingsloting (Google Form, deadline verstreken 2026-09-13 09:13);
    groepsgrootte en vormingstermijn van het groepsproject; of de strengere
    cijfergrens voor programmeer-gerelateerde opleidingen op civiele techniek
    van toepassing is (zie §3.5).
1d. General Psychology: naam van de docent — §3.1 noemt alleen "docent
    behoudt recht op wijziging", geen naam. Ontdekt tijdens het bouwen van
    het scherm "Vakken" (fase 8F), dat een docentveld voor elk vak toont.
2. Of de docenten inhaallessen plannen in de flexibele week 2026-12-28 → 12-31.
   Aankondiging uiterlijk 2026-11-28 volgens de kalender.
3. Datum en duur van de afstudeeropdracht in Nederland (februari 2027) — bepaalt
   de harde einddatum van het reisvenster.
4. Primaire bron voor de Chinese visumvrije regeling.
5. Persoonlijke regel: hoeveel lesdagen mag een reis kosten? (0, 1 of meer)
