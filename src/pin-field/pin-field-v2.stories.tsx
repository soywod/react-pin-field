import { FC, StrictMode as ReactStrictMode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { PinFieldV2, defaultProps, Props, usePinField, InnerProps } from "./pin-field-v2";

const defaultArgs = {
  length: defaultProps.length,
  format: defaultProps.format,
  formatAriaLabel: defaultProps.formatAriaLabel,
  onChange: fn(),
  onComplete: fn(),
} satisfies InnerProps;

/**
 * The `<PinField />` component is a simple wrapper around a list of HTML inputs.
 *
 * The component exposes 4 event handlers, see stories below to learn more about the other props.
 */
const meta: Meta<typeof PinFieldV2> = {
  title: "PinFieldV2",
  component: PinFieldV2,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default: StoryObj<typeof PinFieldV2> = {
  render: props => <PinFieldV2 {...props} data-cy="pin-field" />,
  args: defaultArgs,
};

/**
 * Story to detect inconsistent behaviours in React Strict Mode.
 */
export const StrictMode: StoryObj<typeof PinFieldV2> = {
  render: props => (
    <ReactStrictMode>
      <PinFieldV2 {...props} />
    </ReactStrictMode>
  ),
  args: defaultArgs,
};

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
export const Controlled: StoryObj<FC<{ controlled: boolean }>> = {
  render: ({ controlled }) => {
    const handler = usePinField();

    return (
      <>
        <div>
          <PinFieldV2 handler={controlled ? handler : undefined} />
        </div>
        <button onClick={() => handler.refs.current[0]?.focus()}>focus first</button>
        <input
          type="text"
          placeholder="custom pin"
          value={handler.value}
          onChange={event => handler.setValue(event.target.value)}
        />
      </>
    );
  },
  args: {
    controlled: true,
  },
};

/**
 * Characters can be formatted with a formatter `(char: string) => string`.
 */
export const Format: StoryObj<FC<Props & { formatEval: string }>> = {
  render: ({ formatEval, ...props }) => {
    try {
      let format = eval(formatEval);
      format("a");
      return <PinFieldV2 {...props} format={format} />;
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
 * Characters can be validated using the HTML input attribute `pattern`:
 */
export const HTMLInputAttributes: StoryObj<FC<Props & { formatAriaLabelEval: string }>> = {
  render: ({ formatAriaLabelEval, ...props }) => {
    try {
      let formatAriaLabel = eval(formatAriaLabelEval);
      formatAriaLabel(0, 0);
      return (
        <form>
          <div>
            <PinFieldV2 {...props} formatAriaLabel={formatAriaLabel} />
          </div>
          <button type="submit">submit</button>
        </form>
      );
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
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
    },
  },
  args: {
    type: "password",
    className: "pin-field",
    pattern: "[0-9]+",
    required: false,
    autoFocus: true,
    disabled: false,
    autoCorrect: "off",
    autoComplete: "off",
    dir: "ltr",
    formatAriaLabelEval: "(i, n) => `field ${i}/${n}`",
    ...defaultArgs,
  },
};

export default meta;
