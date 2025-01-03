import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { PinFieldV2, defaultProps, Props } from "./pin-field-v2";

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

export default meta;
