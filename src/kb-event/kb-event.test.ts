import {getKeyFromKeyboardEvent, getKeyFromInputEvent} from "./kb-event";

test("getKeyFromKeyboardEvent", () => {
  const cases = [
    [{}, "Unidentified"],
    [{key: "a"}, "a"],
    [{which: 65, shiftKey: 0}, "a"],
    [{keyCode: 65, shiftKey: 1}, "A"],
  ];

  cases.forEach(([opts, expected]) => {
    const evt = new KeyboardEvent("keydown", opts);
    expect(getKeyFromKeyboardEvent(evt)).toEqual(expected);
  });
});

test("getKeyFromInputEvent", () => {
  const cases = [
    [{}, "Unidentified"],
    [{data: "a"}, "a"],
  ];

  cases.forEach(([evt, expected]) => {
    expect(getKeyFromInputEvent(evt as InputEvent)).toEqual(expected);
  });
});
