import { defaultProps, InnerProps, NativeProps } from "./props";

export type StateProps = Pick<NativeProps, "dir"> & Pick<InnerProps, "length" | "format">;

export type State = StateProps & {
  cursor: number;
  values: string[];
  backspace: boolean;
  composition: boolean;
  ready: boolean;
  dirty: boolean;
};

export const defaultState: State = {
  length: defaultProps.length,
  format: defaultProps.format,
  dir: "ltr",
  cursor: 0,
  values: Array(defaultProps.length),
  backspace: false,
  composition: false,
  ready: false,
  dirty: false,
};
