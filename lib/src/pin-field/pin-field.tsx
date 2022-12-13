import React, {FC, forwardRef, useCallback, useImperativeHandle, useRef} from "react";
import {EffectReducer, StateReducer, useBireducer} from "react-use-bireducer";

import keyboardEventPolyfill from "../polyfills/keyboard-evt";
import {noop, range, omit} from "../utils";

import {
  PinFieldDefaultProps as DefaultProps,
  PinFieldInputProps as InputProps,
  PinFieldProps as Props,
  PinFieldNotifierProps as NotifierProps,
  PinFieldState as State,
  PinFieldAction as Action,
  PinFieldEffect as Effect,
} from "./pin-field.types";

export const NO_EFFECTS: Effect[] = [];
export const PROP_KEYS = ["autoFocus", "length", "validate", "format", "debug"];
export const HANDLER_KEYS = ["onResolveKey", "onRejectKey", "onChange", "onComplete"];
export const IGNORED_META_KEYS = ["Alt", "Control", "Enter", "Meta", "Shift", "Tab"];

export const defaultProps: DefaultProps = {
  ref: {current: []},
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  onResolveKey: noop,
  onRejectKey: noop,
  onChange: noop,
  onComplete: noop,
  debug: false,
};

export function defaultState(props: Pick<DefaultProps, "validate" | "length">): State {
  return {
    focusIdx: 0,
    codeLength: props.length,
    isKeyAllowed: isKeyAllowed(props.validate),
    fallback: null,
  };
}

export function getPrevFocusIdx(currFocusIdx: number) {
  return Math.max(0, currFocusIdx - 1);
}

export function getNextFocusIdx(currFocusIdx: number, lastFocusIdx: number) {
  if (lastFocusIdx === 0) return 0;
  return Math.min(currFocusIdx + 1, lastFocusIdx - 1);
}

export function isKeyAllowed(predicate: DefaultProps["validate"]) {
  return (key: string) => {
    if (!key) return false;
    if (key.length > 1) return false;
    if (typeof predicate === "string") return predicate.split("").includes(key);
    if (predicate instanceof Array) return predicate.includes(key);
    if (predicate instanceof RegExp) return predicate.test(key);
    return predicate(key);
  };
}

export function pasteReducer(state: State, idx: number, val: string): [State, Effect[]] {
  const areAllKeysAllowed = val
    .split("")
    .slice(0, state.codeLength)
    .every(state.isKeyAllowed);

  if (!areAllKeysAllowed) {
    return [
      state,
      [
        {type: "set-input-val", idx: state.focusIdx, val: ""},
        {type: "reject-key", idx, key: val},
        {type: "handle-code-change"},
      ],
    ];
  }

  const pasteLen = Math.min(val.length, state.codeLength - state.focusIdx);
  const nextFocusIdx = getNextFocusIdx(pasteLen + state.focusIdx - 1, state.codeLength);
  const effects: Effect[] = range(0, pasteLen).flatMap(idx => [
    {
      type: "set-input-val",
      idx: idx + state.focusIdx,
      val: val[idx],
    },
    {
      type: "resolve-key",
      idx: idx + state.focusIdx,
      key: val[idx],
    },
  ]);

  if (state.focusIdx !== nextFocusIdx) {
    effects.push({type: "focus-input", idx: nextFocusIdx});
  }

  effects.push({type: "handle-code-change"});

  return [{...state, focusIdx: nextFocusIdx}, effects];
}

export const stateReducer: StateReducer<State, Action, Effect> = (state, action) => {
  switch (action.type) {
    case "handle-key-down": {
      switch (action.key) {
        case "Unidentified": {
          return [{...state, fallback: {idx: state.focusIdx, val: action.val}}, NO_EFFECTS];
        }

        case "Dead": {
          return [
            state,
            [
              {type: "set-input-val", idx: state.focusIdx, val: ""},
              {type: "reject-key", idx: state.focusIdx, key: action.key},
              {type: "handle-code-change"},
            ],
          ];
        }

        case "ArrowLeft": {
          const prevFocusIdx = getPrevFocusIdx(state.focusIdx);
          return [{...state, focusIdx: prevFocusIdx}, [{type: "focus-input", idx: prevFocusIdx}]];
        }

        case "ArrowRight": {
          const nextFocusIdx = getNextFocusIdx(state.focusIdx, state.codeLength);
          return [{...state, focusIdx: nextFocusIdx}, [{type: "focus-input", idx: nextFocusIdx}]];
        }

        case "Delete":
        case "Backspace": {
          return [state, [{type: "handle-delete", idx: state.focusIdx}, {type: "handle-code-change"}]];
        }

        default: {
          if (!state.isKeyAllowed(action.key)) {
            return [state, [{type: "reject-key", idx: state.focusIdx, key: action.key}]];
          }

          const nextFocusIdx = getNextFocusIdx(state.focusIdx, state.codeLength);
          return [
            {...state, focusIdx: nextFocusIdx},
            [
              {type: "set-input-val", idx: state.focusIdx, val: action.key},
              {type: "resolve-key", idx: state.focusIdx, key: action.key},
              {type: "focus-input", idx: nextFocusIdx},
              {type: "handle-code-change"},
            ],
          ];
        }
      }
    }

    case "handle-key-up": {
      if (!state.fallback) {
        return [state, NO_EFFECTS];
      }

      const nextState: State = {...state, fallback: null};
      const effects: Effect[] = [];
      const {idx, val: prevVal} = state.fallback;
      const val = action.val;

      if (prevVal === "" && val === "") {
        effects.push({type: "handle-delete", idx}, {type: "handle-code-change"});
      } else if (prevVal === "" && val !== "") {
        return pasteReducer(nextState, idx, val);
      }

      return [nextState, effects];
    }

    case "handle-paste": {
      return pasteReducer(state, action.idx, action.val);
    }

    case "focus-input": {
      return [{...state, focusIdx: action.idx}, [{type: "focus-input", idx: action.idx}]];
    }

    default: {
      return [state, NO_EFFECTS];
    }
  }
};

