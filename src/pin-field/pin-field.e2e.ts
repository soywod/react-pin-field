const field = "[data-cy=pin-field]";
const nthInput = (n: number) => `${field}:nth-of-type(${n})`;

describe("PIN Field", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should override chars", () => {
    cy.get(nthInput(1)).type("a{leftArrow}b{leftArrow}c").should("have.value", "c");
  });

  it("should focus next input on allowed entry", () => {
    cy.get(nthInput(1)).type("abcde");

    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "b");
    cy.get(nthInput(3)).should("not.be.focused").should("have.value", "c");
    cy.get(nthInput(4)).should("not.be.focused").should("have.value", "d");
    cy.get(nthInput(5)).should("be.focused").should("have.value", "e");
  });

  it("should not focus next input on denied entry", () => {
    cy.get(nthInput(1)).type("ab-_*c=d{leftArrow}$|");

    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "b");
    cy.get(nthInput(3)).should("not.be.focused").should("have.value", "c");
    cy.get(nthInput(4)).should("be.focused").should("have.value", "d");
    cy.get(nthInput(5)).should("not.be.focused").should("have.value", "");
  });

  it("should remove chars on backspace or delete", () => {
    cy.get(nthInput(1)).type("abc{backspace}{del}defg{backspace}");

    cy.get(nthInput(1)).should("not.be.focused").should("have.value", "a");
    cy.get(nthInput(2)).should("not.be.focused").should("have.value", "d");
    cy.get(nthInput(3)).should("not.be.focused").should("have.value", "e");
    cy.get(nthInput(4)).should("not.be.focused").should("have.value", "f");
    cy.get(nthInput(5)).should("be.focused").should("have.value", "");
  });
});
