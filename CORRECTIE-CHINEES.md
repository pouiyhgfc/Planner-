# CORRECTIE-CHINEES.md — General Chinese, geverifieerde gegevens

Deze correctie komt ná fase 5 en vóór afronding van fase 6. Voer hem uit als een
aparte stap: eerst DATA.md bijwerken, dan `src/data/`, dan valideren, dan stoppen.
Bouw geen nieuwe features in deze stap.

Bron: NTU Course-pagina en syllabus van PTCSL7908-23 (aangeleverd door Idries).
Zekerheid **ZEKER**, behalve waar expliciet anders vermeld.

---

## 1. Wat in DATA.md §1 moet worden gecorrigeerd

De regel voor General Chinese in de roostertabel wordt:

| Vak | Code | Dag | Tijd | Zaal |
|---|---|---|---|---|
| 國際生華語 (一) / General Chinese Language Course (I) | PTCSL7908, klas 23, course identifier 146 U9080, serienummer 34044 | maandag **en** woensdag, periodes A/B/C | **18:25–21:05** | 普502 (Pu 502) |

Verder: docent 何宣瑩 (HE, SYUAN-YING), 3 studiepunten, keuzevak, voertaal
Chinees met Engels als hulptaal, lesmateriaal *Practical Audio-Visual Chinese 1*
(les 1 t/m 6), alleen voor internationale studenten.

**De eindtijd was fout in de huidige DATA.md.** Er stond 18:00–21:00; het is
18:25–21:05. Dat schuift de grens van het standaardvenster op naar
**maandag 18:25**. Pas dit overal aan waar de tijd voorkomt en herbereken.

---

## 2. CONFLICT — niet zelf oplossen

De NTU-pagina bevat twee tegenstrijdige opgaven over dag en zaal:

| Veld | Gestructureerde velden (2 bronnen) | Blok "Course Description" |
|---|---|---|
| Dagen | maandag + woensdag | 星期二、四 (dinsdag + donderdag) |
| Zaal | 普502 | 普406 |
| Lesboek | 實用視聽華語一 (deel 1, les 1–6) | 實用視聽華語四 (deel 4, les 1–7) |
| Niveau | beginners, geen voorkennis | voor wie deel 1 al gehaald heeft |

Het "Course Description"-blok beschrijft dus een **ander, hoger niveau** en is
vrijwel zeker overgebleven tekst van een eerdere of andere sectie.

**Aanname voor de app:** maandag + woensdag, 普502, deel 1. Twee onafhankelijke
bronnen (de syllabus en de gestructureerde cursusvelden) zeggen dit.

**Registreer dit als open punt met zekerheid TE VERIFIËREN** in DATA.md §9, met
deze tekst: "Course Description-blok van PTCSL7908 noemt dinsdag/donderdag en
zaal 普406; moet bij docent HE, SYUAN-YING bevestigd worden. Als het wél
dinsdag/donderdag is, valt het vak samen met AgTech en RTE op donderdag en
verandert de hele blokberekening."

Zet géén waarschuwing hierover in de UI van fase 6. Alleen vastleggen.

---

## 3. Weeknummers naar datums

De syllabus geeft weeknummers zonder datums. Week 1 = de week van de eerste
lesdag (2026-09-07). Onderstaande mapping is **afgeleid**, zekerheid
TE VERIFIËREN, en moet door de app worden gegenereerd — niet ingetypt.
De lijst staat er alleen om de generator te controleren.

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

**Controlewaarden:** 14 maandagen (16 min 2 feestdagen), 16 woensdagen,
**30 lessessies totaal**. Dit vervangt de oude waarde van 28 in DATA.md §3.4 —
die was fout omdat hij stopte op 2026-12-18. Het vak loopt door tot **2026-12-23**,
binnen de officiële tentamenweek.

Op welke van de twee dagen in week 9 en week 16 het tentamen precies valt is
**ONBEKEND**. Markeer beide dagen van die weken als mogelijk tentamenmoment,
zekerheid TE VERIFIËREN. Vul geen keuze in.

Het kalender-effect van de twee feestdagen (09-28, 10-26) op de lesstof is
ONBEKEND — de docent kan schuiven. Niet compenseren in de datalaag.

---

## 4. Beoordeling en absentieregels

Vervang de regel "absentiebeleid ONBEKEND" in DATA.md §3.4 door dit.
Zekerheid **ZEKER**.

| Onderdeel | Weging |
|---|---|
| Aanwezigheid en participatie | 15% |
| Huiswerk | 20% |
| Quizzen en toetsen (dictee, bijna elke les) | 20% |
| Midterm exam | 20% |
| Final exam | 25% |

**Aanwezigheid:** presentielijst elke les. Meer dan 20 minuten te laat of 20
minuten te vroeg weg = 1 uur absentie. Toegestaan zonder puntenverlies:
**2 absenties = 6 uur** per semester, mits vooraf per e-mail afgemeld. **Vanaf
het 7e uur: −0,5 punt per uur.** Eén lessessie duurt 3 uur (A/B/C-periodes).

**Huiswerk:** te laat = −10 punten, moet binnen een week alsnog; na een week
0 punten. Handgeschreven verplicht.

**Dictee-quizzen:** bijna elke les, **geen herkansing**. Beste 15 scores tellen.
Tijden staan op NTU COOL.

**Herhalingstoetsen:** na elke les, in het laatste lesuur van die dag. **Eén**
herkansingsaanvraag per student per semester, binnen een week.