export function useEffectReducer({refs, ...props}: NotifierProps): EffectReducer<Effect, Action> {
  return useCallback(
    effect => {
      switch (effect.type) {
        case "focus-input": {
          refs.current[effect.idx].focus();
          break;
        }

        case "set-input-val": {
          const val = props.format(effect.val);
          refs.current[effect.idx].value = val;
          break;
        }

        case "resolve-key": {
          refs.current[effect.idx].setCustomValidity("");
          props.onResolveKey(effect.key, refs.current[effect.idx]);
          break;
        }

        case "reject-key": {
          refs.current[effect.idx].setCustomValidity("Invalid key");
          props.onRejectKey(effect.key, refs.current[effect.idx]);
          break;
        }

        case "handle-delete": {
          const prevVal = refs.current[effect.idx].value;
          refs.current[effect.idx].setCustomValidity("");
          refs.current[effect.idx].value = "";

          if (!prevVal) {
            const prevIdx = getPrevFocusIdx(effect.idx);
            refs.current[prevIdx].focus();
            refs.current[prevIdx].setCustomValidity("");
            refs.current[prevIdx].value = "";
          }

          break;
        }

        case "handle-code-change": {
          const dir = (props.dir || document.documentElement.getAttribute("dir") || "ltr").toLowerCase();
          const codeArr = refs.current.map(r => r.value.trim());
          const code = (dir === "rtl" ? codeArr.reverse() : codeArr).join("");
          props.onChange(code);
          code.length === props.length && props.onComplete(code);
          break;
        }

        default: {
          break;
        }
      }
    },
    [props, refs],
  );
}

export const PinField: FC<Props> = forwardRef((customProps, fwdRef) => {
  const props: DefaultProps & InputProps = {...defaultProps, ...customProps};
  const {autoFocus, length: codeLength} = props;
  const inputProps: InputProps = omit([...PROP_KEYS, ...HANDLER_KEYS], props);
  const refs = useRef<HTMLInputElement[]>([]);
  const effectReducer = useEffectReducer({refs, ...props});
  const dispatch = useBireducer(stateReducer, effectReducer, defaultState(props))[1];

  useImperativeHandle(fwdRef, () => refs.current, [refs]);

  function handleFocus(idx: number) {
    return function() {
      dispatch({type: "focus-input", idx});
    };
  }

  function handleKeyDown(idx: number) {
    return function(evt: React.KeyboardEvent<HTMLInputElement>) {
      const key = keyboardEventPolyfill.getKey(evt.nativeEvent);
      if (
        !IGNORED_META_KEYS.includes(key) &&
        !evt.ctrlKey &&
        !evt.altKey &&
        !evt.metaKey &&
        evt.nativeEvent.target instanceof HTMLInputElement
      ) {
        evt.preventDefault();
        dispatch({type: "handle-key-down", idx, key, val: evt.nativeEvent.target.value});
      }
    };
  }

  function handleKeyUp(idx: number) {
    return function(evt: React.KeyboardEvent<HTMLInputElement>) {
      if (evt.nativeEvent.target instanceof HTMLInputElement) {
        dispatch({type: "handle-key-up", idx, val: evt.nativeEvent.target.value});
      }
    };
  }

  function handlePaste(idx: number) {
    return function(evt: React.ClipboardEvent<HTMLInputElement>) {
      evt.preventDefault();
      const val = evt.clipboardData.getData("Text");
      dispatch({type: "handle-paste", idx, val});
    };
  }

  function setRefAtIndex(idx: number) {
    return function(ref: HTMLInputElement) {
      if (ref) {
        refs.current[idx] = ref;
      }
    };
  }

  function hasAutoFocus(idx: number) {
    return Boolean(idx === 0 && autoFocus);
  }

  return (
    <>
      {range(0, codeLength).map(idx => (
        <input
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          inputMode="text"
          {...inputProps}
          key={idx}
          ref={setRefAtIndex(idx)}
          autoFocus={hasAutoFocus(idx)}
          onFocus={handleFocus(idx)}
          onKeyDown={handleKeyDown(idx)}
          onKeyUp={handleKeyUp(idx)}
          onPaste={handlePaste(idx)}
        />
      ))}
    </>
  );
});

export default PinField;
