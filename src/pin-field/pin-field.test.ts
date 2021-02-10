import "react";

import * as pinField from "./pin-field";

jest.mock("react", () => ({
  useCallback: (f: any) => f,
  forwardRef: (f: any) => f,
}));

function mockInput(value: string) {
  const setValMock = jest.fn();
  const ref = {
    focus: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
    set value(val: string) {
      setValMock(val);
    },
    get value() {
      return value;
    },
  };

  return {ref, setValMock};
}

test("constants", () => {
  const {NO_EFFECT, PROP_KEYS, HANDLER_KEYS, IGNORED_META_KEYS} = pinField;

  expect(NO_EFFECT).toEqual([]);
  expect(PROP_KEYS).toEqual(["autoFocus", "className", "length", "validate", "format", "style"]);
  expect(HANDLER_KEYS).toEqual(["onResolveKey", "onRejectKey", "onChange", "onComplete"]);
  expect(IGNORED_META_KEYS).toEqual(["Alt", "Control", "Enter", "Meta", "Shift", "Tab"]);
});

test("default props", () => {
  const {defaultProps} = pinField;

  expect(defaultProps).toHaveProperty("className", "");
  expect(defaultProps).toHaveProperty("length", 5);
  expect(defaultProps).toHaveProperty("validate", /^[a-zA-Z0-9]$/);
  expect(defaultProps).toHaveProperty("format");
  expect(defaultProps.format("abcABC123@-_[]")).toStrictEqual("abcABC123@-_[]");
  expect(defaultProps.onResolveKey("a")).toStrictEqual(undefined);
  expect(defaultProps).toHaveProperty("onRejectKey");
  expect(defaultProps.onRejectKey("a")).toStrictEqual(undefined);
  expect(defaultProps).toHaveProperty("onChange");
  expect(defaultProps.onChange("a")).toStrictEqual(undefined);
  expect(defaultProps).toHaveProperty("onComplete");
  expect(defaultProps.onComplete("a")).toStrictEqual(undefined);
  expect(defaultProps).toHaveProperty("style", {});
});

test("default state", () => {
  const {defaultState, defaultProps} = pinField;
  const state = defaultState(defaultProps);

  expect(state).toHaveProperty("focusIdx", 0);
  expect(state).toHaveProperty("codeLength", 5);
  expect(state).toHaveProperty("isKeyAllowed");
  expect(typeof state.isKeyAllowed).toStrictEqual("function");
  expect(state.isKeyAllowed("a")).toStrictEqual(true);
  expect(state.isKeyAllowed("@")).toStrictEqual(false);
});

test("get previous focus index", () => {
  const {getPrevFocusIdx} = pinField;

  expect(getPrevFocusIdx(5)).toStrictEqual(4);
  expect(getPrevFocusIdx(1)).toStrictEqual(0);
  expect(getPrevFocusIdx(0)).toStrictEqual(0);
  expect(getPrevFocusIdx(-1)).toStrictEqual(0);
});

test("get next focus index", () => {
  const {getNextFocusIdx} = pinField;

  expect(getNextFocusIdx(0, 0)).toStrictEqual(0);
  expect(getNextFocusIdx(0, 1)).toStrictEqual(0);
  expect(getNextFocusIdx(1, 1)).toStrictEqual(0);
  expect(getNextFocusIdx(0, 2)).toStrictEqual(1);
  expect(getNextFocusIdx(3, 5)).toStrictEqual(4);
  expect(getNextFocusIdx(5, 3)).toStrictEqual(2);
});

