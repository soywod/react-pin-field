import { FC } from '../../node_modules/react';
import { Meta, StoryObj } from '@storybook/react';
import { default as PinField, Props } from './pin-field';
/**
 * The `<PinField />` component is a simple wrapper around a list of HTML inputs.
 *
 * The component exposes 4 event handlers, see stories below to learn more about the other props.
 */
declare const meta: Meta<typeof PinField>;
export declare const Default: StoryObj<typeof PinField>;
/**
 * Story to detect inconsistent behaviours in React Strict Mode.
 */
export declare const StrictMode: StoryObj<typeof PinField>;
/**
 * The `usePinField()` hook exposes a handler to control the PIN field:
 *
 * - `refs`: the list of HTML input elements that composes the PIN field
 * - `value`: the current value of the PIN field
 * - `setValue`: change the current value of the PIN field
 *
 * It also exposes the internal `state` and `dispatch` for advance usage.
 *
 * The handler returned by `usePinField()` needs to be passed down to the composant for the control to work:
 *
 * ```tsx
 * const handler = usePinField();
 * return <PinField handler={handler} />
 * ```
 */
export declare const Controlled: StoryObj<FC<{
    controlled: boolean;
}>>;
/**
 * Characters can be formatted with a formatter `(char: string) => string`.
 */
export declare const Format: StoryObj<FC<Props & {
    formatEval: string;
}>>;
/**
 * Characters can be validated using the HTML input attribute `pattern`:
 */
export declare const HTMLInputAttributes: StoryObj<FC<Props & {
    formatAriaLabelEval: string;
}>>;
export default meta;
