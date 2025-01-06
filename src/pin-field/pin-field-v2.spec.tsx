import "@testing-library/jest-dom";

import { RefObject } from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";

import PinField from "./pin-field-v2";

test("default", async () => {
  render(<PinField />);

  const inputs = await screen.findAllByRole("textbox");
  expect(inputs).toHaveLength(5);

  inputs.forEach(input => {
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("inputmode")).toBe("text");
    expect(input.getAttribute("autocapitalize")).toBe("off");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("autocomplete")).toBe("off");
  });
});

test("forward ref as object", () => {
  const ref: RefObject<HTMLInputElement[]> = { current: [] };
  render(<PinField ref={ref} />);

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("forward ref as func", () => {
  const ref: RefObject<HTMLInputElement[]> = { current: [] };
  render(
    <PinField
      ref={el => {
        if (el) {
          ref.current = el;
        }
      }}
    />,
  );

  expect(Array.isArray(ref.current)).toBe(true);
  expect(ref.current).toHaveLength(5);
});

test("className", async () => {
  render(<PinField className="custom-class-name" />);
  const inputs = await screen.findAllByRole("textbox");

  inputs.forEach(input => {
    expect(input.className).toBe("custom-class-name");
  });
});

test("style", async () => {
  render(<PinField style={{ position: "absolute" }} />);
  const inputs = await screen.findAllByRole("textbox");

  inputs.forEach(input => {
    expect(input.style.position).toBe("absolute");
  });
});

test("autoFocus", async () => {
  render(<PinField autoFocus />);
  const inputs = await screen.findAllByRole("textbox");

  inputs.forEach((input, index) => {
    if (index === 0) {
      expect(input).toHaveFocus();
    } else {
      expect(input).not.toHaveFocus();
    }
  });
});

test("autoFocus rtl", async () => {
  render(<PinField autoFocus dir="rtl" />);
  const inputs = await screen.findAllByRole("textbox");

  inputs.forEach((input, index) => {
    if (index === 4) {
      expect(input).toHaveFocus();
    } else {
      expect(input).not.toHaveFocus();
    }
  });
});

describe("events", () => {
  test("change single input", async () => {
    const handleChangeMock = jest.fn();
    const handleCompleteMock = jest.fn();
    render(<PinField length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];

    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(handleChangeMock).toHaveBeenCalledWith("a");
    expect(inputs[0].value).toBe("a");

    fireEvent.change(inputs[1], { target: { value: "b" } });
    expect(handleChangeMock).toHaveBeenCalledWith("ab");
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("b");

    fireEvent.change(inputs[2], { target: { value: "c" } });
    expect(handleChangeMock).toHaveBeenCalledWith("abc");
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("b");
    expect(inputs[2].value).toBe("c");

    fireEvent.change(inputs[3], { target: { value: "d" } });
    expect(handleChangeMock).toHaveBeenCalledWith("abcd");
    expect(handleCompleteMock).toHaveBeenCalledWith("abcd");
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("b");
    expect(inputs[2].value).toBe("c");
    expect(inputs[3].value).toBe("d");
  });

  test("change multi input", async () => {
    const handleChangeMock = jest.fn();
    const handleCompleteMock = jest.fn();
    render(<PinField length={4} onChange={handleChangeMock} onComplete={handleCompleteMock} />);

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];

    fireEvent.change(inputs[0], { target: { value: "abc" } });
    expect(handleChangeMock).toHaveBeenLastCalledWith("abc");
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("b");
    expect(inputs[2].value).toBe("c");

    fireEvent.change(inputs[1], { target: { value: "def" } });
    expect(handleChangeMock).toHaveBeenLastCalledWith("adef");
    expect(handleCompleteMock).toHaveBeenCalledWith("adef");
    expect(inputs[0].value).toBe("a");
    expect(inputs[1].value).toBe("d");
    expect(inputs[2].value).toBe("e");
    expect(inputs[3].value).toBe("f");
  });
});

describe("a11y", () => {
  test("default aria-label", () => {
    render(<PinField length={3} />);

    expect(screen.getByRole("textbox", { name: "PIN field 1 of 3" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "PIN field 2 of 3" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "PIN field 3 of 3" })).toBeVisible();
  });

  test("aria-required", () => {
    render(<PinField length={3} formatAriaLabel={i => `${i}`} required />);

    expect(screen.getByRole("textbox", { name: "1" })).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("textbox", { name: "2" })).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("textbox", { name: "3" })).toHaveAttribute("aria-required", "true");
  });

  test("aria-disabled", () => {
    render(<PinField length={3} formatAriaLabel={i => `${i}`} disabled />);

    expect(screen.getByRole("textbox", { name: "1" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("textbox", { name: "2" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("textbox", { name: "3" })).toHaveAttribute("aria-disabled", "true");
  });

  test("aria-readonly", () => {
    render(<PinField length={3} formatAriaLabel={i => `${i}`} readOnly />);

    expect(screen.getByRole("textbox", { name: "1" })).toHaveAttribute("aria-readonly", "true");
    expect(screen.getByRole("textbox", { name: "2" })).toHaveAttribute("aria-readonly", "true");
    expect(screen.getByRole("textbox", { name: "3" })).toHaveAttribute("aria-readonly", "true");
  });
});
