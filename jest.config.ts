import type { Config } from "jest";

export default {
  collectCoverage: true,
  testEnvironment: "jest-environment-jsdom",
  testRegex: ".(test|spec).tsx?$",
} satisfies Config;
