import {Dispatch} from "react";

/**
 * State updater.
 * Act like a classical reducer, but returns [Model, Effect[]] instead.
 * This way, the effects are detached from the Model.
 */
export type Updater<M, A, E> = (model: M, action: A) => [M, E[]];

/**
 * Effect triggerer.
 */
export type Notifier<M, A, E> = (effect: E, model: M, disptach: Dispatch<A>) => void;
