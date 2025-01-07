import {
  useEffect,
  KeyboardEventHandler,
  ChangeEventHandler,
  CompositionEventHandler,
  forwardRef,
  useImperativeHandle,
} from "react";

import { hasFocus, range } from "./utils";
import { defaultNativeProps, defaultProps, Props } from "./props";
import { usePinField } from "./hook";

export const PinField = forwardRef<HTMLInputElement[], Props>(
  (
    {
      length = defaultProps.length,
      format = defaultProps.format,
      formatAriaLabel = defaultProps.formatAriaLabel,
      onChange: handleChange = defaultProps.onChange,
      onComplete: handleComplete = defaultProps.onComplete,
      handler: customHandler,
      autoFocus,
      ...nativeProps
    },
    fwdRef,
  ) => {
    const internalHandler = usePinField();
    const { refs, state, dispatch } = customHandler || internalHandler;

    useImperativeHandle(fwdRef, () => refs.current, [refs]);

    function setRefAt(index: number): (ref: HTMLInputElement) => void {
      return ref => {
        if (ref) {
          refs.current[index] = ref;
        }
      };
    }

    function handleKeyDownAt(index: number): KeyboardEventHandler<HTMLInputElement> {
      return event => {
        console.log("keyDown", index, event);
        const { key, code, keyCode, which } = event;
        dispatch({ type: "handle-key-down", index, key, code, keyCode, which });
      };
    }

    function handleChangeAt(index: number): ChangeEventHandler<HTMLInputElement> {
      return event => {
        if (event.nativeEvent instanceof InputEvent) {
          const value = event.nativeEvent.data;
          dispatch({ type: "handle-change", index, value });
        } else {
          const { value } = event.target;
          dispatch({ type: "handle-change", index, value, reset: true });
        }
      };
    }

    function startCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
      return () => {
        dispatch({ type: "start-composition", index });
      };
    }

    function endCompositionAt(index: number): CompositionEventHandler<HTMLInputElement> {
      return event => {
        dispatch({ type: "end-composition", index, value: event.data });
      };
    }

    // initial props to state update
    useEffect(() => {
      if (state.ready) return;
      const dir =
        nativeProps.dir?.toLowerCase() ||
        document.documentElement.getAttribute("dir")?.toLowerCase();
      dispatch({ type: "update-props", props: { length, format, dir } });
    }, [state.ready, dispatch, length, format]);

    // props.length to state update
    useEffect(() => {
      if (!state.ready) return;
      if (length === state.length) return;
      dispatch({ type: "update-props", props: { length } });
    }, [state.ready, length, state.length, dispatch]);

    // props.format to state update
    useEffect(() => {
      if (!state.ready) return;
      if (format === state.format) return;
      dispatch({ type: "update-props", props: { format } });
    }, [state.ready, format, state.format, dispatch]);

    // nativeProps.dir to state update
    useEffect(() => {
      if (!state.ready) return;
      const dir =
        nativeProps.dir?.toLowerCase() ||
        document.documentElement.getAttribute("dir")?.toLowerCase();
      if (dir === state.dir) return;
      dispatch({ type: "update-props", props: { dir } });
    }, [state.ready, nativeProps.dir, state.dir, dispatch]);

    // state to view update
    useEffect(() => {
      if (!refs.current) return;
      if (!state.ready) return;
      if (!state.dirty) return;

      let innerFocus = false;
      let completed = state.values.length == state.length;
      let value = "";

      for (let index = 0; index < state.length; index++) {
        const char = index in state.values ? state.values[index] : "";
        refs.current[index].value = char;
        innerFocus = innerFocus || hasFocus(refs.current[index]);
        completed = completed && index in state.values && refs.current[index].checkValidity();
        value += char;
      }

      if (innerFocus) {
        refs.current[state.cursor].focus();
      }

      if (handleChange) {
        handleChange(value);
      }

      if (handleComplete && completed) {
        handleComplete(value);
      }
    }, [refs, state, handleChange, handleComplete]);

    if (!state.ready) {
      return null;
    }

    const inputs = range(0, state.length).map(index => (
      <input
        {...defaultNativeProps}
        {...nativeProps}
        key={index}
        ref={setRefAt(index)}
        autoFocus={index === 0 && autoFocus}
        onKeyDown={handleKeyDownAt(index)}
        onChange={handleChangeAt(index)}
        onCompositionStart={startCompositionAt(index)}
        onCompositionEnd={endCompositionAt(index)}
        aria-label={formatAriaLabel(index + 1, state.length)}
        aria-required={nativeProps.required ? "true" : undefined}
        aria-disabled={nativeProps.disabled ? "true" : undefined}
        aria-readonly={nativeProps.readOnly ? "true" : undefined}
      />
    ));

    if (state.dir === "rtl") {
      inputs.reverse();
    }

    return inputs;
  },
);

export default PinField;
