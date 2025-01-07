# Contributing guide

Thank you for investing your time in contributing to React PIN Field!

## Development

The development environment is managed by [Nix](https://nixos.org/download.html).
Running `nix-shell` will spawn a shell with everything you need to get started with the lib.

If you do not want to use Nix, you can just install manually the following dependencies:

- [Node.js](https://nodejs.org/en) (`v20.18`)
- [Cypress](https://www.cypress.io/) (`v13.13.2`)

## Installation

```
npm install
```

## Usage

To run the demo locally, on a random port:

```
npm start
```

To run the demo locally, on a custom port:

```
npm start -p 3000
```

To build the demo:

```
npm run storybook:build
```

To build the lib:

```
npm run build
```

## Unit tests

Unit tests are handled by [Jest](https://jestjs.io/) (`.test` files).

```
npm run test:unit
```

## End-to-end tests

End-to-end tests are handled by [Cypress](https://www.cypress.io) (`.e2e` files).

You need first to start a Storybook locally, on the port `3000`:

```
npm start -p 3000
```

Then in another terminal:

```
npm run test:e2e
```

## Commit style

Starting from the `v4.0.0`, React PIN Field tries to adopt the [conventional commits specification](https://github.com/conventional-commits/conventionalcommits.org).
