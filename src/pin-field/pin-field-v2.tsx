import { FC, useEffect, useReducer, useRef } from "react";

import { noop, range } from "../utils";

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

export type Props = Partial<DefaultProps>;

export type State = {
  cursor: number;
  values: string[];
  length: number;
};

export function defaultState(length: number): State {
  return {
    cursor: 0,
    values: [],
    length,
  };
}

export type Action = { type: "handle-change"; key: number; value: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "handle-change": {
      console.log("action", action);
      state.values[action.key] = action.value;

      if (action.value === "") {
        state.cursor = action.key - 1;
      } else {
        state.cursor = action.key + 1;
      }
    }
  }

  return { ...state };
}

export const PinFieldV2: FC<Props> = props => {
  const length = props.length || defaultProps.length;
  const refs = useRef<HTMLInputElement[]>([]);
  const [state, dispatch] = useReducer(reducer, defaultState(length));

  console.log("state", state);

  function setRefAtIndex(idx: number) {
    return function (ref: HTMLInputElement) {
      if (ref) {
        refs.current[idx] = ref;
      }
    };
  }

  useEffect(() => {
    if (!refs.current) return;
    refs.current[state.cursor].focus();
  }, [refs, state.cursor]);

  return (
    <>
      {range(0, length).map(key => (
        <input
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          inputMode="text"
          key={key}
          ref={setRefAtIndex(key)}
          onChange={evt => dispatch({ type: "handle-change", key, value: evt.target.value })}
        />
      ))}
    </>
  );
};

export default PinFieldV2;
