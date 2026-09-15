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

Bron: de vier syllabi/cursuspagina's (gecontroleerd), aangevuld door
VAKKEN.md (zie §10). Zekerheid: **ZEKER**, behalve waar vermeld. Vijf vakken
sinds FASE-8-1.md 0B (Computer Programming in Python erbij).

| Vak | Code | Docent | Dag | Tijd | Zaal | SP |
|---|---|---|---|---|---|---|
| General Chinese (國際生華語(一)) | PTCSL7908, klas 23, course identifier 146 U9080, ser. 34044 | 何宣瑩 (HE, SYUAN-YING) | maandag | 18:25–21:05 | 普502 (Pu 502) | 3 |
| General Psychology (普通心理學) | PSY1007-09 | 周珮雯 (Catherine P. Chou) | woensdag | 09:10–12:10 | 博雅 101 | 3 |
| **Computer Programming in Python** | **Data5006, curriculum identity 946EU0060, klas 03, ser. 52089** | LIN, TSE-YU | **woensdag** | **13:20–16:20** | ONBEKEND | 3 |
| General Chinese (國際生華語(一)) | PTCSL7908, klas 23, course identifier 146 U9080, ser. 34044 | 何宣瑩 (HE, SYUAN-YING) | woensdag | 18:25–21:05 | 普502 (Pu 502) | 3 |
| Global AgTech Foresight | **ONBEKEND** (zie correctie hieronder) | Chih-Wei Tung (programmadirecteur MS Global ATGS) | donderdag | 09:10–12:10 | ONBEKEND | 3 |
| Railroad Transportation Engineering | 521 EU8770 | Yung-Cheng (Rex) Lai | donderdag | 14:20–17:20 | 新 103 | 3 |

Docentnamen voor PSY en AgTech kwamen uit VAKKEN.md §3/§5 — de syllabus resp.
presentatie zelf noemden geen naam (dit stond eerder als ONBEKEND).

**Studiepunten — correctie, bron: opgave Idries, zekerheid ZEKER.** Alle vijf
de vakken tellen **3 studiepunten**. CHI en PY stonden al zo (VAKKEN.md §1);
PSY, AgTech en RTE stonden op ONBEKEND omdat geen van die drie brondocumenten
het aantal noemt. Idries heeft het aangeleverd: overal 3. Totaal dus 15
studiepunten over vijf vakken.

**Zaalnummers — bron: opgave Idries.** Idries heeft aangegeven dat locaties
voor zijn planning niet van belang zijn. De onbekende zalen (Python, AgTech)
blijven in de data op ONBEKEND staan met een invulveld, maar zijn geen
openstaande vraag meer die hij moet uitzoeken.

General Chinese: keuzevak, voertaal Chinees met Engels als hulptaal,
lesmateriaal *Practical Audio-Visual Chinese 1* (les 1 t/m 6), alleen voor
internationale studenten. Zie §3.5 voor de volledige gegevens van Python.

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

| Datum | Week | Onderwerp | Lezen |
|---|---|---|---|
| 2026-09-09 | 1 | Introductie / syllabus | — |
| 2026-09-16 | 2 | Introduction to Psychology | hoofdstuk 1 |
| 2026-09-23 | 3 | Research in Psychology | hoofdstuk 2 |
| 2026-09-30 | 4 | Lifespan Development | hoofdstuk 14 |
| 2026-10-07 | 5 | Stress and Health | hoofdstuk 15 |
| 2026-10-14 | 6 | Consciousness | hoofdstuk 5 |
| 2026-10-21 | 7 | Review | — |
| **2026-10-28** | 8 | **Midterm Exam (35%)** | — |
| 2026-11-04 | 9 | Learning | hoofdstuk 6 |
| 2026-11-11 | 10 | Memory | hoofdstuk 7 |
| 2026-11-18 | 11 | Sensation and Perception | hoofdstuk 4 |
| 2026-11-25 | 12 | Personality | hoofdstuk 12 |
| 2026-12-02 | 13 | Psychological Disorders | hoofdstuk 16 |
| 2026-12-09 | 14 | Motivation & Emotion | hoofdstuk 11 |
| 2026-12-16 | 15 | Review | — |
| **2026-12-23** | 16 | **Final Exam (35%)** | — |

**Leeshoofdstukken — correctie FASE-9.md A3, bron: syllabus PSY1007-09,
zekerheid ZEKER.** Alleen deze elf weken hebben een leesopdracht; weken 1, 7,
8, 15 en 16 niet. Voor de andere vier vakken geven de syllabi geen
leesopdracht per week — niet verzinnen.

