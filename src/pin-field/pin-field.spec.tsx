import React from "react"
import {shallow, mount} from "enzyme"
import noop from "lodash/fp/noop"

import PinField from "./pin-field"

test("structure", () => {
  const wrapper = shallow(<PinField />)
  const inputs = wrapper.find("input")

  expect(inputs).toHaveLength(5)
  inputs.forEach((input, idx) => {
    expect(input.prop("type")).toBe("text")
    expect(input.hasClass("a-reactPinField__input")).toBe(true)
    expect(input.hasClass(`-${idx}`)).toBe(true)
    expect(input.prop("autoFocus")).toBe(false)
    expect(typeof input.prop("onFocus")).toBe("function")
    expect(typeof input.prop("onKeyDown")).toBe("function")
    expect(typeof input.prop("onPaste")).toBe("function")
    expect(input.prop("maxLength")).toBe(1)
    expect(input.prop("style")).toEqual({})
  })
})

test("ref as object", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []}
  mount(<PinField ref={ref} />)

  expect(Array.isArray(ref.current)).toBe(true)
  expect(ref.current).toHaveLength(5)
})

test("ref as func", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []}
  mount(<PinField ref={el => (ref.current = el)} />)

  expect(Array.isArray(ref.current)).toBe(true)
  expect(ref.current).toHaveLength(5)
})

test("autoFocus", () => {
  const wrapper = shallow(<PinField autoFocus />)
  const inputs = wrapper.find("input")

  inputs.forEach((input, idx) => {
    expect(input.prop("autoFocus")).toBe(idx === 0)
    expect(input.hasClass("-focus")).toBe(idx === 0)
  })
})

test("className", () => {
  const wrapper = shallow(<PinField className="custom-class-name" />)
  const inputs = wrapper.find("input")

  inputs.forEach(input => {
    expect(input.hasClass("a-reactPinField__input")).toBe(true)
    expect(input.hasClass("custom-class-name")).toBe(true)
  })
})

test("style", () => {
  const wrapper = shallow(<PinField style={{position: "relative"}} />)
  const inputs = wrapper.find("input")

  inputs.forEach(input => {
    expect(input.prop("style")).toEqual({position: "relative"})
  })
})

test("events", () => {
  const handleChangeMock = jest.fn()
  const handleCompleteMock = jest.fn()
  const wrapper = mount(
    <PinField length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />,
  )
  const input = wrapper.find("input").first()

  input.simulate("focus")
  input.simulate("keydown", {preventDefault: noop, nativeEvent: {key: "a"}})
  input.simulate("keydown", {preventDefault: noop, nativeEvent: {which: 66}})
  input.simulate("input", {preventDefault: noop, nativeEvent: {data: "c"}})
  input.simulate("paste", {clipboardData: {getData: () => "d"}})

  expect(handleChangeMock).toHaveBeenCalledTimes(4)
  expect(handleCompleteMock).toHaveBeenCalledTimes(1)
  expect(handleCompleteMock).toHaveBeenCalledWith("abcd")
})
