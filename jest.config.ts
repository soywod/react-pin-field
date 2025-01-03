import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testRegex: ".(test|spec).tsx?$",
};

export default config;
