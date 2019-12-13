import React, {FC, useCallback, useEffect, useRef, useState} from "react"

const NOOP = () => {}
const KEY_CODE_BACKSPACE = 8
const KEY_CODE_TAB = 9
const KEY_CODE_ENTER = 13
const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

type KeyCode = number
type KeyCodeStack = KeyCode[]

type PinFieldProps = {
  allowedChars: string
  autoFocus: boolean
  length: number
  onChange: (code: string) => void
  onComplete: (code: string) => void
  uppercase: boolean
}

const defaultProps: PinFieldProps = {
  allowedChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  autoFocus: false,
  length: 5,
  onChange: NOOP,
  onComplete: NOOP,
  uppercase: true,
}

const PinField: FC<Partial<PinFieldProps>> = userProps => {
  const props: PinFieldProps = Object.assign(defaultProps, userProps)
  const idxs = [...Array(props.length)].map((_, i) => i)
  const refs = useRef<HTMLInputElement[]>([])
  const allowedKeyCodes: number[] = props.allowedChars.split("").map(c => c.charCodeAt(0))

  const [focusIdx, setFocusIdx] = useState(0)
  const [stack, setStack] = useState<KeyCodeStack>([])
  const [complete, setComplete] = useState(false)

  const focusPrev = useCallback(() => {
    const nextFocusIdx = Math.max(0, focusIdx - 1)
    setFocusIdx(nextFocusIdx)
    refs.current[nextFocusIdx].focus()
  }, [focusIdx])

  const focusNext = useCallback(() => {
    const nextFocusIdx = Math.min(focusIdx + 1, props.length - 1)
    setFocusIdx(nextFocusIdx)
    refs.current[nextFocusIdx].focus()
  }, [focusIdx, props.length])

  useEffect(() => {
    const keyCode = stack.pop()

    if (keyCode) {
      refs.current[focusIdx].value = String.fromCharCode(keyCode)
      let code = refs.current.map(r => r.value.trim()).join("")
      if (props.uppercase) code = code.toUpperCase()
      setStack([...stack])
      focusNext()

      props.onChange(code)

      if (!complete && code.length === props.length) {
        props.onComplete(code)
        setComplete(true)
      }
    }
  }, [complete, focusIdx, focusNext, props, stack])

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (evt.keyCode === KEY_CODE_TAB) return
    if (evt.keyCode === KEY_CODE_ENTER) return
    if (evt.keyCode === KEY_CODE_LEFT) {
      focusPrev()
    } else if (evt.keyCode === KEY_CODE_RIGHT) {
      focusNext()
    } else if (evt.keyCode === KEY_CODE_BACKSPACE) {
      const prevValue = refs.current[focusIdx].value.trim()
      refs.current[focusIdx].value = ""
      if (prevValue === "") focusPrev()
      setComplete(false)
    } else if (!allowedKeyCodes.includes(evt.keyCode)) {
      evt.preventDefault()
    } else {
      setStack([...stack, evt.keyCode])
    }
  }

  const setRef = useCallback((ref: HTMLInputElement) => refs.current.push(ref), [])
  const handleFocus = useCallback((idx: number) => () => setFocusIdx(idx), [])

  return (
    <div className="react-pin-field__container">
      {idxs.map(idx => (
        <input
          autoFocus={idx === 0 && props.autoFocus}
          key={idx}
          ref={setRef}
          className="react-pin-field__input"
          type="text"
          maxLength={1}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus(idx)}
        />
      ))}
    </div>
  )
}

export default PinField
