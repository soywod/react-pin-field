import { KeyboardEvent } from '../node_modules/react';
import { StateProps } from './state';
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
