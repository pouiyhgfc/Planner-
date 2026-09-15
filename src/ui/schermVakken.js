/**
 * Scherm "Vakken" — fase 8F, laatste subfase. Vijf kaarten in de vakkleur;
 * tik → detailpagina met kop, weging, absentie, deadlines, tellers en
 * lesoverzicht.
 */

import { courses, courseVoor } from "../data/courses.js";
import { PYTHON_INSCHRIJVING_WAARDEN } from "../state/schema.js";
import { alleVakItems } from "../data/coursedates.js";
import { WEEKDAGEN, kortDatum } from "./datumlabels.js";
import { meervoud } from "./tekst.js";
import { lesoverzicht, gemisteSessies, chineseAbsentieStand } from "./vakkenData.js";
import { zichtbareDeadlines, zichtbareOpleveringen } from "./overzichtData.js";
import { deadlineSleutel, verbergKnop, verborgenDeadlineSleutel, verborgenOpleveringSleutel } from "./dagblad.js";

function veldSleutel(vakId, veldnaam) {
  return `${vakId}.${veldnaam}`;
}

function sectieKop(tekst) {
  const kop = document.createElement("h3");
  kop.className = "vak-sectie-kop";
  kop.textContent = tekst;
  return kop;
}

/**
 * @param {string} sleutel
 * @param {string|null} label null waar de naam van het veld er al naast staat
 *   (in de definitielijst van de kop), anders stond die er twee keer
 * @param {string|undefined} huidigeWaarde
 * @param {(sleutel: string, waarde: string) => void} onWijzigen
 */
function renderOnbekendVeld(sleutel, label, huidigeWaarde, onWijzigen) {
  const wrap = document.createElement("span");
  wrap.className = "onbekend-veld";
  const labelEl = document.createElement("span");
  labelEl.className = "onbekend-label";
  labelEl.textContent = label ? `${label}: onbekend` : "onbekend";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "zelf aanvullen";
  input.value = huidigeWaarde ?? "";
  input.addEventListener("change", () => onWijzigen(sleutel, input.value));
  wrap.appendChild(labelEl);
  wrap.appendChild(input);
  return wrap;
}

/**
 * Sinds de loting bekend is (DATA.md §3.5) begint deze stand op "bevestigd" in
 * plaats van "onbevestigd". Daarom een knop voor elke andere stand: vanuit
 * "bevestigd" naar "afgewezen" kostte anders twee klikken via "onbevestigd".
 */
function renderInschrijvingBadge(pythonInschrijving, onWijzigen) {
  const wrap = document.createElement("div");
  wrap.className = "inschrijving-badge";
  const label = document.createElement("span");
  label.className = "inschrijving-label";
  label.textContent = `Inschrijving ${pythonInschrijving}`;
  wrap.appendChild(label);

  for (const waarde of PYTHON_INSCHRIJVING_WAARDEN.filter((w) => w !== pythonInschrijving)) {
    const knop = document.createElement("button");
    knop.type = "button";
    knop.textContent = `Zet op ${waarde}`;
    knop.addEventListener("click", () => onWijzigen(waarde));
    wrap.appendChild(knop);
  }
  return wrap;
}

function renderKopSectie(course, veldwaarden, ctx, callbacks) {
  const wrap = document.createElement("div");
  wrap.className = "vak-detail-kop";

  if (course.id === "PY") {
    wrap.appendChild(renderInschrijvingBadge(ctx.pythonInschrijving, callbacks.onInschrijvingWijzigen));
  }

  const regels = document.createElement("dl");
  regels.className = "vak-detail-regels";

  function regel(label, veldnaam, waarde) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    if (waarde) {
      dd.textContent = waarde;
    } else {
      const sleutel = veldSleutel(course.id, veldnaam);
      dd.appendChild(renderOnbekendVeld(sleutel, null, veldwaarden[sleutel], callbacks.onVeldWijzigen));
    }
    regels.appendChild(dt);
    regels.appendChild(dd);
  }

  regel("Code", "code", course.code);
  regel("Docent", "docent", course.docent);
  regel("Zaal", "room", course.room);
  regel("Studiepunten", "studiepunten", course.studiepunten ? String(course.studiepunten) : null);

  const dagTijdDt = document.createElement("dt");
  dagTijdDt.textContent = "Dag en tijd";
  const dagTijdDd = document.createElement("dd");
  dagTijdDd.textContent = `${course.weekdays.map((w) => WEEKDAGEN[w]).join(" + ")} ${course.start}–${course.end}`;
  regels.appendChild(dagTijdDt);
  regels.appendChild(dagTijdDd);

  wrap.appendChild(regels);
  return wrap;
}

