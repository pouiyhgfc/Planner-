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

Bron: de drie syllabi (gecontroleerd). Zekerheid: **ZEKER**, behalve waar vermeld.

| Vak | Code | Dag | Tijd | Zaal |
|---|---|---|---|---|
| General Psychology (普通心理學) | PSY1007-09 | woensdag | 09:10–12:10 | 博雅 101 |
| Global AgTech Foresight | 946 U0060 (ser. 52089) | donderdag | 09:10–12:10 | ONBEKEND |
| Railroad Transportation Engineering | 521 EU8770 | donderdag | 14:20–17:20 | 新 103 |
| General Chinese | ONBEKEND | maandag **en** woensdag | 18:00–21:00 | ONBEKEND |

**Afgeleid (laat de app dit berekenen, niet invoeren):**
- Bezetting per weekdag:
  - maandag: avond 18:00–21:00 (Chinees)
  - dinsdag: vrij
  - woensdag: 09:10–12:10 (PSY) + 18:00–21:00 (Chinees)
  - donderdag: 09:10–12:10 (AgTech) + 14:20–17:20 (RTE)
  - vrijdag, zaterdag, zondag: vrij
- **Enige blok zonder enige absentie: vrijdag 00:00 → maandag 18:00.**
  Dat is 3,5 kalenderdag, en met heen- en terugreis in de praktijk ± 2,5
  bruikbare dag. Dit is het standaardvenster.
- **Eén gemiste Chinees-les op maandagavond verlengt dat naar vrijdag → dinsdag
  = 5 dagen** (terug vóór woensdagochtend PSY). Dit is de goedkoopste ruil in
  het hele rooster en moet de app expliciet als aparte optie tonen.
- Woensdagmiddag (12:10–18:00) is vrij maar te kort om mee te tellen.

**Zaalnummer AgTech:** de NOL-link (`nol.ntu.edu.tw/.../print_table.php?course_id=946%20U0060&ser_no=52089`)
gaf een serverfout bij ophalen. Veld blijft ONBEKEND tot Idries het aanlevert.

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

### 3.4 General Chinese (maandag + woensdag 18:00–21:00)
Bron: opgave Idries. Zekerheid: **ZEKER** voor dag en tijd, **TE VERIFIËREN**
voor de lesdatums (afgeleid van semestergrenzen en feestdagen, niet uit een
syllabus).

Aangenomen: loopt van de eerste lesdag (2026-09-07) t/m de laatste lesdag
(2026-12-18), elke maandag en woensdag, met uitzondering van feestdagen.

**Maandagen (15 kalenderdata, waarvan 13 les):**
09-07 · 09-14 · 09-21 · ~~09-28 feestdag~~ · 10-05 · 10-12 · 10-19 ·
~~10-26 feestdag~~ · 11-02 · 11-09 · 11-16 · 11-23 · 11-30 · 12-07 · 12-14

**Woensdagen (15, alle 15 les — geen feestdag valt op een woensdag):**
09-09 · 09-16 · 09-23 · 09-30 · 10-07 · 10-14 · 10-21 · 10-28 · 11-04 ·
11-11 · 11-18 · 11-25 · 12-02 · 12-09 · 12-16

→ **28 lessen totaal.** De app berekent deze lijst zelf uit weekdag +
semestergrenzen + feestdagen; hij staat hier alleen om de berekening te
controleren.

**ONBEKEND en dus niet invullen:**
- vakcode, docent, zaal
- of het vak echt in week 1 begint (placement test was 2026-09-05)
- of er een midterm/eindtentamen is, en op welke datum
- het absentiebeleid en de weging ervan

**Tentamens — voorlopige velden, status TE VERIFIËREN:**
Idries verwacht dat General Chinese een tentamen in de midterm-week heeft.
De app maakt hiervoor twee lege, zichtbaar gemarkeerde slots aan. **Vul er geen
datum in**; toon "datum onbekend" tot Idries het aanlevert.

| Slot | Mogelijke datum | Toelichting |
|---|---|---|
| Chinees midterm | 2026-10-28 (wo, avond) | Enige kandidaat in de midterm-week 10-26 → 10-30: maandag 10-26 is feestdag, en het vak valt alleen op ma/wo. **Zelfde dag als de PSY-midterm 's ochtends.** |
| Chinees eindtentamen | 2026-12-21 (ma) of 2026-12-23 (wo) | Tentamenweek 12-21 → 12-25. 12-23 is ook de PSY-final 's ochtends. Let op: de gegenereerde leslijst stopt op 12-18, dus deze dagen zitten er nu níet in. |

Zolang de status TE VERIFIËREN is, rekent de motor deze twee dagen **niet** mee
als bezet. Zodra de datum bekend is, worden ze normale tentamenitems en verandert
de blokberekening rond die dagen automatisch.

### 3.5 Afgeleide lesbelasting — controlewaarden

| Trip-venster | Gemiste Chinees-lessen | Gemiste overige lessen |
|---|---|---|
| vrijdag → maandag 18:00 | 0 | 0 |
| vrijdag → dinsdag | 1 (maandag) | 0 |
| vrijdag → woensdag | 2 (ma + wo) | 1 (PSY) |
| Japan 2026-10-30 → 11-09 | **3** (11-02, 11-04, 11-09) | 5 lesmomenten: AgTech 10-29 + 11-05, RTE 10-29 + 11-05, PSY 11-04 |

De Japan-regel is de belangrijkste controlewaarde in de hele app: komt er iets
anders dan 3 Chinees-lessen uit, dan zit er een fout in de motor.

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
| Manifest-velden en iconformaten Android | **niet gevonden** | ONBEKEND — fase 7 begint met dit opzoeken |
| Offline zonder service worker | Werkt niet offline zonder SW; installeerbaarheid vereist technisch niet altijd een SW | Fase 7: minimale SW |

---

## 9. Gaten die Idries zelf moet aanleveren

De app maakt hiervoor lege, gemarkeerde velden — géén aannames.

1. Zaalnummer Global AgTech Foresight.
1b. General Chinese: vakcode, docent, zaal, startdatum, tentamendata en
    absentiebeleid. Idries wil met deze docent afspraken maken over afwezigheid —
    de uitkomst daarvan hoort hier als aparte regel terug te komen.
2. Of de docenten inhaallessen plannen in de flexibele week 2026-12-28 → 12-31.
   Aankondiging uiterlijk 2026-11-28 volgens de kalender.
3. Datum en duur van de afstudeeropdracht in Nederland (februari 2027) — bepaalt
   de harde einddatum van het reisvenster.
4. Primaire bron voor de Chinese visumvrije regeling.
5. Persoonlijke regel: hoeveel lesdagen mag een reis kosten? (0, 1 of meer)
