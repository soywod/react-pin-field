# react-pin-field [![Build Status](https://travis-ci.org/soywod/react-pin-field.svg?branch=master)](https://travis-ci.org/soywod/react-pin-field) [![codecov](https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg)](https://codecov.io/gh/soywod/react-pin-field)

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

## Examples

Refer to the [live demo](https://react-pin-field.soywod.me) to see the result.

### Basic

```typescript
<PinField />
```

### With custom style

You can pass a custom `className`, a custom `style`, or override the CSS class
`.react-pin-field__input`. You have also access to `.react-pin-field__success`
when a key is resolved and `.react-pin-field__input--error` when a key is
rejected.

```typescript
<PinField
  style={{
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "1px solid gray",
    outline: "none",
    textAlign: "center",
    margin: 10,
  }}
/>
```

### With custom length

```typescript
<PinField length={3} />
```

### With custom validation

```typescript
<PinField validate="0123456789" />
<PinField validate={/^[0-9]$/} />
<PinField validate={key => "0123456789".indexOf(key) > -1} />
```

### With custom events

- onChange: when the code changes
- onComplete: when the code has been filled
- onResolveKey: when receive a good key
- onRejectKey: when receive a bad key

```typescript
<PinField
  onChange={handleChange}
  onComplete={handleComplete}
  onResolveKey={handleResolveKey}
  onRejectKey={handleRejectKey}
  format={k => k.toUpperCase()}
/>
```

### With custom InputHTMLAttributes

```typescript
<PinField type="password" autoFocus disabled={loading} />
```

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

TODO

### End-to-end tests

End-to-end tests are handled by [Cypress](https://www.cypress.io).

```bash
yarn start
yarn test:e2e
```

## Changelog

See [CHANGELOG.md](https://github.com/soywod/react-pin-field/blob/master/CHANGELOG.md)

## License

[MIT](https://github.com/soywod/react-pin-field/blob/master/LICENSE) -
Copyright (c) 2019 Clément DOUIN