**Midterm en final:** schriftelijk, luistertoets, mondeling én individuele
presentatie. Herkansing alleen met melding **minstens één dag vooraf**, een
**medische verklaring** en een afgeronde online verlofprocedure, en dan binnen
**3 dagen**. Lukt dat niet: **0 punten** voor dat tentamen.

**Gedragsregels:** vanaf de 4e waarschuwing −1 punt per overtreding, valt onder
het aanwezigheidscijfer.

---

## 5. NIEUWE CONTROLEWAARDEN — herbereken en toon deze

De oude controlewaarden in DATA.md §3.5 en PLAN.md fase 3 kloppen niet meer.
Vervang ze hierdoor en laat de motor ze opnieuw uitrekenen.

| Trip-venster | Chinees | Overige lessen |
|---|---|---|
| vrijdag 00:00 → maandag 18:25 | 0 | 0 |
| vrijdag → dinsdag 23:59 | 1 (maandag) | 0 |
| vrijdag → woensdag 18:25 | 1 (maandag) | 1 (PSY-ochtend) |
| vrijdag → woensdag 23:59 | 2 (ma + wo) | 1 (PSY-ochtend) |

**De harde controlewaarde — Japan, 2026-10-30 → 11-09:**
- Chinees: 3 sessies (11-02, 11-04, 11-09) = **9 uur absentie**, waarvan 6 uur
  vrij → **−1,5 punt** op het aanwezigheidscijfer
- **11-02 en 11-04 zijn week 9 = de midterm (20% van het eindcijfer)**
- AgTech: 10-29 en 11-05 · RTE: 10-29 en 11-05 · PSY: 11-04

De motor moet dit zelf uitrekenen. Komt er iets anders uit dan 3 Chinees-sessies
en 9 uur, stop dan en meld het.

---

## 6. Wat de app moet tonen in fase 6

Voeg aan de absentieteller uit fase 6 toe:
- per vak een **urenteller**, niet alleen een lessenteller — Chinees rekent in
  uren (3 per sessie) en heeft een vrijstelling van 6 uur
- de resterende vrije uren voor Chinees, en vanaf welk punt punten verdwijnen
- een aparte markering voor dagen die een **tentamenmoment** kunnen zijn
  (week 9 en week 16, beide dagen), met label "tentamendatum onbevestigd"

Geen advies, geen suggesties, geen reisvoorstellen. Alleen de cijfers.

---

## 7. Open punten voor DATA.md §9

1. Conflict dinsdag/donderdag + zaal 普406 (zie §2 hierboven).
2. Exacte datum midterm binnen week 9 en final binnen week 16.
3. Uitkomst van het gesprek met docent HE, SYUAN-YING over afwezigheid tijdens
   week 9, en of een herkansing zonder medische verklaring mogelijk is.

---

**Klaar als:** DATA.md en `src/data/` bijgewerkt, de generator 14 maandagen +
16 woensdagen = 30 sessies oplevert, de Japan-controlewaarde 3 sessies / 9 uur
geeft, en de validatie groen is. Daarna **STOP** en rapporteer.

---

## Aanvulling op CORRECTIE-CHINEES.md

Ontvangen ná bovenstaand document, verwerkt in dezelfde correctiestap.

1. §2 CONFLICT is opgelost: General Chinese valt op
   maandag en woensdag. Zekerheid ZEKER. Haal open punt 1
   uit DATA.md §9. Zaal en lesboek blijven zoals in §1.

2. Voeg aan DATA.md §3.4 een subsectie "Absentieregels"
   toe met twee regels die naast elkaar bestaan:

   a) Puntenaftrek (syllabus PTCSL7908-23, ZEKER):
      6 uur absentie vrij per semester, vooraf per e-mail
      afmelden. Vanaf het 7e uur -0,5 punt per uur op het
      onderdeel aanwezigheid/participatie (15% van het
      eindcijfer). Eén sessie = 3 uur. >20 min te laat of
      >20 min te vroeg weg = 1 uur absentie.

   b) Faaldrempel (Course Description-blok, TE VERIFIEERD):
      meer dan 1/3 van de sessies missen betekent mogelijk
      niet halen; 5 of meer ongeoorloofde absenties
      betekent niet halen. Deze tekst komt uit hetzelfde
      blok dat onjuiste dagen en zaal noemde, dus
      onbevestigd. Op 30 sessies is 1/3 = 10 sessies.
      Ziekte- en verlofmeldingen met bewijs tellen mee in
      het absentietotaal maar kosten geen punten.

   Zet a) en b) als twee aparte, los getelde grenzen in het
   datamodel. De app toont beide standen naast elkaar.
   Verreken ze niet met elkaar.

3. Voeg toe: midterm en final zijn samen 45% en hebben
   geen ruime regeling. Herkansing alleen met melding
   minstens 1 dag vooraf, medische verklaring en
   afgeronde online verlofprocedure, en dan binnen 3 dagen.
   Anders 0 punten voor dat tentamen.

4. Reeds vaststaande absenties: alleen de Japan-boeking
   2026-10-30 t/m 2026-11-09. Dat raakt de Chinees-sessies
   van 2026-11-02, 11-04 en 11-09 = 9 uur. Markeer 11-02 en
   11-04 als vallend in week 9 (midterm), status
   "in overleg met docent, uitkomst onbekend".

5. Vul GEEN andere absenties, reisdata of reislengtes in.
   De gebruiker voert die zelf in. Bouw geen suggesties,
   geen scenario's, geen aanbevolen vensters.

Voer dit uit, valideer, stop en rapporteer.
