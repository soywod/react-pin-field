# React PIN Field [![Build Status](https://travis-ci.org/soywod/react-pin-field.svg?branch=master)](https://travis-ci.org/soywod/react-pin-field) [![codecov](https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg)](https://codecov.io/gh/soywod/react-pin-field)

A React component for entering PIN codes.

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

You can control each inputs with the PIN field ref:

```typescript
<PinField ref={ref} />

// To reset the PIN field
ref.current.forEach(input => (input.value = ""))

// To focus one particular input
ref.current[2].focus()
```

### Style

React PIN field follows the [ABEM
convention](https://css-tricks.com/abem-useful-adaptation-bem/). Each input has a class named `a-reactPinField__input`, plus:

  - `-{index}` where index is the position of the input. Eg: `-0` for the first input, `-2` for the third etc.
  - `-focus` when the current input is focused.
  - `-success` when a key is resolved.
  - `-error` when a key is rejected.

You can also pass a custom `className` or a custom `style`.

### Length

Length of the code (number of characters to type). Default: `5`.

### Validate

Hook called to validate a char. It can be:

- A string of allowed characters: `abcABC123`
- A list of allowed chars: `["a", "b", "c", "1", "2", "3"]`
- A RegExp: `/^[a-zA-Z0-9]$/`
- A function: `(char: string) => boolean`

### Format

Hook called before adding a new char to the code. For example, to set the code
to upper case: `(char: string) => char.toUpperCase()`

### Events

- onResolveKey: called when a char passes successfully the `validate` function
- onRejectKey: the opposite of `onResolveKey`
- onChange: called when the code changes
- onComplete: called when the code has been filled

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

To build the demo:

```bash
yarn build:demo
```

To build the lib:

```bash
yarn build:lib
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

## Changelog

See [CHANGELOG.md](https://github.com/soywod/react-pin-field/blob/master/CHANGELOG.md)

## License

[MIT](https://github.com/soywod/react-pin-field/blob/master/LICENSE) -
Copyright (c) 2019 Clément DOUIN
