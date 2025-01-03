import "cypress";

export default {
  fixturesFolder: false,
  video: false,
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    baseUrl: "http://localhost:3000",
    specPattern: "src/**/*.e2e.ts",
    supportFile: false,
  },
} satisfies Cypress.ConfigOptions;
