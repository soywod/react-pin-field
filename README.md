# 📟 React PIN Field [![Build Status](https://travis-ci.org/soywod/react-pin-field.svg?branch=master)](https://travis-ci.org/soywod/react-pin-field) [![codecov](https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg)](https://codecov.io/gh/soywod/react-pin-field) [![npm](https://img.shields.io/npm/v/react-pin-field?label=npm)](https://www.npmjs.com/package/react-pin-field)

React component for entering PIN codes.

![gif](https://user-images.githubusercontent.com/10437171/70847884-f9d35f00-1e69-11ea-8152-1c70eda12137.gif)

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
  className?: string
  length?: number
  validate?: string | string[] | RegExp | ((key: string) => boolean)
  format?: (char: string) => string
  onResolveKey?: (key: string, ref?: HTMLInputElement) => any
  onRejectKey?: (key: string, ref?: HTMLInputElement) => any
  onChange?: (code: string) => void
  onComplete?: (code: string) => void
  style?: React.CSSProperties
} & React.InputHTMLAttributes<HTMLInputElement>

const defaultProps = {
  ref: {current: []},
  className: "",
  length: 5,
  validate: /^[a-zA-Z0-9]$/,
  format: key => key,
  onResolveKey: () => {},
  onRejectKey: () => {},
  onChange: () => {},
  onComplete: () => {},
  style: {},
}
```

### Ref

Every input can be controlled thanks to the React ref:

```typescript
<PinField ref={ref} />

// reset all inputs
ref.current.forEach(input => (input.value = ""))

// focus the third input
ref.current[2].focus()
```

### Style

The pin field can be styled either with `className` or `style`. You
can also use pseudo-classes `:nth-of-type`, `:focus`, `:hover`,
`:valid`, `:invalid`…

### Length

Length of the code (number of characters to type).

### Validate

Key validator. It can be a:

- String of allowed characters: `abcABC123`
- Array of allowed characters: `["a", "b", "c", "1", "2", "3"]`
- RegExp: `/^[a-zA-Z0-9]$/`
- Predicate: `(char: string) => boolean`

Default: `/^[a-zA-Z0-9]$/`.

### Format

Key formatter. It is called every type a key is typed. For example, to
set the code to upper case: `(char: string) => char.toUpperCase()`.

Default: `(char: string) => char`.

### Events

- `onResolveKey`: when a key passes successfully the validator
- `onRejectKey`: when a key is rejected by the validator
- `onChange`: when the code changes
- `onComplete`: when the code has been fully filled

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

Unit tests are handled by [Jest](https://jestjs.io/) (`.test` files)
and [Enzyme](https://airbnb.io/enzyme/) (`.spec` files).

```bash
yarn test:unit
```

### End-to-end tests

End-to-end tests are handled by [Cypress](https://www.cypress.io)
(`.e2e` files).

```bash
yarn start
yarn test:e2e
```
