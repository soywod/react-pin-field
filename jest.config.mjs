/**
 * @see https://jestjs.io/docs/configuration
 * @type {import("jest").Config}
 */
export default {
  collectCoverage: true,
  testEnvironment: "jest-environment-jsdom",
  testRegex: ".(test|spec).tsx?$",
};
