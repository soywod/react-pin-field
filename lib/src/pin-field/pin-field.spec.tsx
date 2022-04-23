import React from "react";
import enzyme, {shallow, mount} from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import PinField from "./pin-field";
import {noop} from "../utils";

enzyme.configure({adapter: new Adapter()});

jest.spyOn(console, "debug").mockImplementation(noop);

test("structure", () => {
  const wrapper = shallow(<PinField />);
  const inputs = wrapper.find("input");

  expect(inputs).toHaveLength(5);
  inputs.forEach(input => {
    expect(input.prop("type")).toBe("text");
    expect(input.prop("autoFocus")).toBe(false);
    expect(typeof input.prop("onFocus")).toBe("function");
    expect(typeof input.prop("onKeyDown")).toBe("function");
    expect(typeof input.prop("onPaste")).toBe("function");
    expect(input.prop("maxLength")).toBe(1);
  });
});

test("ref as object", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []};
  mount(<PinField ref={ref} />);

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("ref as func", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []};
  mount(<PinField ref={el => (ref.current = el)} />);

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("autoFocus", () => {
  const wrapper = shallow(<PinField autoFocus />);
  const inputs = wrapper.find("input");

  inputs.forEach((input, idx) => {
    expect(input.prop("autoFocus")).toBe(idx === 0);
  });
});

test("className", () => {
  const wrapper = shallow(<PinField className="custom-class-name" />);
  const inputs = wrapper.find("input");

  inputs.forEach(input => {
    expect(input.hasClass("custom-class-name")).toBe(true);
  });
});

test("style", () => {
  const wrapper = shallow(<PinField style={{position: "relative"}} />);
  const inputs = wrapper.find("input");

  inputs.forEach(input => {
    expect(input.prop("style")).toEqual({position: "relative"});
  });
});

test("events", () => {
  const handleChangeMock = jest.fn();
  const handleCompleteMock = jest.fn();
  const wrapper = mount(<PinField length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);
  const input = wrapper.find("input").first();

  input.simulate("focus");
  input.simulate("keydown", {
    preventDefault: noop,
    nativeEvent: {key: "Alt", target: document.createElement("input")},
  });
  input.simulate("keydown", {
    preventDefault: noop,
    nativeEvent: {key: "a", target: document.createElement("input")},
  });
  input.simulate("keydown", {
    preventDefault: noop,
    nativeEvent: {which: 66, target: document.createElement("input")},
  });
  input.simulate("paste", {clipboardData: {getData: () => "cde"}});

  expect(handleChangeMock).toHaveBeenCalledTimes(3);
  expect(handleCompleteMock).toHaveBeenCalledTimes(1);
  expect(handleCompleteMock).toHaveBeenCalledWith("abcd");
});

test("fallback events", () => {
  const handleChangeMock = jest.fn();
  const handleCompleteMock = jest.fn();
  const wrapper = mount(<PinField length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);
  const input = wrapper.find("input").first();

  const keyDownInputMock = document.createElement("input");
  keyDownInputMock.value = "";
  const keyUpInputMock = document.createElement("input");
  keyUpInputMock.value = "a";

  input.simulate("focus");
  input.simulate("keydown", {
    preventDefault: noop,
    nativeEvent: {key: "Unidentified", target: keyDownInputMock},
  });
  input.simulate("keyup", {
    preventDefault: noop,
    nativeEvent: {target: keyUpInputMock},
  });
  input.simulate("keydown", {
    preventDefault: noop,
    nativeEvent: {key: "Unidentified", target: keyDownInputMock},
  });
  input.simulate("keyup", {
    preventDefault: noop,
    nativeEvent: {target: {value: "b"}},
  });
  expect(handleChangeMock).toHaveBeenCalledTimes(1);
  expect(handleChangeMock).toHaveBeenCalledWith("a");
});