/**
 * Weging: de balken plus de letterlijke beoordelingstekst eronder. Die tekst
 * stond eerder in de Absentie-sectie, waar hij de percentages herhaalde die
 * hier al als balk staan — dezelfde zin dus twee keer op één pagina. Hij is
 * niet weggegooid maar verplaatst naar de plek waar hij over gaat.
 */
function renderWegingSectie(course) {
  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Weging"));
  for (const onderdeel of course.beoordeling.weging) {
    const rij = document.createElement("div");
    rij.className = "weging-rij";
    const label = document.createElement("span");
    label.className = "weging-label";
    label.textContent = `${onderdeel.label} — ${onderdeel.percentage}%`;
    const balkWrap = document.createElement("div");
    balkWrap.className = "weging-balk-wrap";
    const balk = document.createElement("div");
    balk.className = "weging-balk";
    balk.style.width = `${Math.min(onderdeel.percentage, 100)}%`;
    balkWrap.appendChild(balk);
    rij.appendChild(label);
    rij.appendChild(balkWrap);
    wrap.appendChild(rij);
  }

  const tekst = document.createElement("p");
  tekst.className = "vak-detail-klein";
  tekst.textContent = course.beoordeling.tekst;
  wrap.appendChild(tekst);

  return wrap;
}

function renderChineseAbsentie(course, items) {
  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Absentie"));

  const stand = chineseAbsentieStand(items);

  const regel1 = document.createElement("p");
  regel1.className = "vak-detail-klein";
  regel1.textContent = course.absentieregels.puntenaftrek.tekst;
  wrap.appendChild(regel1);
  const stand1 = document.createElement("p");
  stand1.textContent =
    `Huidige stand: ${stand.urenGebruikt} van ${stand.vrijstellingUren} vrijgestelde uren gebruikt` +
    (stand.urenBovenVrijstelling > 0 ? ` — ${stand.urenBovenVrijstelling} uur erboven (−${stand.aftrek} punten)` : "");
  wrap.appendChild(stand1);

  const regel2 = document.createElement("p");
  regel2.className = "vak-detail-klein";
  regel2.textContent = `${course.absentieregels.faaldrempel.tekst} (${course.absentieregels.faaldrempel.zekerheid})`;
  wrap.appendChild(regel2);
  const stand2 = document.createElement("p");
  stand2.textContent =
    `Huidige stand: ${stand.gemisteSessies} van ${stand.totaalSessies} sessies gemist (${Math.round(stand.fractieGemist * 100)}%)` +
    (stand.drempelBereikt ? " — drempel bereikt" : "");
  wrap.appendChild(stand2);

  const waarschuwing = document.createElement("p");
  waarschuwing.className = "vak-detail-klein";
  waarschuwing.textContent = "Deze twee grenzen tellen apart — niet met elkaar verrekenen.";
  wrap.appendChild(waarschuwing);

  return wrap;
}

function renderAbsentieSectie(course, items, pythonAfgewezen) {
  if (course.id === "CHI") return renderChineseAbsentie(course, items);

  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Absentie"));

  // Alleen vakken met eigen absentieregels hebben hier tekst. Voor de andere
  // vakken staat het beleid in de beoordelingstekst onder Weging; dat hier
  // herhalen leverde exact dezelfde alinea twee keer op dezelfde pagina op.
  if (course.absentieregels?.tekst) {
    const regels = document.createElement("p");
    regels.className = "vak-detail-klein";
    regels.textContent = course.absentieregels.tekst;
    wrap.appendChild(regels);
  }

  const gemist = gemisteSessies(course.id, items, pythonAfgewezen);

  if (course.id === "RTE") {
    const standKop = document.createElement("p");
    standKop.textContent =
      gemist.length === 0 ? "Nog geen in-class momenten gemist (op basis van geplande absenties)." : `${meervoud(gemist.length, "in-class moment", "in-class momenten")} gemist:`;
    wrap.appendChild(standKop);
    if (gemist.length > 0) {
      const lijst = document.createElement("ul");
      for (const g of gemist) {
        const li = document.createElement("li");
        li.textContent = `${kortDatum(g.date)} — ${g.label}`;
        lijst.appendChild(li);
      }
      wrap.appendChild(lijst);
    }
  } else {
    const stand = document.createElement("p");
    stand.textContent = `Huidige stand: ${meervoud(gemist.length, "sessie", "sessies")} gemist (op basis van geplande absenties).`;
    wrap.appendChild(stand);
  }

  return wrap;
}

