import { getKeyFromKeyboardEvent } from ".";

describe("keyboard-evt", () => {
  test("getKey", () => {
    const cases: Array<[KeyboardEventInit, string]> = [
      [{}, "Unidentified"],
      [{ key: "a" }, "a"],
      [{ which: 65, shiftKey: false }, "a"],
      [{ keyCode: 65, shiftKey: true }, "A"],
    ];

    cases.forEach(([opts, expected]) => {
      const evt = new KeyboardEvent("keydown", opts);
      expect(getKeyFromKeyboardEvent(evt)).toEqual(expected);
    });
  });
});
