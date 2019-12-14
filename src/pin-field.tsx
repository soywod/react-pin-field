import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import classNames from "classnames"

const NOOP = () => {}

type KeyCode = number
type KeyCodeStack = KeyCode[]

const KEY_CODE_BACKSPACE: KeyCode = 8
const KEY_CODE_TAB: KeyCode = 9
const KEY_CODE_ENTER: KeyCode = 13
const KEY_CODE_LEFT: KeyCode = 37
const KEY_CODE_RIGHT: KeyCode = 39

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
type PinFieldProps = {
  allowedChars: string
  className: string
  length: number
  onChange: (code: string) => void
  onComplete: (code: string) => void
  style: React.CSSProperties
}

const defaultProps: PinFieldProps = {
  allowedChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  className: "",
  length: 5,
  onChange: NOOP,
  onComplete: NOOP,
  style: {},
}

const PinField: FC<Partial<PinFieldProps & InputProps>> = props => {
  const {
    allowedChars,
    autoFocus,
    className,
    length,
    onChange: handleChange,
    onComplete: handleComplete,
    style,
    ...inputProps
  } = {...defaultProps, ...props}

  const idxs = [...Array(length)].map((_, i) => i)
  const refs = useRef<HTMLInputElement[]>([])
  const allowedKeyCodes: number[] = allowedChars.split("").map(c => c.toUpperCase().charCodeAt(0))

  const [focusIdx, setFocusIdx] = useState(0)
  const [stack, setStack] = useState<KeyCodeStack>([])
  const [complete, setComplete] = useState(false)

  const focusPrev = useCallback(() => {
    const nextFocusIdx = Math.max(0, focusIdx - 1)
    setFocusIdx(nextFocusIdx)
    refs.current[nextFocusIdx].focus()
  }, [focusIdx])

  const focusNext = useCallback(() => {
    const nextFocusIdx = Math.min(focusIdx + 1, length - 1)
    setFocusIdx(nextFocusIdx)
    refs.current[nextFocusIdx].focus()
  }, [focusIdx, length])

  const setRef = useCallback((ref: HTMLInputElement) => refs.current.push(ref), [])
  const handleFocus = useCallback((idx: number) => () => setFocusIdx(idx), [])

  useEffect(() => {
    const keyCode = stack.pop()
    if (!keyCode) return

    refs.current[focusIdx].value = String.fromCharCode(keyCode)
    const code = refs.current
      .map(r => r.value.trim())
      .join("")
      .toUpperCase()

    setStack([...stack])
    handleChange(code)
    focusNext()

    if (!complete && code.length === length) {
      handleComplete(code)
      setComplete(true)
    }
  }, [handleChange, handleComplete, complete, focusIdx, focusNext, length, stack])

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    switch (evt.keyCode) {
      case KEY_CODE_TAB:
      case KEY_CODE_ENTER:
        break

      case KEY_CODE_LEFT:
        focusPrev()
        break

      case KEY_CODE_RIGHT:
        focusNext()
        break

      case KEY_CODE_BACKSPACE: {
        const prevValue = refs.current[focusIdx].value.trim()
        refs.current[focusIdx].value = ""
        if (prevValue === "") focusPrev()
        setComplete(false)
        break
      }

      default: {
        if (allowedKeyCodes.includes(evt.keyCode)) {
          setStack([...stack, evt.keyCode])
        } else {
          evt.preventDefault()
        }
      }
    }
  }

  return (
    <>
      {idxs.map(idx => (
        <input
          type="text"
          {...inputProps}
          key={idx}
          ref={setRef}
          className={classNames("react-pin-field", className)}
          autoFocus={idx === 0 && autoFocus}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus(idx)}
          style={style}
          maxLength={1}
        />
      ))}
    </>
  )
}

export default PinField
