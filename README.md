# 📟 React PIN Field [![Build Status](https://travis-ci.org/soywod/react-pin-field.svg?branch=master)](https://travis-ci.org/soywod/react-pin-field) [![codecov](https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg)](https://codecov.io/gh/soywod/react-pin-field) [![npm](https://img.shields.io/npm/v/react-pin-field?label=npm)](https://www.npmjs.com/package/react-pin-field)

React component for entering PIN codes.

![gif](https://user-images.githubusercontent.com/10437171/111085791-36808100-8519-11eb-92e7-35eb293df5ab.gif)

*Live demo at https://react-pin-field.soywod.me.*


## Installation

```bash
yarn add react-pin-field
# or
npm install react-pin-field
```

## Usage

```typescript
import PinField from "react-pin-field"
```

## Props

```typescript
type PinFieldProps = {
  ref?: React.Ref<HTMLInputElement[]>
  length?: number
  validate?: string | string[] | RegExp | ((key: string) => boolean)
  format?: (char: string) => string
  onResolveKey?: (key: string, ref?: HTMLInputElement) => any
  onRejectKey?: (key: string, ref?: HTMLInputElement) => any
  onChange?: (code: string) => void
  onComplete?: (code: string) => void
} & React.InputHTMLAttributes<HTMLInputElement>

const defaultProps = {
  ref: {current: []},
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  onResolveKey: () => {},
  onRejectKey: () => {},
  onChange: () => {},
  onComplete: () => {},
}
```

### Ref

You can control each inputs with the PIN field ref:

```typescript
<PinField ref={ref} />

// Reset all inputs
ref.current.forEach(input => (input.value = ""))

// Focus one particular input
ref.current[2].focus()
```

### Style

React PIN Field can be styled either with `className` or `style`. You can also use pseudo-classes `:nth-of-type`, `:focus`, `:hover`, `:valid`, `:invalid`…

*The classes `-{index}`, `-focus`, `-success` and `-error` have been deprecated
(and are not used anymore) since the
[`v1.1.0`](https://github.com/soywod/react-pin-field/blob/master/CHANGELOG.md#110---2021-03-14).*

### Length

Length of the code (number of characters to type). Default: `5`.

### Validate

The validator prop can be:

- A string of allowed characters: `abcABC123`
- A list of allowed chars: `["a", "b", "c", "1", "2", "3"]`
- A RegExp: `/^[a-zA-Z0-9]$/`
- A function: `(char: string) => boolean`

### Format

Function called just before adding a new char to the code. For example, to set
the code to upper case: `(char: string) => char.toUpperCase()`

### Events

- onResolveKey: called when a char passes successfully the `validate` function
- onRejectKey: the opposite of `onResolveKey`
- onChange: called when the code changes
- onComplete: called when the code has been fully filled

## Examples

See the [live demo](https://react-pin-field.soywod.me).

## Development

```bash
git clone https://github.com/soywod/react-pin-field.git
cd react-pin-field
yarn install
```

To start the development server:

```bash
yarn start
```

To build the lib:

```bash
yarn build
```

To build the demo:

```bash
yarn build:demo
```

## Tests

### Unit tests

Unit tests are handled by [Jest](https://jestjs.io/) (`.test` files) and
[Enzyme](https://airbnb.io/enzyme/) (`.spec` files).

```bash
yarn test:unit
```

### End-to-end tests

End-to-end tests are handled by [Cypress](https://www.cypress.io) (`.e2e`
files).

```bash
yarn start
yarn test:e2e
```
