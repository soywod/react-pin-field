import { BACKSPACE_KEY_CODE, DELETE_KEY_CODE } from "./utils";
import { Action } from "./actions";
import { State } from "./state";

export function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case "update-props": {
      // merge previous state with action's props
      const state = { ...prevState, ...action.props };

      // adjust cursor in case the new length exceed the previous one
      state.cursor = Math.min(state.cursor, state.length - 1);

      // slice values according to the new length
      //
      // NOTE: use slice because splice does not keep empty items and
      // therefore messes up with values length
      state.values = state.values.slice(0, state.cursor + 1);

      // state is now ready
      state.ready = true;

      return state;
    }

    case "start-composition": {
      return { ...prevState, dirty: true, composition: true };
    }

    case "end-composition": {
      const state: State = { ...prevState };

      if (action.value) {
        state.values[action.index] = action.value;
      } else {
        delete state.values[action.index];
      }

      const dir = state.values[action.index] ? 1 : 0;
      state.cursor = Math.min(action.index + dir, state.length - 1);

      state.composition = false;
      state.dirty = true;

      return state;
    }

    case "handle-change": {
      if (prevState.composition) {
        break;
      }

      const state: State = { ...prevState };

      if (action.reset) {
        state.values.splice(action.index, state.length);
      }

      if (action.value) {
        const values = action.value.split("").map(state.format);
        const length = Math.min(state.length - action.index, values.length);
        state.values.splice(action.index, length, ...values.slice(0, length));
        state.cursor = Math.min(action.index + length, state.length - 1);
      } else {
        delete state.values[action.index];
        const dir = state.backspace ? 0 : 1;
        state.cursor = Math.max(0, action.index - dir);
      }

      state.backspace = false;
      state.dirty = true;

      return state;
    }

    case "handle-key-down": {
      // determine if a deletion key is pressed
      const fromKey = action.key === "Backspace" || action.key === "Delete";
      const fromCode = action.code === "Backspace" || action.code === "Delete";
      const fromKeyCode =
        action.keyCode === BACKSPACE_KEY_CODE || action.keyCode === DELETE_KEY_CODE;
      const fromWhich = action.which === BACKSPACE_KEY_CODE || action.which === DELETE_KEY_CODE;
      const deletion = fromKey || fromCode || fromKeyCode || fromWhich;

      // return the same state reference if no deletion detected
      if (!deletion) {
        break;
      }

      // Deletion is a bit tricky and requires special attention.
      //
      // When the field under cusor has a value and a deletion key is
      // pressed, we want to let the browser to do the deletion for
      // us, like a regular deletion in a normal input via the
      // `onchange` event. For this to happen, we need to return the
      // same state reference in order not to trigger any change. The
      // state will be automatically updated by the handle-change
      // action, when the deleted value will trigger the `onchange`
      // event.
      if (prevState.values[action.index]) {
        break;
      }

      // But when the field under cursor is empty, deletion cannot
      // happen by itself. The trick is to manually move the cursor
      // backwards: the browser will then delete the value under this
      // new cursor and perform the changes via the triggered
      // `onchange` event.
      else {
        const state: State = { ...prevState };

        state.cursor = Math.max(0, action.index - 1);

        // let know the handle-change action that we already moved
        // backwards and that we don't need to touch the cursor
        // anymore
        state.backspace = true;

        state.dirty = true;

        return state;
      }
    }

    case "noop":
    default:
      break;
  }

  return prevState;
}
