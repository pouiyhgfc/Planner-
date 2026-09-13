# FASE-8.md — herontwerp: visueel systeem, navigatie en schermen

Deze fase vervangt de complete UI-laag. De datalaag (`src/data/`, `src/lib/`)
blijft ongewijzigd — daar is niets mis mee. Alles in `src/ui/` en `styles.css`
wordt opnieuw opgebouwd.

Werk 8A → 8F af. Na elke subfase: valideren, tonen, **STOP** en om akkoord vragen.

---

## 0. WIJZIGING OP CLAUDE.md — lees dit eerst

CLAUDE.md §2 verbood webfonts en externe bestanden. Dat verbod wordt beperkt:

- **Nog steeds verboden:** frameworks, build-stap, runtime-dependencies, CDN's.
- **Nieuw toegestaan:** zelf-gehoste `.woff2`-fontbestanden in `/fonts/`,
  geladen met `@font-face` uit `styles.css`.

Download de variable woff2-bestanden van DM Sans, Outfit en Schibsted Grotesk
één keer, commit ze in `/fonts/`, en voeg ze toe aan de service-worker-cache.
Geen `fonts.googleapis.com`-link: dat breekt offline gebruik en is een CDN.

Alles aan CLAUDE.md blijft verder gelden, in het bijzonder §3 (datumstrings),
§5 (DATA.md is de enige bron van waarheid) en §6 (anti-slop).

---

## 8A — Visueel systeem

Neem het designsysteem over van de Routine Tracker
(`pouiyhgfc/vvvvvvvvvvvvvv`), zodat beide apps hetzelfde aanvoelen.

### Fonts
```
--ff-display: 'Schibsted Grotesk Variable', sans-serif;   /* grote cijfers, kopjes */
--ff-head:    'Outfit Variable', sans-serif;              /* schermtitels */
--ff-body:    'DM Sans Variable', sans-serif;             /* alles verder */
```
`body` gebruikt `--ff-body`. Basisgrootte **15px**, niet 11–13px zoals nu.
Kleinste toegestane maat: 12px.

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
Thema volgt `prefers-color-scheme`, met een handmatige schakelaar in het
instellingenblad die de keuze in de state bewaart.

### Vakkleuren — vast, overal identiek
Kleur codeert het **vak**, nooit de status. Vier kleuren, elk met een tint voor
vlakken en een donkere variant voor tekst erop:

| Vak | Rol | Licht vlak | Tekst |
|---|---|---|---|
| General Psychology | woensdagochtend | `#fdf3f2` | `#c0392f` |
| AgTech Foresight | donderdagochtend | `#eef7f2` | `#0a5a3c` |
| RTE | donderdagmiddag | `#eef4fb` | `#185fa5` |
| General Chinese | maandag + woensdagavond | `#fdf5e7` | `#854f0b` |

Status wordt uitgedrukt met randdikte en tekstgewicht, niet met kleur.
Uitzondering: een tentamen krijgt altijd een volle rand in de vakkleur plus
een punt; dat is de enige visuele nadruk die harder mag dan de rest.

### Vorm
Kaarten `border-radius: 14px`, bedieningselementen `10px`, dagvakjes `8px`.
Randen `1px solid var(--border)`. Eén zachte schaduw `0 1px 3px var(--shadow)`
op kaarten, nergens anders. Geen gradients.

### Tikdoelen
Elk aanraakbaar element minstens **44×44px**. `-webkit-tap-highlight-color:
transparent` en `:active { transform: scale(0.98) }` zoals in de routine-app.

**Klaar als:** `styles.css` staat, fonts laden offline, licht en donker werken,
en er is één demopagina met alle tokens zichtbaar. **STOP.**

---

## 8B — Navigatie en schermen

Vier schermen, vaste balk onderaan met vier tikdoelen van 44px:

```
[ Maand ]  [ Weken ]  [ Overzicht ]  [ Vakken ]
```

Vaste balk bovenaan, één regel hoog, altijd zichtbaar:
- links: huidige week ("week 11 van 16") en de datum van vandaag
- rechts: absentiestand, compact per vak (`PSY 0 · AGT 0 · RTE 0 · CHI 0u/6u`)
- tik op de absentiestand → springt naar Vakken

Regels:
- Het actieve scherm en de scrollpositie staan in de state en worden bewaard.
  Een actie (item toevoegen, verwijderen) mag **nooit** de scrollpositie
  resetten. Herbouw alleen de gewijzigde rij of cel, niet de hele lijst.
