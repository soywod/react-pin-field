import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import classNames from "classnames"

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
type PinFieldProps = {
  allowedChars: string | RegExp
  className: string
  length: number
  onChange: (code: string) => void
  onComplete: (code: string) => void
  onReceiveKey: (key: string) => string
  style: React.CSSProperties
}

const defaultProps: PinFieldProps = {
  allowedChars: /^[a-zA-Z0-9]$/,
  className: "",
  length: 5,
  onChange: () => {},
  onComplete: () => {},
  onReceiveKey: (key: string) => key,
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
    onReceiveKey: formatKey,
    style,
    ...inputProps
  } = {...defaultProps, ...props}

  const idxs = [...Array(length)].map((_, i) => i)
  const refs = useRef<HTMLInputElement[]>([])

  const [focusIdx, setFocusIdx] = useState(0)
  const [keyStack, setKeyStack] = useState<string[]>([])
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

  const isKeyAllowed = useCallback(
    (key?: string) => {
      if (!key) return false
      if (key.length > 1) return false

      if (typeof allowedChars === "string") {
        return allowedChars.split("").includes(key)
      }

      if (allowedChars instanceof RegExp) {
        return allowedChars.test(key)
      }

      return false
    },
    [allowedChars],
  )

  const setRef = useCallback((ref: HTMLInputElement) => refs.current.push(ref), [])
  const handleFocus = useCallback((idx: number) => () => setFocusIdx(idx), [])

  useEffect(() => {
    if (keyStack.length === 0) return

    const key = keyStack.pop()
    switch (key) {
      case undefined:
      case "Unidentified":
      case "Dead":
        refs.current[focusIdx].value = ""
        break

      case "ArrowLeft":
        focusPrev()
        break

      case "ArrowRight":
        focusNext()
        break

      case "Backspace": {
        refs.current[focusIdx].value = ""
        focusPrev()
        setComplete(false)
        break
      }

      default:
        if (isKeyAllowed(key)) {
          refs.current[focusIdx].value = formatKey(key)
          focusNext()
        }
    }

    const code = refs.current.map(r => r.value.trim()).join("")
    setKeyStack([...keyStack])
    handleChange(code)

    if (!complete && code.length === length) {
      handleComplete(code)
      setComplete(true)
    }
  }, [
    complete,
    focusIdx,
    focusNext,
    focusPrev,
    formatKey,
    handleChange,
    handleComplete,
    isKeyAllowed,
    keyStack,
    length,
  ])

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (!["Tab", "Enter"].includes(evt.key)) {
      evt.preventDefault()
      setKeyStack([...keyStack, evt.key])
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
          className={classNames("react-pin-field__input", className)}
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
