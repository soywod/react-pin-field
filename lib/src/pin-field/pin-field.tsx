import React, {FC, forwardRef, useCallback, useImperativeHandle, useRef} from "react";

import {useMVU} from "../mvu";
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

export const NO_EFFECT: Effect[] = [];
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

export function apply(state: State, action: Action): [State, Effect[]] {
  switch (action.type) {
    case "handle-key-down": {
      switch (action.key) {
        case "Unidentified": {
          return [{...state, fallback: {idx: state.focusIdx, val: action.val}}, []];
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
          if (state.isKeyAllowed(action.key)) {
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

          return [state, [{type: "reject-key", idx: state.focusIdx, key: action.key}]];
        }
      }
    }

    case "handle-key-up": {
      if (!state.fallback) {
        return [state, NO_EFFECT];
      }

      const nextState: State = {...state, fallback: null};
      const effects: Effect[] = [];
      const {idx, val: prevVal} = state.fallback;
      const val = action.val;

      if (prevVal === "" && val === "") {
        effects.push({type: "handle-delete", idx}, {type: "handle-code-change"});
      } else if (prevVal === "" && val !== "") {
        if (state.isKeyAllowed(val)) {
          effects.push(
            {type: "set-input-val", idx, val},
            {type: "resolve-key", idx, key: val},
            {type: "focus-input", idx: getNextFocusIdx(idx, state.codeLength)},
            {type: "handle-code-change"},
          );
        } else {
          effects.push(
            {type: "set-input-val", idx: state.focusIdx, val: ""},
            {type: "reject-key", idx, key: val},
            {type: "handle-code-change"},
          );
        }
      }

      return [nextState, effects];
    }

    case "handle-paste": {
      if (!action.val.split("").slice(0, state.codeLength).every(state.isKeyAllowed)) {
        return [state, [{type: "reject-key", idx: action.idx, key: action.val}]];
      }

      const pasteLen = Math.min(action.val.length, state.codeLength - state.focusIdx);
      const nextFocusIdx = getNextFocusIdx(pasteLen + state.focusIdx - 1, state.codeLength);
      const effects: Effect[] = range(0, pasteLen).map(idx => ({
        type: "set-input-val",
        idx: idx + state.focusIdx,
        val: action.val[idx],
      }));

      if (state.focusIdx !== nextFocusIdx) {
        effects.push({type: "focus-input", idx: nextFocusIdx});
      }

      effects.push({type: "handle-code-change"});

      return [{...state, focusIdx: nextFocusIdx}, effects];
    }

    case "focus-input": {
      return [{...state, focusIdx: action.idx}, [{type: "focus-input", idx: action.idx}]];
    }

    default: {
      return [state, NO_EFFECT];
    }
  }
}

export function useNotifier({refs, ...props}: NotifierProps) {
  return useCallback(
    (eff: Effect) => {
      switch (eff.type) {
        case "focus-input": {
          refs.current[eff.idx].focus();
          break;
        }

        case "set-input-val": {
          const val = props.format(eff.val);
          refs.current[eff.idx].value = val;
          break;
        }

        case "resolve-key": {
          refs.current[eff.idx].setCustomValidity("");
          props.onResolveKey(eff.key, refs.current[eff.idx]);
          break;
        }

        case "reject-key": {
          refs.current[eff.idx].setCustomValidity("Invalid key");
          props.onRejectKey(eff.key, refs.current[eff.idx]);
          break;
        }

        case "handle-delete": {
          const prevVal = refs.current[eff.idx].value;
          refs.current[eff.idx].setCustomValidity("");
          refs.current[eff.idx].value = "";

          if (!prevVal) {
            const prevIdx = getPrevFocusIdx(eff.idx);
            refs.current[prevIdx].focus();
            refs.current[prevIdx].setCustomValidity("");
            refs.current[prevIdx].value = "";
          }

          break;
        }

        case "handle-code-change": {
          const dir = (document.documentElement.getAttribute("dir") || "ltr").toLowerCase();
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
  const model = defaultState(props);
  const notify = useNotifier({refs, ...props});
  const dispatch = useMVU(model, apply, notify);

  useImperativeHandle(fwdRef, () => refs.current, [refs]);

  function handleFocus(idx: number) {
    return function () {
      dispatch({type: "focus-input", idx});
    };
  }

  function handleKeyDown(idx: number) {
    return function (evt: React.KeyboardEvent<HTMLInputElement>) {
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
    return function (evt: React.KeyboardEvent<HTMLInputElement>) {
      if (evt.nativeEvent.target instanceof HTMLInputElement) {
        dispatch({type: "handle-key-up", idx, val: evt.nativeEvent.target.value});
      }
    };
  }

  function handlePaste(idx: number) {
    return function (evt: React.ClipboardEvent<HTMLInputElement>) {
      evt.preventDefault();
      const val = evt.clipboardData.getData("Text");
      dispatch({type: "handle-paste", idx, val});
    };
  }

  function setRefAtIndex(idx: number) {
    return function (ref: HTMLInputElement) {
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
          maxLength={1}
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
