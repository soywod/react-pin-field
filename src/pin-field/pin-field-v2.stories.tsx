import { FC, StrictMode as ReactStrictMode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { PinFieldV2, defaultProps, Props, usePinField } from "./pin-field-v2";

const defaultArgs = {
  length: defaultProps.length,
  // onResolveKey: fn(),
  // onRejectKey: fn(),
  // onChange: fn(),
  // onComplete: fn(),
} satisfies Props;

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

export const StrictMode: StoryObj<typeof PinFieldV2> = {
  render: props => (
    <ReactStrictMode>
      <PinFieldV2 {...props} />
    </ReactStrictMode>
  ),
  args: defaultArgs,
};

export const Controlled: StoryObj<typeof PinFieldV2> = {
  render: props => {
    const handler = usePinField();

    return (
      <>
        <div>
          <PinFieldV2 {...props} handler={handler} />
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
  args: defaultArgs,
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

export default meta;