Beoordeling: midterm 35%, final 35%, 4 opdrachten 20%, participatie 10%.
Te laat inleveren: −10% per dag inclusief weekend; na 1 week geen punten.
Tentamens zijn niet cumulatief en bestaan uit meerkeuzevragen. Gemist tentamen
zonder documentatie = 0.

**Opdrachten — bron: syllabus PSY1007-09, zekerheid ZEKER.** De syllabus
noemt onder "Course Requirements" precies vier onderdelen: colleges, twee
tentamens, **vier schriftelijke opdrachten** en discussie/participatie.
**Er is dus geen wekelijks huiswerk en geen paper** — dat staat er niet, en
wordt hier ook niet verzonnen. Inleveren gaat uitsluitend via NTU COOL; een
opdracht die per e-mail naar docent of TA gaat, krijgt een 0. De
**inleverdatums van de vier opdrachten staan niet in de syllabus** en blijven
ONBEKEND.

Contactgegevens (bron: syllabus, ZEKER): docent cpwchou@ntu.edu.tw, kamer
Department of Psychology South Hall 118, spreekuur op afspraak; TA
r13227124@ntu.edu.tw, ook op afspraak. Het vak wordt in het Engels gegeven en
telt als Liberal Education Course A58 (Civil Awareness and Social Analysis,
Life Science).

### 3.2 Global AgTech Foresight (donderdag 09:10–12:10)
Bron: presentatie `20260910-_Global_AgTech_Foresight.pdf`, sprekerkolom en
volledige onderwerptitels uit VAKKEN.md §5. Zekerheid: **ZEKER**.

**Correctie (VAKKEN.md §5):** vijf onderwerpen stonden hier eerder afgekort
t.o.v. de letterlijke titel (week 6, 8, 10, 11, 13 hieronder). Week 10's
"FarmiSpace / DATAYOO" was zelfs een samenvoeging van de echte titel met de
sprekersnaam — DATAYOO Company is de spreker, niet een deel van het
onderwerp. Ook was er nog geen sprekerkolom.

**Tweede correctie — bron: de presentatie zelf (pagina 3), zekerheid ZEKER.**
De weekindeling staat als tabel op pagina 3 van
`20260910-_Global_AgTech_Foresight.pdf`. Daaruit blijkt dat week 5 en week 6
hier nóg steeds ingekort stonden ten opzichte van het brondocument:
week 5 miste het woord "System", week 6 stond als "field monitoring to
postharvest quality evaluation" in plaats van "From Field Plant Monitoring to
Postharvest Quality Evaluation". Beide zijn hieronder letterlijk uit de tabel
overgenomen.

| Datum | Week | Onderwerp | Spreker |
|---|---|---|---|
| 2026-09-10 | 1 | Course introduction | Chih-Wei Tung |
| 2026-09-17 | 2 | From domestication to design crops | Chih-Wei Tung |
| 2026-09-24 | 3 | Invited talk | ONBEKEND |
| 2026-10-01 | 4 | Smart technologies in Taiwan Vanilla Lab | George Lin / Li-Yu Liu |
| 2026-10-08 | 5 | Intelligent Circular Controlled Environment Agriculture | Kuan-Chong Ting |
| 2026-10-15 | 6 | **Smart Agriculture: field monitoring to postharvest quality evaluation** | Shih-Fang Chen |
| 2026-10-22 | 7 | Invited talk | ONBEKEND |
| 2026-10-29 | 8 | **Global Pest Management Technologies and Trends** | Yu-Hsien Lin |
| 2026-11-05 | 9 | Pepper Breeding for Smallholder Farmers | Derek Barchenger |
| 2026-11-12 | 10 | **Unlocking the Infinite Possibilities of Agriculture using FarmiSpace** | DATAYOO Company |
| 2026-11-19 | 11 | **Plant-Microbe Interactions and Green Biotechnology** | Chiu-Ping Cheng |
| 2026-11-26 | 12 | Invited talk | ONBEKEND |
| 2026-12-03 | 13 | **Applications of Plant Phenology and Crop Modeling** | Li-Yu Liu |
| 2026-12-10 | 14 | **On-site visit** | — (excursie, datum/tijd/locatie ONBEKEND) |
| **2026-12-17** | 15 | **Student presentations** | — |
| 2026-12-24 | 16 | TBA | — |

