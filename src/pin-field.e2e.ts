const field = "[data-cy=pin-field]"
const nthInput = (n: number) => `${field}:nth-of-type(${n})`

describe("Pin field", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should have correct structure", () => {
    cy.get(field).should("have.have.length", 5)
    cy.get(nthInput(1)).should("have.class", "react-pin-field__input")
    cy.get(nthInput(2)).should("have.class", "react-pin-field__input")
    cy.get(nthInput(3)).should("have.class", "react-pin-field__input")
    cy.get(nthInput(4)).should("have.class", "react-pin-field__input")
    cy.get(nthInput(5)).should("have.class", "react-pin-field__input")
  })

  it("should override chars", () => {
    cy.get(nthInput(1))
      .type("a{leftArrow}b{leftArrow}c")
      .should("have.value", "c")
  })

  it("should focus next input on allowed entry", () => {
    cy.get(nthInput(1)).type("abcde")

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "b")
    cy.get(nthInput(3))
      .should("not.be.focused")
      .should("have.value", "c")
    cy.get(nthInput(4))
      .should("not.be.focused")
      .should("have.value", "d")
    cy.get(nthInput(5))
      .should("be.focused")
      .should("have.value", "e")
  })

  it("should not focus next input on denied entry", () => {
    cy.get(nthInput(1)).type("ab-_*c=d$|")

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "b")
    cy.get(nthInput(3))
      .should("not.be.focused")
      .should("have.value", "c")
    cy.get(nthInput(4))
      .should("not.be.focused")
      .should("have.value", "d")
    cy.get(nthInput(5))
      .should("be.focused")
      .should("have.value", "")
  })

  it("should remove chars on backspace", () => {
    cy.get(nthInput(1)).type("abc{backspace}{backspace}d")

    cy.get(nthInput(1))
      .should("not.be.focused")
      .should("have.value", "a")
    cy.get(nthInput(2))
      .should("not.be.focused")
      .should("have.value", "d")
    cy.get(nthInput(3))
      .should("be.focused")
      .should("have.value", "")
    cy.get(nthInput(4))
      .should("not.be.focused")
      .should("have.value", "")
    cy.get(nthInput(5))
      .should("not.be.focused")
      .should("have.value", "")
  })
})
