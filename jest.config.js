module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-enzyme"],
  testEnvironment: "enzyme",
  testRegex: ".(test|spec).tsx?$",
}
