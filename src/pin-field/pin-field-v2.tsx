import {
  FC,
  useEffect,
  useReducer,
  useRef,
  KeyboardEventHandler,
  KeyboardEvent,
  ChangeEventHandler,
  useCallback,
  CompositionEventHandler,
  forwardRef,
  useImperativeHandle,
  RefObject,
  ActionDispatch,
  useMemo,
} from "react";

import { noop, range } from "../utils";

const BACKSPACE = 8;
const DELETE = 46;

export type DefaultProps = {
  length: number;
  validate: string | string[] | RegExp | ((key: string) => boolean);
  format: (char: string) => string;
  formatAriaLabel: (idx: number, codeLength: number) => string;
  onResolveKey: (key: string, ref?: HTMLInputElement) => any;
  onRejectKey: (key: string, ref?: HTMLInputElement) => any;
  onChange: (code: string) => void;
  onComplete: (code: string) => void;
};

export const defaultProps: DefaultProps = {
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  formatAriaLabel: (i: number, n: number) => `PIN field ${i} of ${n}`,
  onResolveKey: noop,
  onRejectKey: noop,
  onChange: noop,
  onComplete: noop,
};

export type Props = Partial<DefaultProps> & {
  handler?: Handler;
};

export type State = {
  cursor: number;
  values: string[];
  length: number;
  backspace: boolean;
  composition: boolean;
};

export function defaultState(length: number): State {
  return {
    cursor: 0,
    values: Array(length),
    length,
    backspace: false,
    composition: false,
  };
}

export type Action =
  | { type: "handle-change"; index: number; value: string | null; reset?: boolean }
  | { type: "handle-key-down"; index: number; event: KeyboardEvent<HTMLInputElement> }
  | { type: "start-composition"; index: number }
  | { type: "end-composition"; index: number; value: string };

export function reducer(state: State, action: Action): State {
  console.log("action", action);

  switch (action.type) {
    case "start-composition": {
      return { ...state, composition: true };
    }

    case "end-composition": {
      state.composition = false;

      if (action.value) {
        state.values[action.index] = action.value;
      } else {
        delete state.values[action.index];
      }

      const dir = state.values[action.index] ? 1 : 0;
      state.cursor = Math.min(action.index + dir, state.length - 1);

      return { ...state };
    }

    case "handle-change": {
      if (state.composition) {
        break;
      }

      if (action.reset) {
        state.values = Array(state.length);
      }

      if (action.value) {
        const values = action.value.split("");
        const length = Math.min(state.length - action.index, values.length);
        state.values.splice(action.index, length, ...values.slice(0, length));
        state.cursor = Math.min(action.index + length, state.length - 1);
      } else {
        delete state.values[action.index];
        const dir = state.backspace ? 0 : 1;
        state.cursor = Math.max(0, action.index - dir);
      }

      return { ...state, backspace: false };
    }

    case "handle-key-down": {
      const key = action.event.key === "Backspace" || action.event.key === "Delete";
      const which = action.event.which === BACKSPACE || action.event.which === DELETE;
      const keyCode = action.event.keyCode === BACKSPACE || action.event.keyCode === DELETE;
      const deletion = key || which || keyCode;

      // Deletion is a bit tricky and requires special attention.
      //
      // When the current field has a value, deletion works as
      // expected AS LONG AS THE STATE IS NOT UPDATED and keeps its
      // reference: the value deletes by itself and the `onchange`
      // event is triggered, which updates the state.
      //
      // But when the current field is empty, deletion does not
      // trigger the `onchange` event. Therefore the state needs to be
      // updated here. Moving the cursor backwards is enough for
      // deletion to happen on the previous field, which triggers the
      // `onchange` event and re-update the state.
      if (deletion) {
        // if empty value, move the cursor backwards and update the
        // state
        if (!state.values[action.index]) {
          state.cursor = Math.max(0, action.index - 1);

          // let know the handle-change action that we already moved
          // backwards and that we don't need to touch the cursor
          // anymore
          state.backspace = true;

          return { ...state };
        }

        // otherwise just return the same state and let the onchange
        // event do the job
      }

      break;
    }
  }

  return state;
}

