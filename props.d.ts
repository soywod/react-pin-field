import { InputHTMLAttributes } from '../node_modules/react';
import { Handler } from './hook';
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
