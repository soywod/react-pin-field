import {
  reducer,
  BACKSPACE,
  DELETE,
  defaultProps,
  defaultState,
  State,
  HandleKeyDownAction,
  defaultNativeProps,
} from "./pin-field-v2";

test("constants", () => {
  expect(BACKSPACE).toEqual(8);
  expect(DELETE).toEqual(46);
});

test("default props", () => {
  expect(defaultProps).toEqual({
    length: 5,
    format: expect.any(Function),
    formatAriaLabel: expect.any(Function),
    onChange: expect.any(Function),
    onComplete: expect.any(Function),
  });

  expect(defaultProps.format("a")).toStrictEqual("a");
  expect(defaultProps.formatAriaLabel(1, 2)).toStrictEqual("PIN field 1 of 2");
  expect(defaultProps.onChange("a")).toStrictEqual(undefined);
  expect(defaultProps.onComplete("a")).toStrictEqual(undefined);
});

test("default native props", () => {
  expect(defaultNativeProps).toEqual({
    type: "text",
    inputMode: "text",
    autoCapitalize: "off",
    autoCorrect: "off",
    autoComplete: "off",
  });
});

test("default state", () => {
  expect(defaultState).toEqual({
    length: 5,
    format: expect.any(Function),
    dir: "ltr",
    cursor: 0,
    values: Array(5),
    backspace: false,
    composition: false,
    ready: false,
    dirty: false,
  });

  expect(defaultState.format("a")).toStrictEqual("a");
});

