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

export type InnerProps = {
  length: number;
  validate: string | string[] | RegExp | ((key: string) => boolean);
  format: (char: string) => string;
  formatAriaLabel: (idx: number, codeLength: number) => string;
  onResolveKey: (key: string, ref?: HTMLInputElement) => any;
  onRejectKey: (key: string, ref?: HTMLInputElement) => any;
  onComplete: (code: string) => void;
};

export const defaultProps: InnerProps = {
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  formatAriaLabel: (i: number, n: number) => `PIN field ${i} of ${n}`,
  onResolveKey: noop,
  onRejectKey: noop,
  onComplete: noop,
};

export type Props = Partial<InnerProps> & {
  handler?: Handler;
};

export type State = {
  props: InnerProps;
  cursor: number;
  values: string[];
  backspace: boolean;
  composition: boolean;
  ready: boolean;
};

export const defaultState: State = {
  props: defaultProps,
  cursor: 0,
  values: Array(defaultProps.length),
  backspace: false,
  composition: false,
  ready: false,
};

export type Action =
  | { type: "init"; props: Props }
  | { type: "update-length"; length: number }
  | { type: "handle-change"; index: number; value: string | null; reset?: boolean }
  | { type: "handle-key-down"; index: number; event: KeyboardEvent<HTMLInputElement> }
  | { type: "start-composition"; index: number }
  | { type: "end-composition"; index: number; value: string };

export function reducer(state: State, action: Action): State {
  console.log("action", action);

  switch (action.type) {
    case "init": {
      state.props = { ...defaultProps, ...action.props };
      state.values.splice(state.cursor, state.props.length);
      state.ready = true;
      state.cursor = Math.min(state.cursor, state.props.length - 1);
      return { ...state };
    }

    case "update-length": {
      state.values.splice(state.cursor, action.length);
      state.props.length = action.length;
      state.cursor = Math.min(state.cursor, action.length - 1);
      return { ...state };
    }

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
      state.cursor = Math.min(action.index + dir, state.props.length - 1);

      return { ...state };
    }

    case "handle-change": {
      if (state.composition) {
        break;
      }

      if (action.reset) {
        state.values = Array(state.props.length);
      }

      if (action.value) {
        const values = action.value.split("").map(state.props.format);
        const length = Math.min(state.props.length - action.index, values.length);
        state.values.splice(action.index, length, ...values.slice(0, length));
        state.cursor = Math.min(action.index + length, state.props.length - 1);
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
  init: (props: Props) => void;
  refs: RefObject<HTMLInputElement[]>;
  state: State;
  dispatch: ActionDispatch<[Action]>;
  value: string;
  setValue: (value: string) => void;
};

export function usePinField(): Handler {
  return useInternalHandler();
}

export function useInternalHandler(): Handler {
  const refs = useRef<HTMLInputElement[]>([]);
  const [state, dispatch] = useReducer(reducer, defaultState);

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

  const init = useCallback(
    (props: Props) => {
      dispatch({ type: "init", props });
    },
    [dispatch],
  );

  return useMemo(
    () => ({ refs, state, dispatch, value, setValue, init }),
    [refs, state, dispatch, value, setValue, init],
  );
}

export const PinFieldV2: FC<Props> = forwardRef(({ handler: customHandler, ...props }, fwdRef) => {
  const internalHandler = useInternalHandler();
  const handler = customHandler || internalHandler;

  useImperativeHandle(fwdRef, () => handler.refs.current, [handler.refs]);

  console.log("state", handler.state);

  function setRefAt(index: number): (ref: HTMLInputElement) => void {
    return ref => {
      if (ref) {
        handler.refs.current[index] = ref;
      }
    };
  }

  function handleKeyDownAt(index: number): KeyboardEventHandler<HTMLInputElement> {
    return event => {
      handler.dispatch({ type: "handle-key-down", index, event });
    };
  }

  function handleChangeAt(index: number): ChangeEventHandler<HTMLInputElement> {
    return event => {
      // should not happen, mostly for typescript to infer properly
      if (!(event.nativeEvent instanceof InputEvent)) return;
      handler.dispatch({ type: "handle-change", index, value: event.nativeEvent.data });
    };
  }

  function startCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
    return () => {
      handler.dispatch({ type: "start-composition", index });
    };
  }

  function endCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
    return event => {
      handler.dispatch({ type: "end-composition", index, value: event.data });
    };
  }

  useEffect(() => {
    if (handler.state.ready) return;
    handler.init(props);
  }, [props, handler.state.ready, handler.init]);

  useEffect(() => {
    handler.init({ length: props.length });
  }, [handler.init, props.length !== handler.state.props.length]);

  // useEffect(() => {
  //   if (props.length === undefined) return;
  //   handler.dispatch({ type: "update-length", length: props.length });
  // }, [props.length !== handler.state.props.length, handler.dispatch]);

  useEffect(() => {
    if (!handler.state.ready) return;
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

  if (!handler.state.ready) {
    return null;
  }

  return (
    <>
      {range(0, handler.state.props.length).map(index => (
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
