import { InputHTMLAttributes, KeyboardEvent, RefObject, ActionDispatch } from '../../node_modules/react';
export declare const BACKSPACE = 8;
export declare const DELETE = 46;
export type InnerProps = {
    length: number;
    format: (char: string) => string;
    formatAriaLabel: (index: number, total: number) => string;
    onChange: (value: string) => void;
    onComplete: (value: string) => void;
};
export declare const defaultProps: InnerProps;
export type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd">;
export declare const defaultNativeProps: NativeProps;
export type Props = NativeProps & Partial<InnerProps> & {
    handler?: Handler;
};
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
export type NoOpAction = {
    type: "noop";
};
export type UpdatePropsAction = {
    type: "update-props";
    props: Partial<StateProps>;
};
export type HandleCompositionStartAction = {
    type: "start-composition";
    index: number;
};
export type HandleCompositionEndAction = {
    type: "end-composition";
    index: number;
    value: string;
};
export type HandleKeyChangeAction = {
    type: "handle-change";
    index: number;
    value: string | null;
    reset?: boolean;
};
export type HandleKeyDownAction = {
    type: "handle-key-down";
    index: number;
} & Partial<Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">>;
export type Action = NoOpAction | UpdatePropsAction | HandleCompositionStartAction | HandleCompositionEndAction | HandleKeyChangeAction | HandleKeyDownAction;
export declare function reducer(prevState: State, action: Action): State;
export type Handler = {
    refs: RefObject<HTMLInputElement[]>;
    state: State;
    dispatch: ActionDispatch<[Action]>;
    value: string;
    setValue: (value: string) => void;
};
export declare function usePinField(): Handler;
export declare const PinField: import('../../node_modules/react').ForwardRefExoticComponent<NativeProps & Partial<InnerProps> & {
    handler?: Handler;
} & import('../../node_modules/react').RefAttributes<HTMLInputElement[]>>;
export declare function hasFocus(el: HTMLElement): boolean;
export default PinField;