describe("is key allowed", () => {
  const {isKeyAllowed} = pinField;

  test("string", () => {
    const str = isKeyAllowed("a");

    expect(str("a")).toStrictEqual(true);
    expect(str("b")).toStrictEqual(false);
    expect(str("ab")).toStrictEqual(false);
  });

  test("array", () => {
    const arr = isKeyAllowed(["a", "b"]);

    expect(arr("a")).toStrictEqual(true);
    expect(arr("a")).toStrictEqual(true);
    expect(arr("b")).toStrictEqual(true);
    expect(arr("ab")).toStrictEqual(false);
  });

  test("regex", () => {
    const exp = isKeyAllowed(/^[ab]$/);

    expect(exp("a")).toStrictEqual(true);
    expect(exp("b")).toStrictEqual(true);
    expect(exp("ab")).toStrictEqual(false);
  });

  test("function", () => {
    const func = isKeyAllowed(k => k === "a" || k === "b");

    expect(func("a")).toStrictEqual(true);
    expect(func("b")).toStrictEqual(true);
    expect(func("ab")).toStrictEqual(false);
  });
});

describe("apply", () => {
  const {NO_EFFECT, apply, defaultState, defaultProps} = pinField;
  const currState = defaultState(defaultProps);

  test("default action", () => {
    // @ts-expect-error bad action
    const [state, eff] = apply(currState, {type: "bad-action"});

    expect(state).toMatchObject(state);
    expect(eff).toEqual(NO_EFFECT);
  });

  describe("handle-key-down", () => {
    test("unidentified", () => {
      const [state, eff] = apply(currState, {type: "handle-key-down", key: "Unidentified"});

      expect(state).toMatchObject(state);
      expect(eff).toEqual([
        {type: "set-input-val", idx: 0, val: ""},
        {type: "reject-key", idx: 0, key: "Unidentified"},
        {type: "handle-code-change"},
      ]);
    });

    test("dead", () => {
      const [state, eff] = apply(currState, {type: "handle-key-down", key: "Dead"});

      expect(state).toMatchObject(state);
      expect(eff).toEqual([
        {type: "set-input-val", idx: 0, val: ""},
        {type: "reject-key", idx: 0, key: "Dead"},
        {type: "handle-code-change"},
      ]);
    });

    describe("left arrow", () => {
      test("from the first input", () => {
        const [state, eff] = apply(currState, {type: "handle-key-down", key: "ArrowLeft"});

        expect(state).toMatchObject({...state, focusIdx: 0});
        expect(eff).toEqual([{type: "focus-input", idx: 0}]);
      });

      test("from the last input", () => {
        const [state, eff] = apply({...currState, focusIdx: 4}, {type: "handle-key-down", key: "ArrowLeft"});

        expect(state).toMatchObject({...state, focusIdx: 3});
        expect(eff).toEqual([{type: "focus-input", idx: 3}]);
      });
    });

    describe("right arrow", () => {
      test("from the first input", () => {
        const [state, eff] = apply(currState, {type: "handle-key-down", key: "ArrowRight"});

        expect(state).toMatchObject({...state, focusIdx: 1});
        expect(eff).toEqual([{type: "focus-input", idx: 1}]);
      });

      test("from the last input", () => {
        const [state, eff] = apply({...currState, focusIdx: 4}, {type: "handle-key-down", key: "ArrowRight"});

        expect(state).toMatchObject({...state, focusIdx: 4});
        expect(eff).toEqual([{type: "focus-input", idx: 4}]);
      });
    });

    test("backspace", () => {
      const [state, eff] = apply(currState, {type: "handle-key-down", key: "Backspace"});

      expect(state).toMatchObject({...state, focusIdx: 0});
      expect(eff).toEqual([{type: "handle-delete", idx: 0}, {type: "handle-code-change"}]);
    });

    test("delete", () => {
      const [state, eff] = apply(currState, {type: "handle-key-down", key: "Delete"});

      expect(state).toMatchObject({...state, focusIdx: 0});
      expect(eff).toEqual([{type: "handle-delete", idx: 0}, {type: "handle-code-change"}]);
    });

    describe("default", () => {
      test("resolve", () => {
        const [state, eff] = apply(currState, {type: "handle-key-down", key: "a"});

        expect(state).toMatchObject({...state, focusIdx: 1});
        expect(eff).toEqual([
          {type: "set-input-val", idx: 0, val: "a"},
          {type: "resolve-key", idx: 0, key: "a"},
          {type: "focus-input", idx: 1},
          {type: "handle-code-change"},
        ]);
      });

      test("reject", () => {
        const [state, eff] = apply(currState, {type: "handle-key-down", key: "@"});

        expect(state).toMatchObject(state);
        expect(eff).toEqual([{type: "reject-key", idx: 0, key: "@"}]);
      });
    });
  });

  describe("handle-paste", () => {
    test("paste smaller text than code length", () => {
      const [state, eff] = apply(currState, {type: "handle-paste", val: "abc"});

      expect(state).toMatchObject({...state, focusIdx: 3});
      expect(eff).toEqual([
        {type: "set-input-val", idx: 0, val: "a"},
        {type: "set-input-val", idx: 1, val: "b"},
        {type: "set-input-val", idx: 2, val: "c"},
        {type: "focus-input", idx: 3},
        {type: "handle-code-change"},
      ]);
    });

    test("paste bigger text than code length", () => {
      const [state, eff] = apply(currState, {type: "handle-paste", val: "abcdefgh"});

      expect(state).toMatchObject({...state, focusIdx: 4});
      expect(eff).toEqual([
        {type: "set-input-val", idx: 0, val: "a"},
        {type: "set-input-val", idx: 1, val: "b"},
        {type: "set-input-val", idx: 2, val: "c"},
        {type: "set-input-val", idx: 3, val: "d"},
        {type: "set-input-val", idx: 4, val: "e"},
        {type: "focus-input", idx: 4},
        {type: "handle-code-change"},
      ]);
    });

    test("paste on last input", () => {
      const [state, eff] = apply({...currState, focusIdx: 4}, {type: "handle-paste", val: "abc"});

      expect(state).toMatchObject({...state, focusIdx: 4});
      expect(eff).toEqual([{type: "set-input-val", idx: 4, val: "a"}, {type: "handle-code-change"}]);
    });
  });

  test("focus-input", () => {
    const [state, eff] = apply(currState, {type: "focus-input", idx: 2});

    expect(state).toMatchObject({...state, focusIdx: 2});
    expect(eff).toEqual([{type: "focus-input", idx: 2}]);
  });
});

