import { renderCalendar } from "./render.js";
import { renderPlannerForm, renderPersistRegel } from "./planner.js";
import { laadState, bewaarState, voegItemToe, verwijderItem, vraagPersistentOpslagAan } from "../state/store.js";

const persistEl = document.getElementById("persist-regel");
const formEl = document.getElementById("planner-form");
const kalenderEl = document.getElementById("app");

let state = await laadState();

async function opnieuwRenderen() {
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

vraagPersistentOpslagAan().then((toegekend) => renderPersistRegel(persistEl, toegekend));
opnieuwRenderen();