**Aanwezigheidsregels — zwaarste risicofactor van het semester:**
- Aanwezigheid 30%, participatie 30%, presentatie/opdracht 40%
- **−15 punten per absentie**
- −5 punten bij 10–15 min te laat; −10 punten bij >15 min te laat
- −10 punten per goedgekeurde (ziekte)verlofaanvraag via het online systeem
- Participatie: vraag stellen = 5 punten/week, maximaal 30

→ De app moet elke gemiste donderdag koppelen aan een puntenverlies-indicatie.

**Taiwan Smart Agriweek — bron: de presentatie (pagina 5-7), zekerheid
ZEKER.** De introductiecollege-slides verwijzen naar AGRITECH TAIWAN /
臺灣智慧農漁週, **2026-09-08 t/m 2026-09-10** in TaiNEX 1 (Taipei Nangang
Exhibition Center), met een routebeschrijving per MRT. Dit is een beurs
waarnaar verwezen wordt, geen les en geen verplichting, en de datums zijn
inmiddels verstreken — daarom staat het hier wel als feit, maar wordt er
**geen kalenderitem van gemaakt**.

**Let op: dit is niet de excursie van week 14.** De on-site visit op
2026-12-10 is een apart onderdeel; datum, tijd en locatie daarvan zijn nog
ONBEKEND en worden hier niet ingevuld met de Agriweek-gegevens. Ook onderwerp,
vorm, lengte en verslagplicht van de studentpresentatie in week 15 staan niet
in de presentatie en blijven ONBEKEND.

### 3.3 Railroad Transportation Engineering (donderdag 14:20–17:20)
Bron: `2026-NTU_RTE_Syllabus_ver_1.docx`. Docent Yung-Cheng (Rex) Lai. Zekerheid: **ZEKER**.

| Datum | Week | Onderwerp | Deadline / actie | Lesvorm |
|---|---|---|---|---|
| 2026-09-10 | 1 | Syllabus | — | in de les |
| 2026-09-17 | 2 | **Quiz 1** + Intro to Rail Transportation | — | in de les |
| 2026-09-24 | 3 | Infrastructure – Elements I | **Term project topic + groepen (5 pers.)**; Assignment #1 draft PPT | in de les |
| 2026-10-01 | 4 | Infrastructure – Elements II | Assignment #2 uitgegeven | in de les |
| 2026-10-08 | 5 | Special Track Work & WCML | **Assignment #2 due**; #3 in-class | in de les |
| 2026-10-15 | 6 | Station and Yard | **Term project draft PPT due**; **Assignment #1 due**; #4 uitgegeven | discussietijd |
| 2026-10-22 | 7 | Rolling Stock – Car Types & Coupler | **Assignment #4 due** | in de les |
| 2026-10-29 | 8 | Term Project Discussion I | — | discussietijd |
| 2026-11-05 | 9 | Rolling Stock – Bogie & Brake | **Assignment #5 in-class** | ONBEKEND |
| 2026-11-12 | 10 | Signal & Train Control | **2e draft PPT due** | in de les |
| 2026-11-19 | 11 | **Technical Visit** | Assignment #7 (visit) | ONBEKEND |
| 2026-11-26 | 12 | Term Project Discussion II | — | discussietijd |
| 2026-12-03 | 13 | **Quiz 2** + Brakeless or Unstoppable | Assignment #6 in-class | in de les |
| 2026-12-10 | 14 | Term Project Presentations | — | in de les |
| 2026-12-17 | 15 | Term Project Presentations | — | in de les |
| **2026-12-24** | 16 | **Comprehensive Exam (25%)** | — | in de les |

**Lesvorm — correctie op de FASE-9.md A3-aanname, bron:
`2026-NTU_RTE_Syllabus_ver_1.docx` (door Idries aangeleverd), zekerheid
ZEKER.** Kolom "Lecture Style" uit de syllabus: "In-Class" → in de les,
"Schedule Discussion Time" → discussietijd. Weken 9 en 11 staan leeg in de
syllabus zelf — dat is ONBEKEND, niet ingevuld. (Eerdere versie van dit
document zette alle 15 lesdagen op ONBEKEND omdat de syllabus toen nog niet
beschikbaar was — zie open punt §9-1h, nu opgelost.)

Beoordeling: huiswerk 30% (beste 5 van 7, geen uitstel), term project 25%,
2 quizzes 20%, comprehensive exam 25%, participatie 5%. (Telt op tot 105%,
niet 100% — letterlijk uit de syllabus, twee onafhankelijke bronnen
bevestigen dit; niet "gecorrigeerd" naar 100%.)
Klasregels: geen laat huiswerk, geen telefoon, geen eten.

