# 📟 React PIN Field [![Build Status](https://travis-ci.org/soywod/react-pin-field.svg?branch=master)](https://travis-ci.org/soywod/react-pin-field) [![codecov](https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg)](https://codecov.io/gh/soywod/react-pin-field) [![npm](https://img.shields.io/npm/v/react-pin-field?label=npm)](https://www.npmjs.com/package/react-pin-field)

React component for entering PIN codes.

![gif](https://user-images.githubusercontent.com/10437171/70847884-f9d35f00-1e69-11ea-8152-1c70eda12137.gif)

*Live demo at https://soywod.github.io/react-pin-field/.*

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

### Reference

Every input can be controlled thanks to the React reference:

```typescript
<PinField ref={ref} />

// reset all inputs
ref.current.forEach(input => (input.value = ""))

// focus the third input
ref.current[2].focus()
```

### Style

The pin field can be styled either with `style` or `className`. This
last one allows you to use pseudo-classes like `:nth-of-type`,
`:focus`, `:hover`, `:valid`, `:invalid`…

### Length

Length of the code (number of characters).

### Validate

Characters can be validated with a validator. A validator can take the
form of:

 - a String of allowed characters: `abcABC123`
 - an Array of allowed characters: `["a", "b", "c", "1", "2", "3"]`
 - a RegExp: `/^[a-zA-Z0-9]$/`
 - a predicate: `(char: string) => boolean`

### Format

Characters can be formatted with a formatter `(char: string) =>
string`.

### Events

- `onResolveKey`: when a key passes the validator
- `onRejectKey`: when a key is rejected by the validator
- `onChange`: when the code changes
- `onComplete`: when the code has been fully filled

## Examples

See the [live demo](https://soywod.github.io/react-pin-field/).

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

## Sponsoring

[![github](https://img.shields.io/badge/-GitHub%20Sponsors-fafbfc?logo=GitHub%20Sponsors)](https://github.com/sponsors/soywod)
[![paypal](https://img.shields.io/badge/-PayPal-0079c1?logo=PayPal&logoColor=ffffff)](https://www.paypal.com/paypalme/soywod)
[![ko-fi](https://img.shields.io/badge/-Ko--fi-ff5e5a?logo=Ko-fi&logoColor=ffffff)](https://ko-fi.com/soywod)
[![buy-me-a-coffee](https://img.shields.io/badge/-Buy%20Me%20a%20Coffee-ffdd00?logo=Buy%20Me%20A%20Coffee&logoColor=000000)](https://www.buymeacoffee.com/soywod)
[![liberapay](https://img.shields.io/badge/-Liberapay-f6c915?logo=Liberapay&logoColor=222222)](https://liberapay.com/soywod)