describe("notify", () => {
  const {defaultProps, useNotifier} = pinField;
  const inputA = mockInput("a");
  const inputB = mockInput("b");
  const inputC = mockInput("");
  const propsFormatMock = jest.fn();
  const propsMock = {
    ...defaultProps,
    length: 3,
    format: (char: string) => {
      propsFormatMock.apply(char);
      return char;
    },
    onResolveKey: jest.fn(),
    onRejectKey: jest.fn(),
    onChange: jest.fn(),
    onComplete: jest.fn(),
  };

  const refs: React.RefObject<any> = {current: [inputA.ref, inputB.ref, inputC.ref]};
  const notify = useNotifier({...propsMock, refs});

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("default action", () => {
    // @ts-expect-error bad action
    notify({type: "bad-action"});
  });

  test("focus input", () => {
    notify({type: "focus-input", idx: 0});

    expect(inputA.ref.focus).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.add).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.add).toHaveBeenCalledWith("-focus");
  });

  describe("set input val", () => {
    test("empty char", () => {
      notify({type: "set-input-val", idx: 0, val: ""});

      expect(propsFormatMock).toHaveBeenCalledTimes(1);
      expect(inputA.setValMock).toHaveBeenCalledTimes(1);
      expect(inputA.setValMock).toHaveBeenCalledWith("");
      expect(inputA.ref.classList.remove).toHaveBeenCalledTimes(1);
      expect(inputA.ref.classList.remove).toHaveBeenCalledWith("-success");
    });

    test("non empty char", () => {
      notify({type: "set-input-val", idx: 0, val: "a"});

      expect(propsFormatMock).toHaveBeenCalledTimes(1);
      expect(inputA.setValMock).toHaveBeenCalledTimes(1);
      expect(inputA.setValMock).toHaveBeenCalledWith("a");
      expect(inputA.ref.classList.remove).not.toHaveBeenCalled();
    });
  });

  test("resolve key", () => {
    notify({type: "resolve-key", idx: 0, key: "a"});

    expect(inputA.ref.classList.remove).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.remove).toHaveBeenCalledWith("-error");
    expect(inputA.ref.classList.add).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.add).toHaveBeenCalledWith("-success");
    expect(propsMock.onResolveKey).toHaveBeenCalledTimes(1);
    expect(propsMock.onResolveKey).toHaveBeenCalledWith("a", inputA.ref);
  });

  test("reject key", () => {
    notify({type: "reject-key", idx: 0, key: "a"});

    expect(inputA.ref.classList.remove).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.remove).toHaveBeenCalledWith("-success");
    expect(inputA.ref.classList.add).toHaveBeenCalledTimes(1);
    expect(inputA.ref.classList.add).toHaveBeenCalledWith("-error");
    expect(propsMock.onRejectKey).toHaveBeenCalledTimes(1);
    expect(propsMock.onRejectKey).toHaveBeenCalledWith("a", inputA.ref);
  });

  describe("handle backspace", () => {
    test("from input A, not empty val", () => {
      notify({type: "handle-delete", idx: 0});

      expect(inputA.ref.classList.remove).toHaveBeenCalledTimes(1);
      expect(inputA.ref.classList.remove).toHaveBeenCalledWith("-error", "-success");
      expect(inputA.setValMock).toHaveBeenCalledTimes(1);
      expect(inputA.setValMock).toHaveBeenCalledWith("");
    });

    test("from input B, not empty val", () => {
      notify({type: "handle-delete", idx: 1});

      expect(inputB.ref.classList.remove).toHaveBeenCalledTimes(1);
      expect(inputB.ref.classList.remove).toHaveBeenCalledWith("-error", "-success");
      expect(inputB.setValMock).toHaveBeenCalledTimes(1);
      expect(inputB.setValMock).toHaveBeenCalledWith("");
    });

    test("from input C, empty val", () => {
      notify({type: "handle-delete", idx: 2});

      expect(inputC.ref.classList.remove).toHaveBeenCalledTimes(1);
      expect(inputC.ref.classList.remove).toHaveBeenCalledWith("-error", "-success");
      expect(inputC.setValMock).toHaveBeenCalledTimes(1);
      expect(inputC.setValMock).toHaveBeenCalledWith("");
      expect(inputB.ref.focus).toHaveBeenCalledTimes(1);
      expect(inputB.ref.classList.remove).toHaveBeenCalledWith("-error", "-success");
      expect(inputB.setValMock).toHaveBeenCalledTimes(1);
      expect(inputB.setValMock).toHaveBeenCalledWith("");
    });
  });

  describe("handle-code-change", () => {
    test("code not complete", () => {
      notify({type: "handle-code-change"});

      expect(propsMock.onChange).toHaveBeenCalledTimes(1);
      expect(propsMock.onChange).toHaveBeenCalledWith("ab");
    });

    test("code complete", () => {
      const inputA = mockInput("a");
      const inputB = mockInput("b");
      const inputC = mockInput("c");
      const refs: React.RefObject<any> = {current: [inputA.ref, inputB.ref, inputC.ref]};
      const notify = useNotifier({...propsMock, refs});

      notify({type: "handle-code-change"});

      expect(propsMock.onChange).toHaveBeenCalledTimes(1);
      expect(propsMock.onChange).toHaveBeenCalledWith("abc");
      expect(propsMock.onComplete).toHaveBeenCalledTimes(1);
      expect(propsMock.onComplete).toHaveBeenCalledWith("abc");
    });
  });
});
