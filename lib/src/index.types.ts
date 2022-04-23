import {PinField} from ".";

export type ReactPinFieldInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export type ReactPinFieldDefaultProps = {
  ref: React.Ref<PinField>;
  length: number;
  validate: string | string[] | RegExp | ((key: string) => boolean);
  format: (char: string) => string;
  debug: boolean;
  onResolveKey: (key: string, ref?: HTMLInputElement) => any;
  onRejectKey: (key: string, ref?: HTMLInputElement) => any;
  onChange: (code: string) => void;
  onComplete: (code: string) => void;
};

export type ReactPinFieldProps = Partial<ReactPinFieldDefaultProps> & ReactPinFieldInputProps;

export type ReactPinFieldNotifierProps = {
  refs: React.MutableRefObject<HTMLInputElement[]>;
} & ReactPinFieldDefaultProps;

export type ReactPinFieldState = {
  focusIdx: number;
  codeLength: ReactPinFieldDefaultProps["length"];
  isKeyAllowed: (key: string) => boolean;
  fallback: {idx: number; val: string} | null;
};

export type ReactPinFieldAction =
  | {type: "handle-key-down"; key: string; idx: number; val: string}
  | {type: "handle-key-up"; idx: number; val: string}
  | {type: "handle-paste"; idx: number; val: string}
  | {type: "focus-input"; idx: number};

export type ReactPinFieldEffect =
  | {type: "focus-input"; idx: number}
  | {type: "set-input-val"; idx: number; val: string}
  | {type: "resolve-key"; idx: number; key: string}
  | {type: "reject-key"; idx: number; key: string}
  | {type: "handle-delete"; idx: number}
  | {type: "handle-code-change"};