describe("state reducer", () => {
  test("noop", () => {
    const state = reducer(defaultState, { type: "noop" });
    expect(state).toStrictEqual(defaultState);
  });

  describe("update-props", () => {
    describe("new length < prev length", () => {
      test("cursor < length", () => {
        const prevState: State = { ...defaultState };
        const state = reducer(prevState, {
          type: "update-props",
          props: { length: 3 },
        });
        expect(state).toMatchObject({
          length: 3,
          values: [],
          cursor: 0,
          ready: true,
          dirty: false,
        });
      });

      test("cursor = length", () => {
        const prevState = {
          ...defaultState,
          values: ["a", "b"],
          cursor: 2,
          ready: true,
          dirty: true,
        };
        const state = reducer(prevState, {
          type: "update-props",
          props: { length: 3 },
        });
        expect(state).toMatchObject({
          length: 3,
          values: ["a", "b"],
          cursor: 2,
          ready: true,
          dirty: true,
        });
      });

      test("cursor > length", () => {
        const prevState = {
          ...defaultState,
          values: ["a", "b", "c", "d"],
          cursor: 3,
          ready: true,
          dirty: true,
        };
        const state = reducer(prevState, {
          type: "update-props",
          props: { length: 3 },
        });
        expect(state).toMatchObject({
          length: 3,
          values: ["a", "b", "c"],
          cursor: 2,
          ready: true,
          dirty: true,
        });
      });
    });

    test("new length = prev length", () => {
      const prevState = {
        ...defaultState,
        values: ["a", "b"],
        cursor: 2,
        ready: true,
        dirty: true,
      };
      const state = reducer(prevState, {
        type: "update-props",
        props: { length: 5 },
      });
      expect(state).toMatchObject({
        length: 5,
        values: ["a", "b"],
        cursor: 2,
        ready: true,
        dirty: true,
      });
    });

    test("new length > prev length", () => {
      const prevState = {
        ...defaultState,
        values: ["a", "b"],
        cursor: 2,
        ready: true,
        dirty: true,
      };
      const state = reducer(prevState, {
        type: "update-props",
        props: { length: 7 },
      });
      expect(state).toMatchObject({
        length: 7,
        values: ["a", "b"],
        cursor: 2,
        ready: true,
        dirty: true,
      });
    });
  });

  test("start-composition", () => {
    const prevState = { ...defaultState };

    const state = reducer(prevState, { type: "start-composition", index: 0 });
    expect(state).toMatchObject({
      composition: true,
      dirty: true,
    });
  });

  describe("end-composition", () => {
    const prevState = { ...defaultState };

    test("with empty value at cursor 0", () => {
      const state = reducer(prevState, {
        type: "end-composition",
        index: 0,
        value: "",
      });
      expect(state).toMatchObject({
        values: [],
        cursor: 0,
        composition: false,
        dirty: true,
      });
    });

    test("with empty value at cursor n + 1", () => {
      const prevState: State = {
        ...defaultState,
        values: ["a", "b"],
        cursor: 2,
      };
      const state = reducer(prevState, {
        type: "end-composition",
        index: 2,
        value: "",
      });
      expect(state).toMatchObject({
        values: ["a", "b"],
        cursor: 2,
        composition: false,
        dirty: true,
      });
    });

    test("with empty value at cursor length", () => {
      const prevState: State = {
        ...defaultState,
        values: ["a", "b", "c", "d", "e"],
        cursor: 4,
      };
      const state = reducer(prevState, {
        type: "end-composition",
        index: 4,
        value: "",
      });
      expect(state).toMatchObject({
        values: ["a", "b", "c", "d", undefined],
        cursor: 4,
        composition: false,
        dirty: true,
      });
    });

    test("with non-empty value at cursor 0", () => {
      const state = reducer(prevState, {
        type: "end-composition",
        index: 0,
        value: "a",
      });
      expect(state).toMatchObject({
        values: ["a"],
        cursor: 1,
        composition: false,
        dirty: true,
      });
    });

    test("with non-empty value at cursor n + 1", () => {
      const prevState: State = {
        ...defaultState,
        values: ["a", "b"],
        cursor: 2,
      };
      const state = reducer(prevState, {
        type: "end-composition",
        index: 2,
        value: "c",
      });
      expect(state).toMatchObject({
        values: ["a", "b", "c"],
        cursor: 3,
        composition: false,
        dirty: true,
      });
    });

    test("with non-empty value at cursor length", () => {
      const prevState: State = {
        ...defaultState,
        values: ["a", "b", "c", "d", "e"],
        cursor: 4,
      };
      const state = reducer(prevState, {
        type: "end-composition",
        index: 4,
        value: "f",
      });
      expect(state).toMatchObject({
        values: ["a", "b", "c", "d", "f"],
        cursor: 4,
        composition: false,
        dirty: true,
      });
    });
  });

  describe("handle-change", () => {
    test("composition", () => {
      const prevState = { ...defaultState, composition: true };
      const state = reducer(prevState, {
        type: "handle-change",
        index: 0,
        value: "",
        reset: false,
      });
      expect(state).toStrictEqual(prevState);
    });

    test("reset", () => {
      const prevState = { ...defaultState, values: ["a", "b"] };
      const state = reducer(prevState, {
        type: "handle-change",
        index: 0,
        value: "",
        reset: true,
      });
      expect(state).toMatchObject({
        values: [],
        cursor: 0,
      });
    });

    describe("empty value", () => {
      describe("with backspace", () => {
        test("without values", () => {
          const prevState = { ...defaultState, backspace: true };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 0,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: [],
            cursor: 0,
          });
        });

        test("with values, cursor < values length", () => {
          const prevState = {
            ...defaultState,
            values: ["a", "b", "c"],
            backspace: true,
          };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 1,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: ["a", undefined, "c"],
            cursor: 1,
          });
        });

        test("with values, cursor >= values length", () => {
          const prevState = {
            ...defaultState,
            values: ["a", "b", "c"],
            backspace: true,
          };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 3,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: ["a", "b", "c"],
            cursor: 3,
          });
        });
      });

      describe("without backspace", () => {
        test("without values", () => {
          const prevState = { ...defaultState };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 0,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: [],
            cursor: 0,
          });
        });

        test("with values, cursor < values length", () => {
          const prevState = { ...defaultState, values: ["a", "b", "c"] };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 1,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: ["a", undefined, "c"],
            cursor: 0,
          });
        });

        test("with values, cursor >= values length", () => {
          const prevState = { ...defaultState, values: ["a", "b", "c"] };
          const state = reducer(prevState, {
            type: "handle-change",
            index: 3,
            value: "",
            reset: false,
          });
          expect(state).toMatchObject({
            values: ["a", "b", "c"],
            cursor: 2,
          });
        });
      });
    });

    describe("single value", () => {
      test("empty field", () => {
        const prevState = { ...defaultState };
        const state = reducer(prevState, {
          type: "handle-change",
          index: 0,
          value: "a",
          reset: false,
        });
        expect(state).toMatchObject({
          values: ["a"],
          cursor: 1,
        });
      });

      test("in progress field, head insertion", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c"] },
          { type: "handle-change", index: 1, value: "d", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "d", "c"],
          cursor: 2,
        });
      });

      test("in progress field, tail insertion", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c"] },
          { type: "handle-change", index: 3, value: "d", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d"],
          cursor: 4,
        });
      });

      test("complete field, head insertion", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c", "d", "e"] },
          { type: "handle-change", index: 1, value: "f", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "f", "c", "d", "e"],
          cursor: 2,
        });
      });

      test("complete field, tail insertion", () => {
        const prevState = {
          ...defaultState,
          values: ["a", "b", "c", "d", "e"],
        };
        const state = reducer(prevState, {
          type: "handle-change",
          index: 4,
          value: "f",
          reset: false,
        });
        expect(state).toMatchObject({
          values: ["a", "b", "c", "d", "f"],
          cursor: 4,
        });
      });
    });

    describe("multi value", () => {
      test("empty field, value < length", () => {
        const state = reducer(defaultState, {
          type: "handle-change",
          index: 0,
          value: "abc",
          reset: false,
        });

        expect(state).toMatchObject({
          values: ["a", "b", "c"],
          cursor: 3,
        });
      });

      test("empty field, value = length", () => {
        const state = reducer(defaultState, {
          type: "handle-change",
          index: 0,
          value: "abcde",
          reset: false,
        });

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d", "e"],
          cursor: 4,
        });
      });

      test("empty field, value > length", () => {
        const state = reducer(defaultState, {
          type: "handle-change",
          index: 0,
          value: "abcdefg",
          reset: false,
        });

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d", "e"],
          cursor: 4,
        });
      });

      test("in progress field, head insertion, value < length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c"] },
          { type: "handle-change", index: 1, value: "def", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "d", "e", "f"],
          cursor: 4,
        });
      });

      test("in progress field, head insertion, value = length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c"] },
          { type: "handle-change", index: 1, value: "defg", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "d", "e", "f", "g"],
          cursor: 4,
        });
      });

      test("in progress field, head insertion, value > length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c"] },
          { type: "handle-change", index: 1, value: "defghi", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "d", "e", "f", "g"],
          cursor: 4,
        });
      });

      test("in progress field, tail insertion, value < length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b"] },
          { type: "handle-change", index: 2, value: "cd", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d"],
          cursor: 4,
        });
      });

      test("in progress field, tail insertion, value = length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b"] },
          { type: "handle-change", index: 2, value: "cde", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d", "e"],
          cursor: 4,
        });
      });

      test("in progress field, tail insertion, value > length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b"] },
          { type: "handle-change", index: 2, value: "cdefg", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "b", "c", "d", "e"],
          cursor: 4,
        });
      });

      test("complete field, head insertion, value < length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c", "d", "e"] },
          { type: "handle-change", index: 1, value: "fg", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "f", "g", "d", "e"],
          cursor: 3,
        });
      });

      test("complete field, head insertion, value = length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c", "d", "e"] },
          { type: "handle-change", index: 1, value: "fghi", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "f", "g", "h", "i"],
          cursor: 4,
        });
      });

      test("complete field, head insertion, value > length", () => {
        const state = reducer(
          { ...defaultState, values: ["a", "b", "c", "d", "e"] },
          { type: "handle-change", index: 1, value: "fghijkl", reset: false },
        );

        expect(state).toMatchObject({
          values: ["a", "f", "g", "h", "i"],
          cursor: 4,
        });
      });
    });
  });

  describe("handle-key-down", () => {
    test("no deletion", () => {
      const state = reducer(defaultState, {
        type: "handle-key-down",
        index: 0,
        key: "",
        code: "",
        keyCode: 0,
        which: 0,
      });

      expect(state).toStrictEqual(defaultState);
    });

    test.each<Partial<HandleKeyDownAction>>([
      { key: "Backspace" },
      { key: "Delete" },
      { code: "Backspace" },
      { code: "Delete" },
      { keyCode: BACKSPACE },
      { keyCode: DELETE },
      { which: BACKSPACE },
      { which: DELETE },
    ])("delete with %o when value exists at index", (action) => {
      const prevState: State = { ...defaultState, values: ["a", "b"] };
      const state = reducer(prevState, {
        type: "handle-key-down",
        index: 1,
        ...action,
      });
      expect(state).toStrictEqual(prevState);
    });

    test("delete when empty value at index, cursor > 0", () => {
      const state = reducer(
        { ...defaultState, values: ["a", "b"] },
        { type: "handle-key-down", index: 2, key: "Backspace" },
      );

      expect(state).toMatchObject({
        cursor: 1,
        backspace: true,
        dirty: true,
      });
    });

    test("delete when empty value at index, cursor = 0", () => {
      const state = reducer(
        { ...defaultState, values: ["", "b"] },
        { type: "handle-key-down", index: 0, key: "Backspace" },
      );

      expect(state).toMatchObject({
        cursor: 0,
        backspace: true,
        dirty: true,
      });
    });
  });
});