- Bij het openen van de app: scherm Maand, op de maand van vandaag,
  met vandaag in beeld.
- **Geen enkele informatie in een `title`-attribuut.** Tooltips bestaan niet
  op Android. Alles wat de gebruiker moet weten staat in beeld of achter een tik.

**Klaar als:** de vier schermen wisselen, de balken staan, en scrollpositie
en schermkeuze overleven een herlaad. **STOP.**

---

## 8C — Scherm "Maand" (hoofdbeeld)

Klassieke maandkalender, 7 kolommen (ma–zo), rijen per week.

### Per dagvakje
- datumcijfer linksboven, 15px
- tot vier gekleurde streepjes onderaan het vakje, één per vak dat die dag
  een moment heeft — in vaste volgorde, zodat de positie betekenis houdt
- een tentamen wordt een gevulde stip in plaats van een streepje
- feestdag / geen lesdag: vakje krijgt `--card2` als achtergrond en het
  datumcijfer wordt `--text-faint`
- eigen items: dun balkje in `--accent` over de volle breedte
- **vandaag:** rand van 2px in `--accent`, nooit een vulling
- geselecteerde dag: achtergrond `--sel-bg`

Geen tekst in de vakjes behalve het datumcijfer. Op 380px is daar geen ruimte
voor en het is precies wat nu misgaat.

### Boven de kalender
- maandnaam in `--ff-head`, 20px, met pijlen links/rechts en een "vandaag"-knop
- één regel met de maandtelling: aantal lesmomenten, tentamens, vrije blokken

### Onder de kalender
Een legenda van vier regels: kleur, vakafkorting, dag en tijd. Permanent
zichtbaar, niet inklapbaar. Zonder legenda zijn de kleuren zinloos.

### Tik op een dag → dagblad
Een paneel dat over het scherm schuift, met vaste kopjes in deze orde. Een
kopje zonder inhoud wordt weggelaten, niet leeg getoond:

1. **Datum** — "woensdag 4 november 2026 · week 10"
2. **Lessen** — per les: vaknaam, tijd, zaal, en het **syllabusonderwerp van
   die dag** uit `coursedates.js` (bij PSY ook het hoofdstuk, bij AgTech de
   spreker, bij RTE de opdracht die uitgegeven of ingeleverd wordt)
3. **Tentamens** — naam, weging, en de herkansingsregel van dat vak
4. **Deadlines** — met een afvinkvakje
5. **Projecten** — mijlpalen die op deze dag vallen (zie 8E)
6. **Eigen items** — met bewerken en verwijderen
7. **Wat deze dag kost** — bij absentie: per vak de gevolgen, uit `blocks.js`

Onderaan het blad drie knoppen, altijd dezelfde drie: **Item toevoegen** ·
**Absentie markeren** · **Notitie**.

Verwijderen vraagt om bevestiging. Geen losse `×` die direct wist.

**Klaar als:** de maand klopt op september 2026, oktober 2026 (met de
midterm-week) en februari 2027, vandaag is gemarkeerd, en het dagblad van
2026-11-04 alle zeven kopjes correct vult. **STOP.**

---

## 8D — Scherm "Weken" met periodekiezer

Weekkaarten zoals besproken: per week een strip van 3 rijen (ochtend, middag,
avond) × 7 kolommen in vakkleuren, met daaronder alleen de uitzonderingen in
tekst. Gewone weken blijven daardoor kort.

### Periodekiezer
Bovenaan één rij knoppen: **1 week · 2 weken · 4 weken · 1 maand · 3 maanden ·
Alles · Eigen**

- de keuze bepaalt hoeveel weken er onder elkaar staan, geteld vanaf de
  gekozen startweek
- "Eigen": twee datumvelden, start en eind, met validatie tegen de app-periode
- pijlen links/rechts schuiven het hele venster één eenheid op
- de keuze wordt bewaard in de state

### Per weekkaart
- weeknummer, datumbereik, en "week N van 16" als de week in het semester valt
- een badge rechtsboven met het grootste feit van die week: het aantal vrije
  dagen, of "tentamenweek", of de naam van een eigen item
- twee knoppen: **Open week** en **Item erbij**

**Klaar als:** alle zeven periodekeuzes werken, de strip klopt op week 9
(tentamens) en week 11, en het venster schuift correct over de jaargrens
2026 → 2027. **STOP.**

