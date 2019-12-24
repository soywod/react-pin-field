import * as pinField from "./pin-field"

test("constants", () => {
  const {NO_EFFECT, PROP_KEYS, HANDLER_KEYS, IGNORED_META_KEYS} = pinField

  expect(NO_EFFECT).toEqual([])
  expect(PROP_KEYS).toEqual(["autoFocus", "className", "length", "validate", "format", "style"])
  expect(HANDLER_KEYS).toEqual(["onResolveKey", "onRejectKey", "onChange", "onComplete"])
  expect(IGNORED_META_KEYS).toEqual(["Alt", "Control", "Enter", "Meta", "Shift", "Tab"])
})

test("default props", () => {
  const {defaultProps} = pinField

  expect(defaultProps).toHaveProperty("className", "")
  expect(defaultProps).toHaveProperty("length", 5)
  expect(defaultProps).toHaveProperty("validate", /^[a-zA-Z0-9]$/)
  expect(defaultProps).toHaveProperty("format")
  expect(defaultProps.format("abcABC123@-_[]")).toStrictEqual("abcABC123@-_[]")
  expect(defaultProps.onResolveKey("a")).toStrictEqual(undefined)
  expect(defaultProps).toHaveProperty("onRejectKey")
  expect(defaultProps.onRejectKey("a")).toStrictEqual(undefined)
  expect(defaultProps).toHaveProperty("onChange")
  expect(defaultProps.onChange("a")).toStrictEqual(undefined)
  expect(defaultProps).toHaveProperty("onComplete")
  expect(defaultProps.onComplete("a")).toStrictEqual(undefined)
  expect(defaultProps).toHaveProperty("style", {})
})

test("default state", () => {
  const {defaultState, defaultProps} = pinField
  const state = defaultState(defaultProps)

  expect(state).toHaveProperty("focusIdx", 0)
  expect(state).toHaveProperty("codeCompleted", false)
  expect(state).toHaveProperty("codeLength", 5)
  expect(state).toHaveProperty("isKeyAllowed")
  expect(typeof state.isKeyAllowed).toStrictEqual("function")
  expect(state.isKeyAllowed("a")).toStrictEqual(true)
  expect(state.isKeyAllowed("@")).toStrictEqual(false)
})

test("get previous focus index", () => {
  const {getPrevFocusIdx} = pinField

  expect(getPrevFocusIdx(5)).toStrictEqual(4)
  expect(getPrevFocusIdx(1)).toStrictEqual(0)
  expect(getPrevFocusIdx(0)).toStrictEqual(0)
  expect(getPrevFocusIdx(-1)).toStrictEqual(0)
})

test("get next focus index", () => {
  const {getNextFocusIdx} = pinField

  expect(getNextFocusIdx(0, 0)).toStrictEqual(0)
  expect(getNextFocusIdx(0, 1)).toStrictEqual(0)
  expect(getNextFocusIdx(1, 1)).toStrictEqual(0)
  expect(getNextFocusIdx(0, 2)).toStrictEqual(1)
  expect(getNextFocusIdx(3, 5)).toStrictEqual(4)
  expect(getNextFocusIdx(5, 3)).toStrictEqual(2)
})

test("is key allowed", () => {
  const {isKeyAllowed} = pinField

  const str = isKeyAllowed("a")
  expect(str("a")).toStrictEqual(true)
  expect(str("b")).toStrictEqual(false)
  expect(str("ab")).toStrictEqual(false)

  const arr = isKeyAllowed(["a", "b"])
  expect(arr("a")).toStrictEqual(true)
  expect(arr("a")).toStrictEqual(true)
  expect(arr("b")).toStrictEqual(true)
  expect(arr("ab")).toStrictEqual(false)

  const exp = isKeyAllowed(/^[ab]$/)
  expect(exp("a")).toStrictEqual(true)
  expect(exp("b")).toStrictEqual(true)
  expect(exp("ab")).toStrictEqual(false)

  const func = isKeyAllowed(k => k === "a" || k === "b")
  expect(func("a")).toStrictEqual(true)
  expect(func("b")).toStrictEqual(true)
  expect(func("ab")).toStrictEqual(false)
})