type Handler = {
  refs: RefObject<HTMLInputElement[]>;
  state: State;
  dispatch: ActionDispatch<[Action]>;
  value: string;
  setValue: (value: string) => void;
};

export function usePinField(length?: number): Handler {
  return useInternalHandler(length);
}

export function useInternalHandler(length: number = defaultProps.length, handler?: Handler): Handler {
  if (handler) return handler;

  const refs = useRef<HTMLInputElement[]>([]);
  const [state, dispatch] = useReducer(reducer, defaultState(length));

  const value = useMemo(() => {
    let value = "";
    for (let index = 0; index < state.values.length; index++) {
      value += index in state.values ? state.values[index] : "";
    }
    return value;
  }, [state]);

  const setValue = useCallback(
    (value: string) => {
      dispatch({ type: "handle-change", index: 0, value, reset: true });
    },
    [dispatch, state.cursor],
  );

  return { refs, state, dispatch, value, setValue };
}

export const PinFieldV2: FC<Props> = forwardRef((props, fwdRef) => {
  const handler = useInternalHandler(props.length, props.handler);

  useImperativeHandle(fwdRef, () => handler.refs.current, [handler.refs]);

  console.log("state", handler.state);

  function setRefAt(index: number): (ref: HTMLInputElement) => void {
    return useCallback(
      ref => {
        if (ref) {
          handler.refs.current[index] = ref;
        }
      },
      [index],
    );
  }

  function handleKeyDownAt(index: number): KeyboardEventHandler<HTMLInputElement> {
    return useCallback(
      event => {
        handler.dispatch({ type: "handle-key-down", index, event });
      },
      [index, handler.dispatch],
    );
  }

  function handleChangeAt(index: number): ChangeEventHandler<HTMLInputElement> {
    return useCallback(
      event => {
        // should not happen, mostly for typescript to infer properly
        if (!(event.nativeEvent instanceof InputEvent)) return;
        handler.dispatch({ type: "handle-change", index, value: event.nativeEvent.data });
      },
      [index, handler.dispatch],
    );
  }

  function startCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
    return useCallback(() => {
      handler.dispatch({ type: "start-composition", index });
    }, [index, handler.dispatch]);
  }

  function endCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
    return useCallback(
      event => {
        handler.dispatch({ type: "end-composition", index, value: event.data });
      },
      [index, handler.dispatch],
    );
  }

  useEffect(() => {
    if (props.onChange === undefined) return;
    props.onChange(handler.value);
  }, [props.onChange, handler.value]);

  useEffect(() => {
    if (!handler.refs.current) return;
    console.log("state changed");

    let innerFocus = false;

    for (let index = 0; index < handler.state.values.length; index++) {
      const value = index in handler.state.values ? handler.state.values[index] : "";
      handler.refs.current[index].value = value;
      innerFocus = innerFocus || hasFocus(handler.refs.current[index]);
    }

    if (innerFocus) {
      handler.refs.current[handler.state.cursor].focus();
    }
  }, [handler.refs, handler.state]);

  return (
    <>
      {range(0, handler.state.length).map(index => (
        <input
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          inputMode="text"
          key={index}
          ref={setRefAt(index)}
          onKeyDown={handleKeyDownAt(index)}
          onChange={handleChangeAt(index)}
          onCompositionStart={startCompositionAt(index)}
          onCompositionEnd={endCompositionAt(index)}
        />
      ))}
    </>
  );
});

export function hasFocus(el: HTMLElement): boolean {
  try {
    const matches = el.webkitMatchesSelector || el.matches;
    return matches.call(el, ":focus");
  } catch (err: any) {
    return false;
  }
}

export default PinFieldV2;