/**
 * FASE-9.md B3: tentamens apart van lesdagen, per vak — dezelfde items als
 * elders (coursedates.js alleVakItems, incl. chineseTentamens), hier alleen
 * gefilterd en zonder de lesdagen ertussen.
 * @param {string} vakId
 * @returns {HTMLElement|null}
 */
function renderTentamensSectie(vakId) {
  const relevant = alleVakItems.filter((v) => v.course === vakId && v.type === "tentamen");
  if (relevant.length === 0) return null;

  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Tentamens"));
  const lijst = document.createElement("ul");
  for (const tentamen of [...relevant].sort((a, b) => a.date.localeCompare(b.date))) {
    const li = document.createElement("li");
    li.textContent = `${kortDatum(tentamen.date)} — ${tentamen.label}`;
    lijst.appendChild(li);
  }
  wrap.appendChild(lijst);
  return wrap;
}

/**
 * FASE-9.md B3: opleveringen (presentaties, verslagen, opdrachten die
 * meetellen) apart van tentamens en lesdagen, met — waar bekend — hun
 * weging. Een item zonder vaste datum (mogelijkeData of volledig ONBEKEND)
 * krijgt een invulveld via vakkenVeldwaarden, net als de andere
 * onbekend-velden op dit scherm.
 * @param {string} vakId
 * @param {string[]} afgevinkteOpleveringen
 * @param {Record<string, string>} veldwaarden
 * @param {string[]} verborgenItems
 * @param {(sleutel: string, waarde: string) => void} onVeldWijzigen
 * @param {(id: string, afgevinkt: boolean) => void} onOpleveringToggle
 * @returns {HTMLElement|null}
 */
