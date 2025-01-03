import { FC, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import cn from "classnames";

import type { PinFieldProps } from "./pin-field.types";
import { PinField, defaultProps } from "./pin-field";

import "./pin-field.stories.scss";

const defaultArgs = {
  length: defaultProps.length,
  onResolveKey: fn(),
  onRejectKey: fn(),
  onChange: fn(),
  onComplete: fn(),
} satisfies PinFieldProps;

/**
 * The `<PinField />` component is a simple wrapper around a list of HTML inputs.
 *
 * The component exposes 4 event handlers, see stories below to learn more about the other props.
 */
const meta: Meta<typeof PinField> = {
  title: "PinField",
  component: PinField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default: StoryObj<typeof PinField> = {
  render: props => <PinField {...props} data-cy="pin-field" />,
  args: defaultArgs,
};

/**
 * Every HTML input can be controlled thanks to a React reference.
 */
export const Reference: StoryObj<typeof PinField> = {
  render: props => {
    const ref = useRef<HTMLInputElement[]>([]);

    return (
      <>
        <div>
          <PinField {...props} ref={ref} />
        </div>
        <div>
          <button onClick={() => ref && ref.current && ref.current[1].focus()}>Focus 2nd input</button>
          <button onClick={() => ref && ref.current && ref.current.forEach(input => (input.value = ""))}>
            Reset values
          </button>
        </div>
      </>
    );
  },
  args: defaultArgs,
};

/**
 * Characters can be validated with a validator. A validator can take the form of:
 *
 * - a String of allowed characters: `abcABC123`
 * - an Array of allowed characters: `["a", "b", "c", "1", "2", "3"]`
 * - a RegExp: `/^[a-zA-Z0-9]$/`
 * - a predicate: `(char: string) => boolean`
 */
export const Validate: StoryObj<FC<PinFieldProps & { validateRegExp: string }>> = {
  render: ({ validateRegExp, ...props }) => {
    try {
      const validate = new RegExp(validateRegExp);
      return <PinField {...props} validate={validate} />;
    } catch (err: any) {
      return <div>Invalid RegExp: {err.toString()}</div>;
    }
  },
  argTypes: {
    validateRegExp: {
      name: "validate (RegExp)",
    },
  },
  args: {
    validateRegExp: "[0-9]",
    ...defaultArgs,
  },
};

/**
 * Characters can be formatted with a formatter `(char: string) => string`.
 */
export const Format: StoryObj<FC<PinFieldProps & { formatEval: string }>> = {
  render: ({ formatEval, ...props }) => {
    try {
      let format = eval(formatEval);
      format("a");
      return <PinField {...props} format={format} />;
    } catch (err: any) {
      return <div>Invalid format function: {err.toString()}</div>;
    }
  },
  argTypes: {
    formatEval: {
      control: "text",
      name: "format (fn eval)",
    },
  },
  args: {
    formatEval: "char => char.toUpperCase()",
    ...defaultArgs,
  },
};

/**
 * Props inherit from `InputHTMLAttributes`.
 */
export const HTMLInputAttributes: StoryObj<FC<PinFieldProps & { formatAriaLabelEval: string }>> = {
  render: ({ formatAriaLabelEval, ...props }) => {
    try {
      let formatAriaLabel = eval(formatAriaLabelEval);
      formatAriaLabel(0, 0);
      return <PinField {...props} formatAriaLabel={formatAriaLabel} />;
    } catch (err: any) {
      return <div>Invalid format aria label function: {err.toString()}</div>;
    }
  },
  argTypes: {
    formatAriaLabelEval: {
      control: "text",
      name: "formatAriaLabel (fn eval)",
    },
    type: {
      control: "select",
      options: ["text", "number", "password"],
    },
  },
  args: {
    type: "password",
    autoFocus: true,
    disabled: false,
    autoCorrect: "off",
    autoComplete: "off",
    formatAriaLabelEval: "(i, n) => `field ${i}/${n}`",
    ...defaultArgs,
  },
};

/**
 * Finally, the pin field can be styled either with `style` or `className`.
 *
 * This last one allows you to use pseudo-classes like `:nth-of-type`,`:focus`, `:hover`,`:valid`,`:invalid`…
 */
export const Styled: StoryObj<typeof PinField> = {
  render: props => {
    const [done, setDone] = useState(false);
    const className = cn(props.className, { complete: done });
    const format = (val: string) => val.toUpperCase();
    const handleComplete = (code: string) => {
      setDone(true);
      if (props.onComplete) props.onComplete(code);
    };

    return (
      <PinField
        className={className}
        format={format}
        autoFocus
        disabled={done}
        autoComplete="one-time-password"
        {...props}
        onComplete={handleComplete}
      />
    );
  },
  args: {
    className: "pin-field",
    style: {},
    ...defaultArgs,
  },
};

export default meta;
