import { noop, range } from "./utils";

test("noop", () => {
  expect(noop()).toEqual(undefined);
});

test("range", () => {
  expect(range(0, 0)).toEqual([]);
  expect(range(0, 3)).toEqual([0, 1, 2]);
  expect(range(3, 0)).toEqual([]);
  expect(range(3, 3)).toEqual([3, 4, 5]);
});
