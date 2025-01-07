import { InnerProps, NativeProps } from './props';
export type StateProps = Pick<NativeProps, "dir"> & Pick<InnerProps, "length" | "format">;
export type State = StateProps & {
    cursor: number;
    values: string[];
    backspace: boolean;
    composition: boolean;
    ready: boolean;
    dirty: boolean;
};
export declare const defaultState: State;
