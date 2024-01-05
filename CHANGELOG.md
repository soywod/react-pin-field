# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a
Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.5] - 2024-01-05

### Changed

- Upgraded all packages.
- Improved accessibility [#84].

## [3.1.4] - 2023-09-09

### Fixed

- Fixed pasting code on Firefox Android [#63].

## [3.1.3] - 2023-02-09

### Changed

- Upgraded all packages and license year.

## [3.1.2] - 2022-12-13

### Fixed

- Fixed CI publish script.

## [3.1.1] - 2022-12-13

### Fixed

- Fixed local `dir` prop override [#71].

## [3.1.0] - 2022-12-13

### Changed

- Upgraded all packages to the latest versions (react 18.2, node 18.12, cypress 10.10).

## [3.0.16] - 2022-07-05

### Fixed

- Fixed swipe style keyboard entry [#62].
- ~~Fixed pasting code from messages on iOS [#63].~~

## [3.0.15] - 2022-06-12

### Changed

- Upgraded `react-use-bireducer` to the latest version.

### Fixed

- Fixed README tests section.
- Fixed CHANGELOG links.

## [3.0.14] - 2022-05-27

### Changed

- Model-view-updater (as known as `mvu` in the code) is now handled by the lib [react-use-bireducer](https://github.com/soywod/react-use-bireducer).
- Upgraded all packages to the latest version.

## [3.0.13] - 2022-05-24

### Added

- Added tests in CI.

### Changed

- Updated readme badges.

### Fixed

- Fixed broken links in the readme.

## [3.0.12] - 2022-05-23

### Deprecated

- Deprecated the `debug` mode (no longer exists).

## [3.0.11] - 2022-05-22

Revert the lib state from `v1.0.6`. The native web component used in the `v2.0.0` was too hard to maintain. It led to many issues.

## [2.0.0-beta.0] - 2021-04-15

React PIN Field is now a React wrapper for [PIN Field](https://github.com/soywod/pin-field), a native web component for entering PIN codes.

### Changed

- `@soywod/pin-field` needs to be installed, since it became a peer dependency of React PIN Field.
- The ref contains now an instance of the class [`PinField`](https://github.com/soywod/pin-field/blob/master/lib/pin-field.ts). Inputs are accessible via the `inputs` prop.

## [1.1.0] - 2021-03-14

### Fixed

- Added support for all browsers [#19] and mobile [#26].

### Deprecated

- Deprecated classes `-{index}`, `-focus`, `-success` and `-error` (replaced by standard pseudo-classes `:nth-of-type`, `:focus`, `:valid` and `:invalid`).

## [1.0.6] - 2021-02-10

### Changed

- Upgraded React version to `^17` [#23].

## [1.0.5] - 2020-10-02

### Removed

- Removed lodash.

## [1.0.4] - 2020-08-20

### Fixed

- Fixed tsconfig module type [#20].

## [1.0.3] - 2020-03-28

### Fixed

- Kept previous val on reject key [#16].

## [1.0.2] - 2020-03-27

### Fixed

- Fixed missing delete key [#15].

## [1.0.1] - 2020-03-19

### Changed

- Added npm version badge and missing icons in docs.
- Remove test files from npm pack.

## [1.0.0] - 2020-03-15

### Added

- Added docs (readme, license, changelog).
- Adedd new event onReceiveKey.
- Added end-to-end tests with Cypress [#3].
- Added unit tests with Jest + Enzyme [#2].
- Handled clipboard paste event [#11].
- Added Right-to-left support [#9].
- Added ref support [#14].

### Fixed

- Fixed base system on evt.key instead of evt.keyCode, to avoid
  conflicts (uppercase/lowercase, numeric keypad) [#1].
- Fixed unnecessary re-renders (useMVU).
- Fixed paste on MacOS [#13].

[unreleased]: https://github.com/soywod/react-pin-field/compare/v3.1.3...HEAD
[3.1.3]: https://github.com/soywod/react-pin-field/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/soywod/react-pin-field/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/soywod/react-pin-field/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/soywod/react-pin-field/compare/v3.0.16...v3.1.0
[3.0.16]: https://github.com/soywod/react-pin-field/compare/v3.0.15...v3.0.16
[3.0.15]: https://github.com/soywod/react-pin-field/compare/v3.0.14...v3.0.15
[3.0.14]: https://github.com/soywod/react-pin-field/compare/v3.0.13...v3.0.14
[3.0.13]: https://github.com/soywod/react-pin-field/compare/v3.0.12...v3.0.13
[3.0.12]: https://github.com/soywod/react-pin-field/compare/v3.0.11...v3.0.12
[3.0.11]: https://github.com/soywod/react-pin-field/compare/v2.0.0-beta.0...v3.0.11
[2.0.0-beta.0]: https://github.com/soywod/react-pin-field/compare/v1.1.0...v2.0.0-beta.0
[1.1.0]: https://github.com/soywod/react-pin-field/compare/v1.0.6...v1.1.0
[1.0.6]: https://github.com/soywod/react-pin-field/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/soywod/react-pin-field/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/soywod/react-pin-field/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/soywod/react-pin-field/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/soywod/react-pin-field/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/soywod/react-pin-field/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/soywod/react-pin-field/releases/tag/v1.0.0

[#1]: https://github.com/soywod/react-pin-field/issues/1
[#2]: https://github.com/soywod/react-pin-field/issues/2
[#3]: https://github.com/soywod/react-pin-field/issues/3
[#9]: https://github.com/soywod/react-pin-field/issues/9
[#11]: https://github.com/soywod/react-pin-field/issues/11
[#13]: https://github.com/soywod/react-pin-field/issues/13
[#14]: https://github.com/soywod/react-pin-field/issues/14
[#15]: https://github.com/soywod/react-pin-field/issues/15
[#16]: https://github.com/soywod/react-pin-field/issues/16
[#19]: https://github.com/soywod/react-pin-field/issues/19
[#20]: https://github.com/soywod/react-pin-field/issues/20
[#23]: https://github.com/soywod/react-pin-field/issues/23
[#26]: https://github.com/soywod/react-pin-field/issues/26
[#62]: https://github.com/soywod/react-pin-field/issues/62
[#63]: https://github.com/soywod/react-pin-field/issues/63
[#71]: https://github.com/soywod/react-pin-field/issues/71
[#84]: https://github.com/soywod/react-pin-field/pull/84
