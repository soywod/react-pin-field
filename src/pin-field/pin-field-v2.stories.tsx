import { StrictMode as ReactStrictMode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { PinFieldV2, defaultProps, Props, usePinField } from "./pin-field-v2";

const defaultArgs = {
  length: defaultProps.length,
  onResolveKey: fn(),
  onRejectKey: fn(),
  onChange: fn(),
  onComplete: fn(),
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
    const handler = usePinField(props.length);

    return (
      <>
        <PinFieldV2 {...props} handler={handler} />
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

export default meta;
