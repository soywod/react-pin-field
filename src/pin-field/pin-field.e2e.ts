const field = "[data-cy=pin-field]";
const nthInput = (n: number) => `${field}:nth-of-type(${n})`;

describe("PIN Field", () => {
  beforeEach(() => {
    cy.visit("/iframe.html", {
      qs: {
        id: "pinfield--default",
        viewMode: "story",
      },
    });
  });

  it("should adjust focus according to state's cursor", () => {
    cy.get(nthInput(1)).type("abc");
    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "b");
    cy.get(nthInput(3)).should("not.be.focused").should("have.value", "c");
    cy.get(nthInput(4)).should("be.focused").should("have.value", "");

    cy.get("body").type("def");
    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "b");
    cy.get(nthInput(3)).should("not.be.focused").should("have.value", "c");
    cy.get(nthInput(4)).should("not.be.focused").should("have.value", "d");
    cy.get(nthInput(5)).should("be.focused").should("have.value", "f");
  });

  it.only("should remove values on backspace", () => {
    cy.get(nthInput(1)).focus();
    cy.focused().type("abc{backspace}");
    // A second backspace is needed due to event.isTrusted = false.
    // From a user interaction, only 1 backspace is needed
    cy.focused().type("{backspace}");
    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "b");
    cy.get(nthInput(3)).should("be.focused").should("have.value", "");
  });
});
