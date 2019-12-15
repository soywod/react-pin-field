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

  const setRef = useCallback((ref: HTMLInputElement) => refs.current.push(ref), [])
  const handleFocus = useCallback((idx: number) => () => setFocusIdx(idx), [])

  useEffect(() => {
    const key = keyStack.pop()
    if (!key) return

    if (key  == 'Unidentified') {
      refs.current[focusIdx].value = ''
      return
    }

    refs.current[focusIdx].value = formatKey(key)
    const code = refs.current.map(r => r.value.trim()).join("")
    setKeyStack([...keyStack])
    handleChange(code)
    focusNext()

    if (!complete && code.length === length) {
      handleComplete(code)
      setComplete(true)
    }
  }, [handleChange, handleComplete, complete, focusIdx, focusNext, length, keyStack, formatKey])

  function isKeyAllowed(key: string) {
    if (typeof allowedChars === "string") {
      return allowedChars.split("").includes(key)
    }

    if (allowedChars instanceof RegExp) {
      return allowedChars.test(key)
    }

    return false
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    switch (evt.key) {
      case "Tab":
      case "Enter":
        break

      case "ArrowLeft":
        focusPrev()
        break

      case "ArrowRight":
        focusNext()
        break

      case "Backspace": {
        const prevValue = refs.current[focusIdx].value.trim()
        refs.current[focusIdx].value = ""
        if (prevValue === "") focusPrev()
        setComplete(false)
        break
      }

      default: {
        if (isKeyAllowed(evt.key)) {
          setKeyStack([...keyStack, evt.key])
        } else if (evt.key == 'Unidentified') {
          setKeyStack([...keyStack, evt.key])
        } else  {
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
