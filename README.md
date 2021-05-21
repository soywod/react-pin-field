# 📟 React PIN Field
[![npm](https://img.shields.io/npm/v/react-pin-field?label=npm)](https://www.npmjs.com/package/react-pin-field)

React PIN Field is a React wrapper for [PIN
Field](https://github.com/soywod/pin-field), a native web component for
entering PIN codes.

![gif](https://user-images.githubusercontent.com/10437171/112440937-2e131c00-8d4b-11eb-902c-9aa6b37973be.gif)

*Live demo at https://soywod.github.io/pin-field/demo/.*

## Installation

```sh
npm install react react-dom @soywod/pin-field react-pin-field
# or
yarn add react react-dom @soywod/pin-field react-pin-field
```

## Usage

```typescript
import ReactPinField from "react-pin-field"
```

## Props

```typescript
type ReactPinFieldProps = {
  length?: number;
  validate?: string | string[] | RegExp | ((key: string) => boolean);
  format?: (char: string) => string;
  onResolveKey?: (key: string, ref?: HTMLInputElement) => any;
  onRejectKey?: (key: string, ref?: HTMLInputElement) => any;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>

const defaultProps: ReactPinFieldProps = {
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

You can access the PIN field web component via the ref:

```typescript
<ReactPinField ref={ref} />

// Reset all inputs
ref.current.inputs.forEach(input => (input.value = ""))

// Focus one particular input
ref.current.inputs[2].focus()
```

### Style

React PIN Field can be styled either with `className` or `style`. You can also use pseudo-classes `:nth-of-type`, `:focus`, `:hover`, `:valid`, `:invalid`…

### Length

Length of the code (number of characters to type). Default: `5`.

### Validate

The validator prop can be:

- A string of allowed characters: `abcABC123`
- A list of allowed chars: `["a", "b", "c", "1", "2", "3"]`
- A RegExp: `/^[a-zA-Z0-9]$/`
- A function: `(char: string) => boolean`

### Format

The formatter allows you to format the code. For example, to set the code to
upper case: `(char: string) => char.toUpperCase()`

### Events

- `onResolveKey`: triggered when a char passes successfully the validator
- `onRejectKey`: the opposite of `onResolveKey`
- `onChange`: triggered when the code changes
- `onComplete`: triggered when the code has been completed

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
