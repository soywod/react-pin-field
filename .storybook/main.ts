import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  stories: ["../src/**/*.stories.tsx"],
};

export default config;
