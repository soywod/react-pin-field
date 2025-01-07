import { InputHTMLAttributes } from "react";

import { noop } from "./utils";
import { Handler } from "./hook";

export type InnerProps = {
  length: number;
  format: (char: string) => string;
  formatAriaLabel: (index: number, total: number) => string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
};

export const defaultProps: InnerProps = {
  length: 5,
  format: char => char,
  formatAriaLabel: (index: number, total: number) => `PIN field ${index} of ${total}`,
  onChange: noop,
  onComplete: noop,
};

export type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd"
>;

export const defaultNativeProps: NativeProps = {
  type: "text",
  inputMode: "text",
  autoCapitalize: "off",
  autoCorrect: "off",
  autoComplete: "off",
};

export type Props = NativeProps &
  Partial<InnerProps> & {
    handler?: Handler;
  };