function renderOpleveringenSectie(vakId, afgevinkteOpleveringen, veldwaarden, verborgenItems, onVeldWijzigen, onOpleveringToggle, onVerbergen) {
  const relevant = zichtbareOpleveringen(verborgenItems).filter((o) => o.vak === vakId);
  if (relevant.length === 0) return null;

  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Opleveringen"));

  // Een toelichting die bij meer dan één regel hoort — zoals de tekst onder de
  // twaalf Python-opdrachten — staat één keer boven de lijst in plaats van
  // onder elke regel. Dat scheelt hier elf herhalingen van dezelfde drie zinnen.
  const aantalPerOpmerking = new Map();
  for (const o of relevant) {
    if (o.opmerking) aantalPerOpmerking.set(o.opmerking, (aantalPerOpmerking.get(o.opmerking) ?? 0) + 1);
  }
  const gedeeldeOpmerkingen = new Set([...aantalPerOpmerking].filter(([, n]) => n > 1).map(([tekst]) => tekst));
  for (const tekst of gedeeldeOpmerkingen) {
    const uitleg = document.createElement("p");
    uitleg.className = "vak-detail-klein";
    uitleg.textContent = tekst;
    wrap.appendChild(uitleg);
  }

  const lijst = document.createElement("ul");
  for (const item of relevant) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const vinkje = document.createElement("input");
    vinkje.type = "checkbox";
    vinkje.checked = afgevinkteOpleveringen.includes(item.id);
    vinkje.addEventListener("change", () => onOpleveringToggle(item.id, vinkje.checked));
    label.appendChild(vinkje);

    const tekst = document.createElement("span");
    const wegingTekst = item.weging !== null ? ` (${item.weging}%)` : "";
    tekst.textContent = ` ${item.naam}${wegingTekst}`;
    label.appendChild(tekst);
    li.appendChild(label);

    const datumSleutel = `${item.id}.datum`;
    if (item.datum) {
      const datumEl = document.createElement("span");
      datumEl.className = "vak-detail-klein";
      datumEl.textContent = ` — ${kortDatum(item.datum)}`;
      li.appendChild(datumEl);
    } else {
      const veldWrap = document.createElement("span");
      veldWrap.className = "onbekend-veld";
      const veldLabel = document.createElement("span");
      veldLabel.className = "onbekend-label";
      veldLabel.textContent = item.mogelijkeData
        ? ` datum onbekend (mogelijk: ${item.mogelijkeData.map(kortDatum).join(" of ")}) — `
        : " datum onbekend — ";
      const input = document.createElement("input");
      input.type = "date";
      input.value = veldwaarden[datumSleutel] ?? "";
      input.addEventListener("change", () => onVeldWijzigen(datumSleutel, input.value));
      veldWrap.appendChild(veldLabel);
      veldWrap.appendChild(input);
      li.appendChild(veldWrap);
    }

    // Eigen aantekening per oplevering: de bron zegt vaak niet wát je inlevert
    // (Python-opdrachten, PSY-opdrachten, de AgTech-presentatie). Zodra Idries
    // het hoort, schrijft hij het hier bij — het staat dan op de regel zelf.
    const notitieSleutel = `${item.id}.notitie`;
    const notitie = document.createElement("input");
    notitie.type = "text";
    notitie.className = "oplevering-notitie";
    notitie.value = veldwaarden[notitieSleutel] ?? "";
    notitie.placeholder = "onderwerp of details";
    notitie.addEventListener("change", () => onVeldWijzigen(notitieSleutel, notitie.value));
    li.appendChild(notitie);

    if (item.opmerking && !gedeeldeOpmerkingen.has(item.opmerking)) {
      const opmerking = document.createElement("p");
      opmerking.className = "vak-detail-klein";
      opmerking.textContent = item.opmerking;
      li.appendChild(opmerking);
    }

    li.appendChild(verbergKnop(verborgenOpleveringSleutel(item.id), onVerbergen));
    lijst.appendChild(li);
  }
  wrap.appendChild(lijst);
  return wrap;
}

/**
 * FASE-9.md B3: hernoemd van "Deadlines" naar "Opdrachten en deadlines", en
 * gefilterd op items die al als een eigen regel in Opleveringen staan (via
 * dedupLabel) — hetzelfde onderdeel hoort maar één keer op dit scherm.
 * @param {string} vakId
 * @param {string[]} afgevinkteDeadlines
 * @param {string[]} verborgenItems
 * @param {(sleutel: string, afgevinkt: boolean) => void} onToggle
 * @returns {HTMLElement|null}
 */
function renderOpdrachtenEnDeadlinesSectie(vakId, afgevinkteDeadlines, verborgenItems, onToggle, onVerbergen) {
  const dedupLabels = new Set(zichtbareOpleveringen(verborgenItems).filter((o) => o.vak === vakId && o.dedupLabel).map((o) => o.dedupLabel));
  const relevant = zichtbareDeadlines(verborgenItems).filter((d) => d.course === vakId && !dedupLabels.has(d.label));
  if (relevant.length === 0) return null;

  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Opdrachten en deadlines"));
  const lijst = document.createElement("ul");
  for (const deadline of [...relevant].sort((a, b) => (a.date ?? a.start).localeCompare(b.date ?? b.start))) {
    const sleutel = deadlineSleutel(deadline);
    const li = document.createElement("li");
    const label = document.createElement("label");
    const vinkje = document.createElement("input");
    vinkje.type = "checkbox";
    vinkje.checked = afgevinkteDeadlines.includes(sleutel);
    vinkje.addEventListener("change", () => onToggle(sleutel, vinkje.checked));
    label.appendChild(vinkje);
    const tekst = document.createElement("span");
    tekst.textContent = ` ${kortDatum(deadline.date ?? deadline.start)} — ${deadline.label}`;
    label.appendChild(tekst);
    li.appendChild(label);
    li.appendChild(verbergKnop(verborgenDeadlineSleutel(deadline), onVerbergen));
    lijst.appendChild(li);
  }
  wrap.appendChild(lijst);
  return wrap;
}

