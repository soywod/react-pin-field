import {FC, createElement, forwardRef, useEffect, useImperativeHandle, useRef} from "react";

import {PinField} from "@soywod/pin-field";
import {
  ReactPinFieldProps as Props,
  ReactPinFieldDefaultProps as DefaultProps,
  ReactPinFieldInputProps as InputProps,
} from "./index.types";

export * from "@soywod/pin-field";
export * from "./index.types";

function noop() {
  //
}

const defaultProps: DefaultProps = {
  ref: {current: new PinField()},
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  debug: false,
  onResolveKey: noop,
  onRejectKey: noop,
  onChange: noop,
  onComplete: noop,
};

export const ReactPinField: FC<Props> = forwardRef((customProps, fwdRef) => {
  const ref = useRef<PinField>(new PinField());
  const props: DefaultProps & InputProps = {...defaultProps, ...customProps};
  const {
    className,
    ref: _ref,
    length,
    validate,
    format,
    debug,
    onResolveKey,
    onRejectKey,
    onChange,
    onComplete,
    ...inputProps
  } = props;

  function handleChange(evt: Event) {
    if (evt instanceof CustomEvent) {
      onChange(evt.detail.value);
    }
  }

  function handleResolveKey(evt: Event) {
    if (evt instanceof CustomEvent) {
      onResolveKey(evt.detail.key);
    }
  }

  function handleRejectKey(evt: Event) {
    if (evt instanceof CustomEvent) {
      onRejectKey(evt.detail.key);
    }
  }

  function handleComplete(evt: Event) {
    if (evt instanceof CustomEvent) {
      onComplete(evt.detail.value);
    }
  }

  useImperativeHandle(fwdRef, () => ref.current, [ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current.validate = validate;
      ref.current.format = format;
      ref.current.addEventListener("change", handleChange);
      ref.current.addEventListener("resolve-key", handleResolveKey);
      ref.current.addEventListener("reject-key", handleRejectKey);
      ref.current.addEventListener("complete", handleComplete);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("change", handleChange);
          ref.current.removeEventListener("resolve-key", handleResolveKey);
          ref.current.removeEventListener("reject-key", handleRejectKey);
          ref.current.removeEventListener("complete", handleComplete);
        }
      };
    }
    return;
  }, []);

  return createElement("swd-pin-field", {ref, class: className, length, debug: debug ? "" : undefined, ...inputProps});
});

export default ReactPinField;
