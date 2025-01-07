import { ActionDispatch, RefObject } from '../node_modules/react';
import { State } from './state';
import { Action } from './actions';
export type Handler = {
    refs: RefObject<HTMLInputElement[]>;
    state: State;
    dispatch: ActionDispatch<[Action]>;
    value: string;
    setValue: (value: string) => void;
};
export declare function usePinField(): Handler;