function renderTellersSectie(course, veldwaarden, onVeldWijzigen) {
  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Teller"));

  if (course.id === "RTE") {
    const p = document.createElement("p");
    p.textContent = "Huiswerk: beste 5 van 7 tellen.";
    wrap.appendChild(p);
  } else if (course.id === "CHI") {
    const p = document.createElement("p");
    p.textContent = `Elke les een dictee, elke week huiswerk — de beste ${course.weektoetsen.besteAantalTelt} dictees tellen. Datums staan op NTU COOL.`;
    wrap.appendChild(p);
  } else if (course.id === "PY") {
    const ingeleverdSleutel = veldSleutel("PY", "opdrachtenIngeleverd");
    const totaalSleutel = veldSleutel("PY", "opdrachtenTotaal");

    const rij = document.createElement("div");
    rij.className = "teller-rij";

    const ingeleverdInput = document.createElement("input");
    ingeleverdInput.type = "number";
    ingeleverdInput.min = "0";
    ingeleverdInput.value = veldwaarden[ingeleverdSleutel] ?? "0";
    ingeleverdInput.addEventListener("change", () => onVeldWijzigen(ingeleverdSleutel, ingeleverdInput.value));

    const scheiding = document.createElement("span");
    scheiding.textContent = " van ";

    rij.appendChild(ingeleverdInput);
    rij.appendChild(scheiding);
    const totaal = veldwaarden[totaalSleutel] || (course.opdrachten.aantal ? String(course.opdrachten.aantal) : "");
    if (totaal) {
      const totaalEl = document.createElement("span");
      totaalEl.textContent = totaal;
      rij.appendChild(totaalEl);
    } else {
      rij.appendChild(renderOnbekendVeld(totaalSleutel, "totaal opdrachten", null, onVeldWijzigen));
    }
    wrap.appendChild(rij);

    const toelichting = document.createElement("p");
    toelichting.className = "vak-detail-klein";
    toelichting.textContent = `${course.opdrachten.tekst} (${course.opdrachten.zekerheid})`;
    wrap.appendChild(toelichting);
  } else {
    return null;
  }

  return wrap;
}

function renderLesoverzichtSectie(vakId) {
  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Lesoverzicht"));
  const lijst = document.createElement("ul");
  lijst.className = "lesoverzicht-lijst";
  for (const les of lesoverzicht(vakId)) {
    const li = document.createElement("li");
    const weekTekst = les.week ? ` (week ${les.week})` : "";
    const sprekerTekst = les.spreker ? ` — ${les.spreker}` : "";
    li.textContent = `${kortDatum(les.date)}${weekTekst} — ${les.label}${sprekerTekst}`;
    lijst.appendChild(li);
  }
  wrap.appendChild(lijst);
  return wrap;
}

function renderCursusrestrictiesSectie(course) {
  if (!course.cursusrestricties || course.cursusrestricties.length === 0) return null;
  const wrap = document.createElement("div");
  wrap.appendChild(sectieKop("Cursusrestricties"));
  const lijst = document.createElement("ul");
  for (const restrictie of course.cursusrestricties) {
    const li = document.createElement("li");
    li.className = "vak-detail-klein";
    li.textContent = restrictie.zekerheid === "ZEKER" ? restrictie.tekst : `${restrictie.tekst} (${restrictie.zekerheid})`;
    lijst.appendChild(li);
  }
  wrap.appendChild(lijst);
  return wrap;
}

