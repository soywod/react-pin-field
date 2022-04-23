const field = "[data-cy=pin-field]";
const nthInput = (n: number) => `${field}:nth-of-type(${n})`;

describe("Pin field", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have correct structure", () => {
    cy.get(field).should("have.have.length", 5);
    cy.get(nthInput(1))
      .should("have.class", "a-reactPinField__input")
      .should("have.class", "-0")
      .should("not.have.class", "-success")
      .should("not.have.class", "-error");
    cy.get(nthInput(2))
      .should("have.class", "-1")
      .should("have.class", "a-reactPinField__input")
      .should("not.have.class", "-success")
      .should("not.have.class", "-error");
    cy.get(nthInput(3))
      .should("have.class", "-2")
      .should("have.class", "a-reactPinField__input")
      .should("not.have.class", "-success")
      .should("not.have.class", "-error");
    cy.get(nthInput(4))
      .should("have.class", "-3")
      .should("have.class", "a-reactPinField__input")
      .should("not.have.class", "-success")
      .should("not.have.class", "-error");
    cy.get(nthInput(5))
      .should("have.class", "-4")
      .should("have.class", "a-reactPinField__input")
      .should("not.have.class", "-success")
      .should("not.have.class", "-error");
  });

  it("should override chars", () => {
    cy.get(nthInput(1)).type("a{leftArrow}b{leftArrow}c").should("have.value", "c");
  });

  it("should focus next input on allowed entry", () => {
    cy.get(nthInput(1)).type("abcde");

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "b")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(3))
      .should("not.be.focused")
      .should("have.value", "c")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(4))
      .should("not.be.focused")
      .should("have.value", "d")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(5))
      .should("be.focused")
      .should("have.value", "e")
      .should("have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
  });

  it("should not focus next input on denied entry", () => {
    cy.get(nthInput(1)).type("ab-_*c=d{leftArrow}$|");

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
      .should("not.have.class", "-focus")
      .should("have.class", "-success")
      .should("not.have.class", "-error");
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "b")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(3))
      .should("not.be.focused")
      .should("have.value", "c")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(4))
      .should("be.focused")
      .should("have.value", "d")
      .should("have.class", "-focus")
      .should("have.class", "-error")
      .should("not.have.class", "-success");
    cy.get(nthInput(5))
      .should("not.be.focused")
      .should("have.value", "")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("not.have.class", "-success");
  });

  it("should remove chars on backspace or delete", () => {
    cy.get(nthInput(1)).type("abc{backspace}{del}defg{backspace}");

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "d")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(3))
      .should("not.be.focused")
      .should("have.value", "e")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(4))
      .should("not.be.focused")
      .should("have.value", "f")
      .should("not.have.class", "-focus")
      .should("not.have.class", "-error")
      .should("have.class", "-success");
    cy.get(nthInput(5))
      .should("be.focused")
      .should("have.value", "")
      .should("have.class", "-focus")
      .should("not.have.class", "-error")
      .should("not.have.class", "-success");
  });
});