---

## 8E — Scherm "Overzicht" met filters

Eén lijst, gefilterd. Bovenaan schakelbare chips, meerdere tegelijk aan:

**Schooldagen · Tentamens · Deadlines · Projecten · Feestdagen · Eigen items ·
Vrije blokken**

De lijst toont alleen wat aanstaat, chronologisch, met datum en weekdag links
en de inhoud rechts. Standaard staan Tentamens, Deadlines en Vrije blokken aan.

Bovenaan het scherm vier telkaarten (2×2), elk tikbaar naar de gefilterde lijst:
- dagen tot het volgende tentamen
- openstaande deadlines
- vrije blokken van 5 dagen die nog komen
- dagen tot 2026-12-31 (China), met de markering dat de regel onbevestigd is

### Projecten
Nieuw in het datamodel: `src/data/projects.js`. Een project heeft een naam, een
vak, en mijlpalen met een datum, een label en een afvinkstatus. Vul alleen het
RTE-termproject in, met de mijlpalen die al in DATA.md §3.3 staan (onderwerp en
groepen 2026-09-24, eerste concept-PPT 2026-10-15, tweede concept 2026-11-12,
presentaties 2026-12-10 en 2026-12-17). **Verzin geen mijlpalen.**

Eigen projecten kan de gebruiker zelf toevoegen, met dezelfde velden.

**Klaar als:** elke filtercombinatie geeft een kloppende lijst, de telkaarten
kloppen op een gesimuleerde datum, en de RTE-mijlpalen staan erin. **STOP.**

---

## 8F — Scherm "Vakken"

Vier kaarten, één per vak, in de vakkleur. Tik → detailpagina met:

1. **Kop** — naam, code, docent, zaal, dag en tijd
2. **Weging** — alle onderdelen met percentage, als staafjes zodat je in één
   blik ziet wat zwaar weegt
3. **Absentie** — de regels van dat vak, en de huidige stand. Voor Chinees
   worden de twee grenzen **apart** geteld en apart getoond: de 6-uursvrijstelling
   met puntenaftrek erna, en de 1/3-faaldrempel met het label onbevestigd.
   Verreken ze niet met elkaar.
4. **Deadlines** — alle deadlines van dat vak, chronologisch, met afvinkvakjes
5. **Tellers "beste N van M"** — RTE: beste 5 van 7 opdrachten.
   Chinees: beste 15 dictees. Toon hoeveel er nog gemist kunnen worden.
6. **Lesoverzicht** — alle 16 weken met datum en onderwerp uit `coursedates.js`

Onbekende velden (zaal AgTech, vakcode Chinees, tentamendatums Chinees) krijgen
zichtbaar het label "onbekend" en een invoerveld waarmee de gebruiker het zelf
kan aanvullen. Dat wordt in de state bewaard, niet in `src/data/`.

**Klaar als:** de vier detailpagina's kloppen tegen DATA.md §3, en de
Chinees-pagina toont twee losse absentiegrenzen. **STOP.**

---

## Losse fouten die in deze fase mee opgelost worden

1. **Service worker.** `CACHE_NAAM` krijgt een versienummer dat bij elke wijziging
   omhoog gaat. Vervang cache-first door **network-first met cache-fallback**
   voor `index.html`, `styles.css` en alles onder `src/`; cache-first alleen voor
   `/fonts/` en `/icons/`. Anders blijft de telefoon een oude versie serveren
   nadat je hebt gedeployed.
2. **Foutzichtbaarheid.** Faalt IndexedDB of een module, dan verschijnt een
   leesbare foutmelding in beeld. Nooit een wit scherm.
3. **Import-listener.** De `{ once: true }`-listener die bij elke render opnieuw
   op hetzelfde element wordt gezet, is een fout. Bind hem eenmalig bij het
   opstarten.
4. **Datumnotatie.** Overal `wo 4 nov` in de UI. `YYYY-MM-DD` blijft uitsluitend
   het interne formaat, zoals CLAUDE.md §3 eist.
5. **Geen `title`-attributen** als informatiedrager, nergens.

---

## Wat niet in fase 8 komt

Geen cijferadministratie, geen behaalde punten invoeren, geen berekend
eindcijfer, geen reisadvies, geen bestemmingen, geen seizoenslogica.
De app toont de schoolkalender en de kosten; de gebruiker vult zelf in.
