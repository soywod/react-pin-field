import React, {FC, Dispatch, useCallback, useRef} from "react"
import classNames from "classnames"

import useMVU from "./mvu"

import {
  PinFieldDefaultProps as DefaultProps,
  PinFieldProps as Props,
  PinFieldState as State,
  PinFieldAction as Action,
  PinFieldEffect as Effect,
} from "./pin-field.types"

// TODO: unit tests
export const IGNORED_META_KEYS = ["Alt", "Control", "Enter", "Meta", "Shift", "Tab"]
export const NO_EFFECT: Effect[] = []

// TODO: unit tests
export const defaultProps: DefaultProps = {
  className: "",
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  onResolveKey: () => {},
  onRejectKey: () => {},
  onChange: () => {},
  onComplete: () => {},
  style: {},
}

// TODO: unit tests
export function getPrevFocusIdx(currFocusIdx: number) {
  return Math.max(0, currFocusIdx - 1)
}

// TODO: unit tests
export function getNextFocusIdx(currFocusIdx: number, lastFocusIdx: number) {
  return Math.min(currFocusIdx + 1, lastFocusIdx - 1)
}

// TODO: unit tests
export const isKeyAllowed = (predicate: DefaultProps["validate"]) => (key: string) => {
  if (!key) return false
  if (key.length > 1) return false
  if (typeof predicate === "string") return predicate.split("").includes(key)
  if (predicate instanceof Array) return predicate.includes(key)
  if (predicate instanceof RegExp) return predicate.test(key)
  return predicate(key)
}

// TODO: unit tests
function apply(state: State, action: Action): [State, Effect[]] {
  switch (action.type) {
    case "handle-key-down": {
      switch (action.key) {
        case "Unidentified":
        case "Dead": {
          const effects: Effect[] = [
            {type: "set-input-val", idx: state.focusIdx, val: ""},
            {type: "reject-key", idx: state.focusIdx, key: action.key},
            {type: "handle-code-change"},
          ]
          return [state, effects]
        }

        case "ArrowLeft": {
          const prevFocusIdx = getPrevFocusIdx(state.focusIdx)
          const effects: Effect[] = [{type: "focus-input", idx: prevFocusIdx}]
          return [{...state, focusIdx: prevFocusIdx}, effects]
        }

        case "ArrowRight": {
          const nextFocusIdx = getNextFocusIdx(state.focusIdx, state.codeLength)
          const effects: Effect[] = [{type: "focus-input", idx: nextFocusIdx}]
          return [{...state, focusIdx: nextFocusIdx}, effects]
        }

        case "Backspace": {
          const prevFocusIdx = getPrevFocusIdx(state.focusIdx)
          const effects: Effect[] = [
            {type: "set-input-val", idx: state.focusIdx, val: ""},
            {type: "focus-input", idx: prevFocusIdx},
            {type: "handle-code-change"},
          ]
          return [{...state, focusIdx: prevFocusIdx, codeCompleted: false}, effects]
        }

        default: {
          if (state.isKeyAllowed(action.key)) {
            const nextFocusIdx = getNextFocusIdx(state.focusIdx, state.codeLength)
            const effects: Effect[] = [
              {type: "set-input-val", idx: state.focusIdx, val: action.key},
              {type: "resolve-key", idx: state.focusIdx, key: action.key},
              {type: "focus-input", idx: nextFocusIdx},
              {type: "handle-code-change"},
            ]
            return [{...state, focusIdx: nextFocusIdx}, effects]
          }

          const effects: Effect[] = [{type: "reject-key", idx: state.focusIdx, key: action.key}]
          return [state, effects]
        }
      }
    }

    case "focus-input":
      return [{...state, focusIdx: action.idx}, NO_EFFECT]

    case "mark-code-as-completed":
      return [{...state, codeCompleted: true}, NO_EFFECT]

    default:
      return [state, NO_EFFECT]
  }
}

const PinField: FC<Props> = props => {
  const {
    autoFocus,
    className,
    length: codeLength,
    validate,
    format,
    onResolveKey: handleResolveKey,
    onRejectKey: handleRejectKey,
    onChange: handleChange,
    onComplete: handleComplete,
    style,
    ...inputProps
  } = {...defaultProps, ...props}

  const refs = useRef<HTMLInputElement[]>([])
  const idxs = [...Array(codeLength)].map((_, i) => i)
  const defaultState: State = {
    focusIdx: 0,
    codeCompleted: false,
    codeLength,
    isKeyAllowed: isKeyAllowed(validate),
  }

  const notify = useCallback(
    (eff: Effect, state: State, dispatch: Dispatch<Action>) => {
      switch (eff.type) {
        case "focus-input":
          refs.current[eff.idx].focus()
          break

        case "set-input-val": {
          const val = format(eff.val)
          refs.current[eff.idx].value = format(val)
          if (val === "") refs.current[eff.idx].classList.remove("react-pin-field__input--success")
          break
        }

        case "resolve-key":
          refs.current[eff.idx].classList.remove("react-pin-field__input--error")
          refs.current[eff.idx].classList.add("react-pin-field__input--success")
          handleResolveKey(eff.key, refs.current[eff.idx])
          break

        case "reject-key":
          refs.current[eff.idx].value = ""
          refs.current[eff.idx].classList.remove("react-pin-field__input--success")
          refs.current[eff.idx].classList.add("react-pin-field__input--error")
          handleRejectKey(eff.key, refs.current[eff.idx])
          break

        case "handle-code-change": {
          const code = refs.current.map(r => r.value.trim()).join("")
          handleChange(code)
          if (!state.codeCompleted && code.length === codeLength) {
            handleComplete(code)
            dispatch({type: "mark-code-as-completed"})
          }
          break
        }

        default:
          break
      }
    },
    [codeLength, format, handleChange, handleComplete, handleRejectKey, handleResolveKey],
  )

  const dispatch = useMVU(defaultState, apply, notify)

  function handleFocus(idx: number) {
    return () => dispatch({type: "focus-input", idx})
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (!IGNORED_META_KEYS.includes(evt.key) && !evt.altKey && !evt.ctrlKey) {
      evt.preventDefault()
      dispatch({type: "handle-key-down", key: evt.key})
    }
  }

  return (
    <>
      {idxs.map(idx => (
        <input
          type="text"
          {...inputProps}
          key={idx}
          ref={ref => ref && (refs.current[idx] = ref)}
          className={classNames("react-pin-field__input", className)}
          autoFocus={idx === 0 && autoFocus}
          maxLength={1}
          onFocus={handleFocus(idx)}
          onKeyDown={handleKeyDown}
          style={style}
        />
      ))}
    </>
  )
}

export default PinField
