import { noop, range, omit } from "./utils";

test("noop", () => {
  expect(noop()).toEqual(undefined);
});

test("range", () => {
  expect(range(0, 0)).toEqual([]);
  expect(range(0, 3)).toEqual([0, 1, 2]);
  expect(range(3, 0)).toEqual([]);
  expect(range(3, 3)).toEqual([3, 4, 5]);
});

test("omit", () => {
  expect(omit([], { a: 0, b: 1 })).toEqual({ a: 0, b: 1 });
  expect(omit(["a"], { a: 0, b: 1 })).toEqual({ b: 1 });
  expect(omit(["b"], { a: 0, b: 1 })).toEqual({ a: 0 });
  expect(omit(["a", "b"], { a: 0, b: 1 })).toEqual({});
});
