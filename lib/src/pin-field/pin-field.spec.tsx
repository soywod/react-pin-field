import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";

import PinField from "./pin-field";

const TEST_ID = "test";

test("structure", async () => {
  render(<PinField data-testid={TEST_ID} />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  expect(inputs).toHaveLength(5);
  inputs.forEach(input => {
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("inputmode")).toBe("text");
    expect(input.getAttribute("autocapitalize")).toBe("off");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("autocomplete")).toBe("off");
  });
});

test("ref as object", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []};
  render(<PinField ref={ref} />);

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("ref as func", () => {
  const ref: {current: HTMLInputElement[] | null} = {current: []};
  render(<PinField ref={el => (ref.current = el)} />);

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("autoFocus", async () => {
  render(<PinField data-testid={TEST_ID} autoFocus />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  inputs.forEach((input, idx) => {
    if (idx === 0) {
      expect(input).toHaveFocus();
    } else {
      expect(input).not.toHaveFocus();
    }
  });
});

test("className", async () => {
  render(<PinField data-testid={TEST_ID} className="custom-class-name" />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  inputs.forEach(input => {
    expect(input.className).toBe("custom-class-name");
  });
});

test("style", async () => {
  render(<PinField data-testid={TEST_ID} style={{position: "absolute"}} />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  inputs.forEach(input => {
    expect(input.style.position).toBe("absolute");
  });
});

test("events", async () => {
  const handleChangeMock = jest.fn();
  const handleCompleteMock = jest.fn();
  render(<PinField data-testid={TEST_ID} length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  fireEvent.focus(inputs[0]);
  fireEvent.keyDown(inputs[0], {key: "Alt", target: inputs[0]});
  fireEvent.keyDown(inputs[0], {key: "a", target: inputs[0]});
  fireEvent.keyDown(inputs[1], {which: 66, target: inputs[1]});
  fireEvent.paste(inputs[1], {clipboardData: {getData: () => "cde"}});

  expect(handleChangeMock).toHaveBeenCalledTimes(3);
  expect(handleCompleteMock).toHaveBeenCalledTimes(1);
  expect(handleCompleteMock).toHaveBeenCalledWith("abcd");
});

test("fallback events", async () => {
  const handleChangeMock = jest.fn();
  const handleCompleteMock = jest.fn();
  render(<PinField data-testid={TEST_ID} length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);
  const inputs = await screen.findAllByTestId(TEST_ID);

  fireEvent.focus(inputs[0]);
  fireEvent.keyDown(inputs[0], {key: "Unidentified", target: {value: ""}});
  fireEvent.keyUp(inputs[0], {target: {value: "a"}});

  expect(handleChangeMock).toHaveBeenCalledTimes(1);
  expect(handleChangeMock).toHaveBeenCalledWith("a");
});
