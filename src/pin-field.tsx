import React, {FC, useCallback, useRef} from "react"
import classNames from "classnames"
import noop from "lodash/fp/noop"
import omit from "lodash/fp/omit"
import range from "lodash/fp/range"

import useMVU from "./mvu"

import {
  PinFieldDefaultProps as DefaultProps,
  PinFieldInputProps as InputProps,
  PinFieldProps as Props,
  PinFieldNotifierProps as NotifierProps,
  PinFieldState as State,
  PinFieldAction as Action,
  PinFieldEffect as Effect,
} from "./pin-field.types"

export const NO_EFFECT: Effect[] = []
export const PROP_KEYS = ["autoFocus", "className", "length", "validate", "format", "style"]
export const HANDLER_KEYS = ["onResolveKey", "onRejectKey", "onChange", "onComplete"]
export const IGNORED_META_KEYS = ["Alt", "Control", "Enter", "Meta", "Shift", "Tab"]

export const defaultProps: DefaultProps = {
  className: "",
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  onResolveKey: noop,
  onRejectKey: noop,
  onChange: noop,
  onComplete: noop,
  style: {},
}

export function defaultState(props: Pick<DefaultProps, "validate" | "length">): State {
  return {
    focusIdx: 0,
    codeCompleted: false,
    codeLength: props.length,
    isKeyAllowed: isKeyAllowed(props.validate),
  }
}

export function getPrevFocusIdx(currFocusIdx: number) {
  return Math.max(0, currFocusIdx - 1)
}

export function getNextFocusIdx(currFocusIdx: number, lastFocusIdx: number) {
  if (lastFocusIdx === 0) return 0
  return Math.min(currFocusIdx + 1, lastFocusIdx - 1)
}

export function isKeyAllowed(predicate: DefaultProps["validate"]) {
  return (key: string) => {
    if (!key) return false
    if (key.length > 1) return false
    if (typeof predicate === "string") return predicate.split("").includes(key)
    if (predicate instanceof Array) return predicate.includes(key)
    if (predicate instanceof RegExp) return predicate.test(key)
    return predicate(key)
  }
}

export function apply(state: State, action: Action): [State, Effect[]] {
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
          const effects: Effect[] = [
            {type: "handle-backspace", idx: state.focusIdx},
            {type: "handle-code-change"},
          ]
          return [state, effects]
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

    case "handle-paste": {
      if (!action.val.split("").every(state.isKeyAllowed)) return [state, NO_EFFECT]
      const pasteLen = Math.min(action.val.length, state.codeLength - state.focusIdx)
      const nextFocusIdx = getNextFocusIdx(pasteLen + state.focusIdx - 1, state.codeLength)
      const effects: Effect[] = range(0, pasteLen).map(idx => ({
        type: "set-input-val",
        idx: idx + state.focusIdx,
        val: action.val[idx],
      }))

      effects.push({type: "focus-input", idx: nextFocusIdx})
      effects.push({type: "handle-code-change"})

      return [{...state, focusIdx: nextFocusIdx}, effects]
    }

    case "focus-input":
      return [{...state, focusIdx: action.idx}, NO_EFFECT]

    case "mark-code-as-completed":
      return [{...state, codeCompleted: true}, NO_EFFECT]

    default:
      return [state, NO_EFFECT]
  }
}

// TODO: unit tests
export function useNotifier({refs, ...props}: NotifierProps) {
  return useCallback(
    (eff: Effect, state: State, dispatch: React.Dispatch<Action>) => {
      switch (eff.type) {
        case "focus-input":
          refs.current[eff.idx].focus()
          break

        case "set-input-val": {
          const val = props.format(eff.val)
          refs.current[eff.idx].value = val
          if (val === "") refs.current[eff.idx].classList.remove("react-pin-field__input--success")
          break
        }

        case "resolve-key":
          refs.current[eff.idx].classList.remove("react-pin-field__input--error")
          refs.current[eff.idx].classList.add("react-pin-field__input--success")
          props.onResolveKey(eff.key, refs.current[eff.idx])
          break

        case "reject-key":
          refs.current[eff.idx].value = ""
          refs.current[eff.idx].classList.remove("react-pin-field__input--success")
          refs.current[eff.idx].classList.add("react-pin-field__input--error")
          props.onRejectKey(eff.key, refs.current[eff.idx])
          break

        case "handle-backspace": {
          const prevVal = refs.current[eff.idx].value
          refs.current[eff.idx].classList.remove("react-pin-field__input--success")
          refs.current[eff.idx].value = ""

          if (!prevVal) {
            const prevIdx = getPrevFocusIdx(eff.idx)
            refs.current[prevIdx].focus()
            refs.current[prevIdx].classList.remove("react-pin-field__input--success")
            refs.current[prevIdx].value = ""
          }
          break
        }

        case "handle-code-change": {
          const code = refs.current.map(r => r.value.trim()).join("")
          props.onChange(code)
          if (!state.codeCompleted && code.length === props.length) {
            props.onComplete(code)
            dispatch({type: "mark-code-as-completed"})
          }
          break
        }

        default:
          break
      }
    },
    [props, refs],
  )
}

const PinField: FC<Props> = userProps => {
  const props: DefaultProps & InputProps = {...defaultProps, ...userProps}
  const {autoFocus, className, length: codeLength, style} = props
  const inputProps: InputProps = omit([...PROP_KEYS, ...HANDLER_KEYS], props)
  const refs = useRef<HTMLInputElement[]>([])
  const model = defaultState(props)
  const notify = useNotifier({refs, ...props})
  const dispatch = useMVU(model, apply, notify)

  function handleFocus(idx: number) {
    return () => dispatch({type: "focus-input", idx})
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (!IGNORED_META_KEYS.includes(evt.key) && !evt.altKey && !evt.ctrlKey) {
      evt.preventDefault()
      dispatch({type: "handle-key-down", key: evt.key})
    }
  }

  function handlePaste(evt: React.ClipboardEvent<HTMLInputElement>) {
    evt.preventDefault()
    dispatch({type: "handle-paste", val: evt.clipboardData.getData("Text")})
  }

  return (
    <>
      {range(0, codeLength).map(idx => (
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
          onPaste={handlePaste}
          style={style}
        />
      ))}
    </>
  )
}

export default PinField