**Termproject (VAKKEN.md §6, was hier nog niet beschreven):** bachelorniveau
— presentatie over de ontwikkeling van veiligheidsprocedures en -technologie
in het spoor, groepen van 5 personen. 20 minuten Engelse presentatie (5
minuten per persoon) plus een Engels termverslag. Verdeling binnen de 25%:
presentatie 15%, verslag 10%.

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
| 8 | ~~10-26 feestdag~~ | 10-28 | Lesson 3 + ★ Midterm mondeling (20%) |
| **9** | **11-02 ★ Midterm schriftelijk (20%)** | **11-04 ★ Midterm presentatie (20%)** | — |
| 10 | 11-09 | 11-11 | Lesson 4 |
| 11 | 11-16 | 11-18 | Lesson 4 |
| 12 | 11-23 | 11-25 | Lesson 5 |
| 13 | 11-30 | 12-02 | Lesson 5, Lesson 6 |
| 14 | 12-07 | 12-09 | Lesson 6 |
| 15 | 12-14 | 12-16 | Lesson 6 + ★ Final mondeling (25%) |
| **16** | **12-21 ★ Final schriftelijk (25%)** | **12-23 ★ Final presentatie (25%)** | — |

→ **Controlewaarden: 14 maandagen (16 min 2 feestdagen), 16 woensdagen, 30
lessessies totaal.** Dit vervangt de oude waarde van 28 (die stopte op
2026-12-18 — fout, het vak loopt door tot 2026-12-23). Het kalender-effect
van de twee feestdagen (09-28, 10-26) op de lesstof is ONBEKEND — de docent
kan schuiven; niet compenseren in de datalaag.

**Tentamens over drie dagen — correctie FASE-9.md A1, bron: opgave Idries,
bevestigd bij docent 何宣瑩. Zekerheid ZEKER.** Vervangt de eerdere aanname van
één moment per tentamen met twee "mogelijke" dagen. Midterm (20%) en final
(25%) bestaan elk uit drie losse onderdelen, op drie verschillende dagen:

| Tentamen | Onderdeel | Datum | Dag |
|---|---|---|---|
| Midterm (20%) | mondeling | 2026-10-28 | wo, week 8 |
| Midterm (20%) | schriftelijk | 2026-11-02 | ma, week 9 |
| Midterm (20%) | presentatie | 2026-11-04 | wo, week 9 |
| Final (25%) | mondeling | 2026-12-16 | wo, week 15 |
| Final (25%) | schriftelijk | 2026-12-21 | ma, week 16 |
| Final (25%) | presentatie | 2026-12-23 | wo, week 16 |

**De weging blijft ongedeeld:** de 20% (midterm) en 25% (final) gelden voor
het hele tentamen. Hoe die weging over de drie onderdelen verdeeld is, is
ONBEKEND — de app deelt niet door drie en toont bij elk onderdeel de volle
tentamenweging met een vermelding dat de onderverdeling niet vastligt.

**Wat een tentamen inhoudt — bron: syllabus PTCSL7908-23, zekerheid ZEKER.**
De syllabus noemt per tentamen vier onderdelen: een schriftelijk deel, een
**luistertoets**, een mondeling en een individuele presentatie. De luistertoets
stond hier nog niet; hij valt samen met het schriftelijke deel en krijgt geen
eigen datum. De syllabus geeft nog steeds geen percentages per onderdeel — de
verdeling van de 20% en de 25% blijft dus ONBEKEND.

→ **Controlewaarden:** CHI heeft 30 lessessies (ongewijzigd, de generator
kent geen tentamens) **plus 6 losse tentamenonderdelen**. 2026-10-28 heeft
twee tentamenmomenten (PSY-midterm ochtend, CHI mondeling avond). 2026-12-23
heeft drie momenten (PSY final, PY projectpresentatie, CHI presentatie).
2026-12-21 heeft CHI schriftelijk; 2026-12-24 heeft (los hiervan) het
RTE comprehensive exam.

**11-02 en 11-04 vallen binnen de huidige Japan-boeking (§4) en dus binnen
week 9 (twee van de drie midterm-onderdelen).** Idries is de boeking aan het
verschuiven — zie het open punt in §9 en (zodra gebouwd) FASE-9.md A2.

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

