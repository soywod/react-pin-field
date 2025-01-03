import "@testing-library/jest-dom";

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { EffectReducer, StateReducer, useBireducer } from "./use-bireducer";

type State = {
  count: number;
};

type Action = { type: "update"; value: number } | { type: "reset" };

type Effect = { type: "log"; value: string } | { type: "backup"; count: number };

const stateReducer: StateReducer<State, Action, Effect> = (state, action) => {
  switch (action.type) {
    case "update": {
      return [{ count: action.value }, [{ type: "log", value: `set counter ${action.value}` }]];
    }
    case "reset": {
      return [
        state,
        [
          { type: "log", value: "reset counter" },
          { type: "backup", count: state.count },
        ],
      ];
    }
  }
};

const effectReducer: EffectReducer<Effect, Action> = (effect, dispatch) => {
  switch (effect.type) {
    case "log": {
      console.log(effect.value);
      return;
    }
    case "backup": {
      localStorage.setItem("backup", String(effect.count));
      dispatch({ type: "update", value: 0 });
      return () => {
        localStorage.clear();
      };
    }
  }
};

describe("useBireducer", () => {
  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn();
    global.Storage.prototype.clear = jest.fn();
    global.console.log = jest.fn();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should work", () => {
    function TestComponent() {
      const [state, dispatch] = useBireducer(stateReducer, effectReducer, {
        count: 0,
      });

      return (
        <>
          <span data-testid="counter">{state.count}</span>
          <button data-testid="decrement" onClick={() => dispatch({ type: "update", value: state.count - 1 })}>
            decrement
          </button>
          <button data-testid="increment" onClick={() => dispatch({ type: "update", value: state.count + 1 })}>
            increment
          </button>
          <button data-testid="reset" onClick={() => dispatch({ type: "reset" })}>
            reset
          </button>
        </>
      );
    }

    const { unmount } = render(<TestComponent />);
    expect(screen.getByTestId("counter")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("increment"));
    fireEvent.click(screen.getByTestId("increment"));
    expect(screen.getByTestId("counter")).toHaveTextContent("2");
    expect(console.log).toHaveBeenNthCalledWith(1, "set counter 1");
    expect(console.log).toHaveBeenNthCalledWith(2, "set counter 2");

    fireEvent.click(screen.getByTestId("decrement"));
    expect(screen.getByTestId("counter")).toHaveTextContent("1");
    expect(console.log).toHaveBeenNthCalledWith(3, "set counter 1");

    fireEvent.click(screen.getByTestId("reset"));
    expect(screen.getByTestId("counter")).toHaveTextContent("0");
    expect(console.log).toHaveBeenNthCalledWith(4, "reset counter");
    expect(console.log).toHaveBeenNthCalledWith(5, "set counter 0");
    expect(localStorage.setItem).toHaveBeenNthCalledWith(1, "backup", "1");
    expect(localStorage.clear).not.toHaveBeenCalled();

    unmount();
    expect(localStorage.clear).toHaveBeenCalledTimes(1);
  });
});
