import { renderCalendar } from "./render.js";
import { renderPlannerForm, renderPersistRegel, renderExportRegel, renderConflictenPaneel } from "./planner.js";
import {
  laadState,
  bewaarState,
  voegItemToe,
  verwijderItem,
  vraagPersistentOpslagAan,
  bereidExportVoor,
  bereidSamenvoegingVoor,
  pasConflictKeuzesToe,
} from "../state/store.js";

const persistEl = document.getElementById("persist-regel");
const exportEl = document.getElementById("export-regel");
const conflictenEl = document.getElementById("conflicten-paneel");
const formEl = document.getElementById("planner-form");
const kalenderEl = document.getElementById("app");

let state = await laadState();
let openstaandeConflicten = [];

async function opnieuwRenderen() {
  renderExportRegel(exportEl, state.laatsteExport, exporteer);
  exportEl.addEventListener("import-bestand", (e) => importeerBestand(e.detail), { once: true });

  renderConflictenPaneel(conflictenEl, openstaandeConflicten, pasConflictenToe);

  renderPlannerForm(formEl, async (veld) => {
    state = voegItemToe(state, veld);
    await bewaarState(state);
    opnieuwRenderen();
  });

  renderCalendar(kalenderEl, state.items, async (id) => {
    state = verwijderItem(state, id);
    await bewaarState(state);
    opnieuwRenderen();
  });
}

function downloadBestand(bestandsnaam, inhoud) {
  const blob = new Blob([inhoud], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = bestandsnaam;
  link.click();
  URL.revokeObjectURL(url);
}

async function exporteer() {
  const { state: nieuweState, bestandsnaam, inhoud } = bereidExportVoor(state);
  state = nieuweState;
  await bewaarState(state);
  downloadBestand(bestandsnaam, inhoud);
  opnieuwRenderen();
}

async function importeerBestand(bestand) {
  const tekst = await bestand.text();
  const geimporteerd = JSON.parse(tekst);
  const { items, conflicten } = bereidSamenvoegingVoor(state, geimporteerd);
  state = { ...state, items };
  await bewaarState(state);
  openstaandeConflicten = conflicten;
  opnieuwRenderen();
}

async function pasConflictenToe(keuzes) {
  state = { ...state, items: pasConflictKeuzesToe(state.items, openstaandeConflicten, keuzes) };
  openstaandeConflicten = [];
  await bewaarState(state);
  opnieuwRenderen();
}

vraagPersistentOpslagAan().then((toegekend) => renderPersistRegel(persistEl, toegekend));
opnieuwRenderen();