Nog twee losse gegevens uit de cursuspagina (ZEKER): het vak is **niet open in
de eerste inschrijvingsronde** (備註: 初選不開放), en de vrijstelling van 6 uur
absentie is gelijk aan **2 sessies** — één sessie telt drie lesuren (A/B/C).

**Vanaf week 4 — correctie FASE-9.md A1, bron: opgave Idries, bevestigd bij
de docent, zekerheid ZEKER:** quizzes, weektoetsen en huiswerk worden gegeven
vanaf week 4, en de beste 15 resultaten tellen mee. Exacte datums staan op
NTU COOL en zijn ONBEKEND — de app genereert er geen.

**Frequentie — bron: opgave Idries, bevestigd door de syllabus, zekerheid
ZEKER.** Vanaf dat moment loopt het elke week door: **elke les een dictee** en
**elke week huiswerk**, plus na elke afgeronde les een herhalingstoets in het
laatste lesuur. De syllabus zegt hetzelfde ("The dictation quiz will be given
almost every class time", "A review test will be given for every lesson"). Dat
maakt de losse datums minder belangrijk: er is per definitie elke maandag- en
woensdagavond iets. De datums zelf staan op NTU COOL en blijven ONBEKEND — de
app genereert er nog steeds geen.

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

**Correctie (VAKKEN.md §4):** week 10 en 11 stonden hier eerder afgekort
("NumPy", "Pandas") — dat waren de bijnamen uit de kop van de onderwerpen,
niet de volledige, letterlijke titel.

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
| 10 | 2026-11-11 | **Something just like vectors and matrices: NumPy** |
| 11 | 2026-11-18 | **Something just like spreadsheets: Pandas** |
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

**Groep al gevormd — bron: opgave Idries, zekerheid ZEKER.** Idries heeft al
een groepsgenoot. Het F-risico van de regel hierboven is daarmee afgedekt; de
regel zelf blijft in de data staan omdat hij uit de cursuspagina komt.
Groepsgrootte en vormingstermijn blijven ONBEKEND, maar zijn geen risico meer.

**Presenteren is geen verplichting — bron: opgave Idries, zekerheid ZEKER.**
De projectpresentatie kan wel of niet gedaan worden. Daarom staat er geen
datum vast voor Idries binnen weken 14-16: de drie kandidaatdata blijven als
`mogelijkeData` in de data staan, zonder er één van te kiezen. Het
groepsproject zelf telt wel gewoon voor 25%.

**Opdrachten — bron: opgave Idries, zekerheid TE VERIFIËREN.** Er zijn er
ongeveer **12**, waarvan de beste **10** meetellen voor de 65%. Idries geeft
dit zelf aan met een slag om de arm ("dacht ik"), en de cursuspagina noemt
alleen "ca. 10-12 stuks" — daarom TE VERIFIËREN en niet ZEKER. De
inleverdatums staan op NTU COOL en blijven ONBEKEND.

**Cursusrestricties — drie afzonderlijke regels (VAKKEN.md §4 vulde de eerste
en derde aan; er stond hier eerder alleen de tweede):**
1. Bachelorstudenten met een hoofd- of tweede hoofdvak in een afdeling van
   het College of Electrical Engineering and Computer Science mogen dit vak
   niet volgen (bijvak uitgezonderd). Overtreding = **F voor het hele vak**.
2. **(open punt)** Studenten met een hoofd-, tweede of bijvak in een afdeling
   die programmeervakken aanbiedt krijgen een strengere cijfergrens
   (syllabus-voorbeeld: 95+ i.p.v. 90+ voor een A+). Of dit op civiele
   techniek van toepassing is, is niet vastgesteld (zie §9).
3. Master- en PhD-studenten hebben een ondertekende goedkeuringsbrief van hun
   begeleider of afdelingshoofd nodig.

**Inschrijving bevestigd — bron: opgave Idries, zekerheid ZEKER.** De
inschrijving liep via een Google Form met deadline **2026-09-13 09:13
(Taipei)**, waarna beperkte permissienummers worden verloot. Idries was al lid
en heeft daarmee een plek — de loting was voor hem geen drempel. Veld
`inschrijving: "bevestigd"` in het datamodel; dit was eerder `"onbevestigd"`.

Gevolg voor de app: de motor rekende het vak al mee in de bezetting van
woensdagmiddag en blijft dat doen, maar de markering "onbevestigd" verdwijnt.
De knop op het vakkenscherm blijft bestaan (bevestigd ↔ afgewezen ↔
onbevestigd) — de stand komt nu alleen uit de data in plaats van uit een
vaste beginwaarde in het state-schema, zodat er maar één bron van waarheid is.

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

| Item | Datum | Status | Zekerheid |
|---|---|---|---|
| Vlucht TPE → KIX (Peach Aviation, omboeking, 13:05) | 2026-11-06 | geboekt | ZEKER |
| Japan (omboeking): Osaka/Kyoto/Kawaguchiko/Tokyo | 2026-11-06 → 11-16 | geboekt | ZEKER |
| Vlucht NRT → TPE (Peach Aviation, omboeking, 12:25) | 2026-11-16 | geboekt | ZEKER |
| Filipijnen-trip: vertrek vrijdagochtend | 2026-09-25 | geboekt | ZEKER |
| Filipijnen-trip: terugkomst (± 10:00) | 2026-09-30 | geboekt | ZEKER |

Bron: opgave Idries. Let op: 2026-09-25 is ook Moon Festival (feestdag, zie §2) —
de vaste boeking heeft voorrang in de statusbepaling (zie fase 2-regels). De
terugkomst is een woensdag; Idries mist daardoor de PSY-les die ochtend
(09:10–12:10, §3.1). Dit vak neemt geen aanwezigheid op.

### 4.0 Filipijnen — vluchtgegevens

Bron: **boekingsbevestiging 838759427 (Booking.com)**, aangeleverd door Idries.
Zekerheid: **ZEKER**. Bestemming is **Davao (DVO)**, met in beide richtingen
een overstap in Manila (MNL). Dit vervangt de eerdere velden `vluchtnummer`
en `luchthavens`, die op ONBEKEND stonden.

| Datum | Van → naar | Tijden | Maatschappij en vlucht |
|---|---|---|---|
| 2026-09-25 (vr) | TPE → MNL | 10:40 → 12:50 (2 u 10) | Philippines AirAsia Z2125 |
| 2026-09-25 (vr) | MNL → DVO | 17:20 → 19:20 (2 u) | Cebu Pacific 5J955 |
| 2026-09-29 (di) | DVO → MNL | 23:20 → 01:10 de volgende dag (1 u 50) | Philippine Airlines PR2824, uitgevoerd door PAL Express |
| 2026-09-30 (wo) | MNL → TPE | 07:45 → 10:00 (2 u 15) | Philippines AirAsia Z2124 |

- De heenreis heeft dus **twee vluchten op één dag** — de eerste in de app waar
  dat voorkomt. Het dagblad toont ze allebei.
- De terugreis vertrekt **dinsdagnacht** uit Davao en landt woensdagochtend
  10:00 in Taipei. Dat komt overeen met de "± 10:00 op woensdag" die hier al
  stond.
- Carrier reservation number (PNR) van DVO → MNL: **XILPUI**. Voor de andere
  drie vluchten stond in de bevestiging "being issued" — die zijn dus
  **ONBEKEND** en worden niet ingevuld.
- **Overnachtingen zijn nog ONBEKEND** — de bevestiging gaat alleen over
  vluchten. Dat blijft een invulbaar veld in het dagblad.

### 4.1 Japan — omboeking (afgerond)

**Bevestigd door Idries:** de oorspronkelijke boeking (30-10 → 09-11,
hieronder) is omgeboekt naar **vertrek 2026-11-06 om 13:05, terug 2026-11-16
om 12:25**. Status van de oorspronkelijke boeking is nu **vervallen** (blijft
in de data staan, niet meer zichtbaar in de kalender); de omboeking is
**geboekt**.

| Item | Datum | Status |
|---|---|---|
| Vlucht TPE → KIX (Peach Aviation) | 2026-10-30 | vervallen |
| Japan: Osaka 2 nachten → Kyoto 3 → Kawaguchiko/Fuji 1 → Tokyo 4 | 2026-10-30 → 11-09 | vervallen |
| Vlucht NRT → TPE (Peach Aviation) | 2026-11-09 | vervallen |

**Waarom omgeboekt:** de oorspronkelijke boeking raakte twee van de drie
Chinees-midterm-onderdelen (§3.4: 02-11 schriftelijk, 04-11 presentatie). De
omboeking (06-11 → 16-11) raakt geen enkel tentamenonderdeel — dat was het
doel en is gehaald.

**Kostenvergelijking** (bron: opgave Idries; AgTech/RTE-aantallen voor de
oorspronkelijke boeking herhalen de al eerder gecorrigeerde 2x-telling van
FASE-8-1.md — bevestigd door Idries blijft dit 1x, zie §8/FASE-8-1.md):

| | Oorspronkelijk 30-10 → 09-11 (vervallen) | Omboeking 06-11 → 16-11 (geboekt) |
|---|---|---|
| Chinees | 3 sessies = 9 uur (3 uur boven vrijstelling) | 3 sessies (11-09, 11-11, 11-16) = 9 uur |
| CHI-tentamenonderdelen geraakt | 2 van 3 (02-11 schriftelijk, 04-11 presentatie) | 0 |
| AgTech | 1 absentie (11-05) | 1 absentie (11-12) |
| RTE | 1 les (11-05) | 1 les (11-12) + 2e draft PPT due |
| PSY | 1 les (11-04) | 1 les (11-11) |
| Python | 1 les (11-04) | 1 les (11-11) |

**Let op — de app telt de omboeking als 3x Chinees, niet 2x.** De app rekent
per hele kalenderdag (zoals ook bij de Filipijnen-terugkomst, §4), en heeft
geen tijdstip-precisie. De terugvlucht op 2026-11-16 landt om 12:25, ruim
vóór de Chinese les om 18:25 — die les wordt in werkelijkheid dus niet
gemist. Maar zolang de vaste-boekingsperiode t/m 2026-11-16 loopt, telt de
motor die avond automatisch mee als bezet. Dit is een bekende beperking
(hele-dag-granulariteit), geen fout in de omboeking zelf — het aantal
geraakte tentamenonderdelen (0) is en blijft het belangrijkste resultaat.

**Harde grens (nog steeds relevant):** de reis moet zijn afgelopen vóór
**donderdag 2026-11-19** (RTE technical visit + Assignment #7, niet in te
halen). De omboeking eindigt 2026-11-16, dus ruim op tijd. Staat als
deadline-item "Uiterste terugkomst" in de data, los van welke boekingsvariant
actief is.

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

**Waar dit in de app staat:** Instellingen → *Openstaande vragen*. Dat paneel
toont elk punt uit deze paragraaf dat nog echt open is, met een invoerveld en
een verwijzing terug naar de paragraaf hieronder. De lijst zelf staat in
`src/data/openstaandeVragen.js`; wordt een punt hieronder opgelost, dan gaat
het daar ook weg.

**Idries heeft op 2026-09-15 een reeks van deze punten beantwoord.** Wat
daarmee is komen te vervallen, staat hieronder doorgestreept met de vindplaats
van het antwoord. Wat nog open is, staat gewoon in de lijst.

1. ~~Vakcode en~~ zaalnummer Global AgTech Foresight — **zaalnummers vervallen
   als open punt** (§1: locaties zijn voor de planning niet van belang; het
   veld blijft leeg met invulmogelijkheid). De **vakcode van AgTech is nog
   steeds ONBEKEND** (de eerder aangenomen code bleek bij Python te horen, zie
   §1-correctie). **Docentnaam is ZEKER** (VAKKEN.md §5: Chih-Wei Tung).
1b. ~~General Chinese: exacte tentamendatum binnen week 9 en week 16~~ —
    **opgelost (FASE-9.md A1):** midterm en final bestaan elk uit drie
    onderdelen op drie vaste datums, zie §3.4.
    ~~De datums van de quizzes/weektoetsen vanaf week 4~~ — **vervallen als
    open punt (§3.4):** er is elke les een dictee en elke week huiswerk, dus
    losse datums zijn niet meer nodig; ze staan op NTU COOL en worden per les
    aangekondigd.
    **Nog open:** de verdeling van de 20% (midterm) en 25% (final) over
    schriftelijk/luistertoets/mondeling/presentatie — de syllabus geeft die
    niet. Ook: uitkomst van het gesprek met docent 何宣瑩 (HE, SYUAN-YING) over
    de afwezigheid tijdens week 9 door de Japan-boeking, en of een herkansing
    zonder medische verklaring mogelijk is. Ook: hoe de 1/3-faaldrempel zich
    verhoudt tot de 6-uursvrijstelling (VAKKEN.md §8, vraag 11) — worden ze
    echt nooit verrekend, of is er een volgorde? (Vakcode, docent, zaal,
    startdatum en absentiebeleid zijn nu ZEKER — zie §1 en §3.4.)
1c. Computer Programming in Python — grotendeels beantwoord in §3.5:
    ~~zaalnummer~~ (locaties niet van belang), ~~uitkomst van de
    inschrijvingsloting~~ (**bevestigd**, Idries was al lid), ~~groepsgrootte
    en vormingstermijn~~ (blijven ONBEKEND, maar zijn geen risico meer: de
    groep is al gevormd), ~~in welke week de projectpresentatie valt~~
    (presenteren is geen verplichting, dus er is geen week), ~~aantal
    opdrachten~~ (ca. 12, waarvan 10 meetellen — TE VERIFIËREN).
    **Nog open:** de inleverdatums van die opdrachten (staan op NTU COOL), en
    of de strengere cijfergrens voor programmeer-gerelateerde opleidingen op
    civiele techniek van toepassing is (zie §3.5).
1d. ~~General Psychology: naam van de docent~~ — **opgelost.** VAKKEN.md §3
    geeft 周珮雯 (Catherine P. Chou); de syllabus zelf noemt geen naam.
1e. Global AgTech Foresight: onderwerp, vorm (individueel of groep), lengte
    en verslagplicht van de opdracht bij de studentpresentaties in week 15
    (12-17) — de presentatiedatum zelf is bevestigd (VAKKEN.md §5), de rest
    niet. **Blijft open:** de presentatie in de syllabus-pdf gaat er niet over.
    Ook nog open: tijd van de excursie in week 14 (de datum, 2026-12-10, staat
    vast; de locatie is niet van belang, zie §1). Verwar die excursie niet met
    Taiwan Smart Agriweek van 8-10 september — zie §3.2.
1f. Railroad Transportation Engineering: **tijd** van de technical visit op
    2026-11-19 (week 11). De datum staat vast, de locatie is niet van belang
    (zie §1).
1g. ~~Studiepunten voor General Psychology, Global AgTech Foresight en
    Railroad Transportation Engineering~~ — **opgelost (§1):** alle vijf de
    vakken tellen 3 studiepunten (opgave Idries).
1h. ~~Railroad Transportation Engineering: de kolom "Lecture Style" per
    week~~ — **opgelost:** Idries leverde `2026-NTU_RTE_Syllabus_ver_1.docx`
    aan. Zie §3.3 — 14 van de 16 lesdagen hebben nu een vorm ("in de les" of
    "discussietijd"); week 9 en 11 staan ook in de syllabus zelf leeg en
    blijven dus ONBEKEND.
1i. General Psychology: de inleverdatums van de vier schriftelijke
    opdrachten. De syllabus noemt ze niet (§3.1). Wel opgelost: er is **geen**
    wekelijks huiswerk en **geen** paper — de vier opdrachten zijn de enige
    inlevermomenten.
1j. Filipijnen-reis: ~~vluchtgegevens~~ — **opgelost (§4.0):** alle vier de
    vluchten staan vast, bron boekingsbevestiging 838759427. Nog open: de
    **overnachtingen**, en de PNR's van de drie vluchten waarvoor de
    bevestiging "being issued" meldde.
2. Of de docenten inhaallessen plannen in de flexibele week 2026-12-28 → 12-31.
   Aankondiging uiterlijk 2026-11-28 volgens de kalender.
3. Datum en duur van de afstudeeropdracht in Nederland (februari 2027) — bepaalt
   de harde einddatum van het reisvenster.
4. Primaire bron voor de Chinese visumvrije regeling.
5. Persoonlijke regel: hoeveel lesdagen mag een reis kosten? (0, 1 of meer)

---

## 10. Bronnen per vak

| Vak | Document |
|---|---|
| CHI | NTU Course-pagina PTCSL7908-23 + syllabus 國際生華語 (一) |
| PSY | `115-1_Syllabus_PSY1007-09.pdf` |
| PY | NTU Course-pagina Data5006, klas 03 |
| AGT | `20260910-_Global_AgTech_Foresight.pdf` |
| RTE | `2026-NTU_RTE_Syllabus_ver_1.docx` |
| Kalender | `NTUcalendar115行事曆` (officieel, 3216e Administrative Meeting) |

**VAKKEN.md** (aangeleverd door Idries) is de uitgebreide onderbouwing achter
§3 hierboven — bij tegenspraak tussen VAKKEN.md en dit bestand geldt
VAKKEN.md, en is dit bestand bijgewerkt. VAKKEN.md gebruikt een eigen
zekerheidsvocabulaire (ZEKER/AFGELEID/ONBEKEND/VERMOEDEN GEBRUIKER);
"VERMOEDEN GEBRUIKER" is in dit bestand overgenomen als **TE VERIFIËREN**,
niet als een apart vierde niveau.