function renderDetail(root, course, ctx, callbacks) {
  root.textContent = "";

  // Vaknaam en Sluiten op één regel; de knop stond eerder alleen op een lege
  // regel met de naam eronder.
  const kopRij = document.createElement("div");
  kopRij.className = "dagblad-kop-rij";
  const naam = document.createElement("h2");
  naam.className = "vak-detail-naam";
  naam.textContent = course.name;
  kopRij.appendChild(naam);
  const sluit = document.createElement("button");
  sluit.type = "button";
  sluit.className = "tap-target";
  sluit.textContent = "Sluiten";
  sluit.addEventListener("click", callbacks.onSluiten);
  kopRij.appendChild(sluit);
  root.appendChild(kopRij);

  const pythonAfgewezen = ctx.pythonInschrijving === "afgewezen";

  root.appendChild(renderKopSectie(course, ctx.vakkenVeldwaarden, ctx, callbacks));
  root.appendChild(renderWegingSectie(course));
  const restrictiesSectie = renderCursusrestrictiesSectie(course);
  if (restrictiesSectie) root.appendChild(restrictiesSectie);
  const tentamensSectie = renderTentamensSectie(course.id);
  if (tentamensSectie) root.appendChild(tentamensSectie);
  root.appendChild(renderAbsentieSectie(course, ctx.items, pythonAfgewezen));
  const opleveringenSectie = renderOpleveringenSectie(
    course.id,
    ctx.afgevinkteOpleveringen,
    ctx.vakkenVeldwaarden,
    ctx.verborgenItems,
    callbacks.onVeldWijzigen,
    callbacks.onOpleveringToggle,
    callbacks.onVerbergen
  );
  if (opleveringenSectie) root.appendChild(opleveringenSectie);
  const deadlinesSectie = renderOpdrachtenEnDeadlinesSectie(course.id, ctx.afgevinkteDeadlines, ctx.verborgenItems, callbacks.onDeadlineToggle, callbacks.onVerbergen);
  if (deadlinesSectie) root.appendChild(deadlinesSectie);
  const tellersSectie = renderTellersSectie(course, ctx.vakkenVeldwaarden, callbacks.onVeldWijzigen);
  if (tellersSectie) root.appendChild(tellersSectie);
  root.appendChild(renderLesoverzichtSectie(course.id));
}

function renderVakKaart(course, onKlik) {
  const kaart = document.createElement("button");
  kaart.type = "button";
  kaart.className = "tap-target vak-kaart";
  kaart.style.backgroundColor = `var(--vak-${course.id.toLowerCase()}-bg)`;
  kaart.style.color = `var(--vak-${course.id.toLowerCase()}-text)`;
  kaart.textContent = course.name;
  kaart.addEventListener("click", () => onKlik(course.id));
  return kaart;
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   onVeldWijzigen: (sleutel: string, waarde: string) => void,
 *   onInschrijvingWijzigen: (waarde: string) => void,
 *   onDeadlineToggle: (sleutel: string, afgevinkt: boolean) => void,
 *   onOpleveringToggle: (id: string, afgevinkt: boolean) => void,
 * }} callbacks
 * @returns {{render: (ctx: object) => void, openVak: (vakId: string) => void}}
 */
export function initVakkenScherm(root, callbacks) {
  const lijstEl = document.createElement("div");
  lijstEl.className = "vakken-lijst";
  const detailEl = document.createElement("div");
  detailEl.className = "dagblad-paneel";
  detailEl.hidden = true;
  root.appendChild(lijstEl);
  root.appendChild(detailEl);

  let geselecteerd = null;
  let laatsteCtx = null;

  function toonVak(vakId) {
    geselecteerd = vakId;
    tekenen();
  }
  function sluit() {
    geselecteerd = null;
    tekenen();
  }

  function tekenen() {
    if (!laatsteCtx) return;

    lijstEl.textContent = "";
    for (const course of courses) lijstEl.appendChild(renderVakKaart(course, toonVak));

    detailEl.hidden = geselecteerd === null;
    if (geselecteerd !== null) {
      renderDetail(detailEl, courseVoor(geselecteerd), laatsteCtx, {
        onSluiten: sluit,
        onVeldWijzigen: callbacks.onVeldWijzigen,
        onInschrijvingWijzigen: callbacks.onInschrijvingWijzigen,
        onDeadlineToggle: callbacks.onDeadlineToggle,
        onOpleveringToggle: callbacks.onOpleveringToggle,
        onVerbergen: callbacks.onVerbergen,
      });
    }
  }

  function render(ctx) {
    laatsteCtx = ctx;
    tekenen();
  }

  /** Zet dit scherm terug in zijn beginstand: de vakdetail dicht. */
  function naarBovenkant() {
    if (geselecteerd === null) return;
    sluit();
  }

  return { render, openVak: toonVak, naarBovenkant };
}
