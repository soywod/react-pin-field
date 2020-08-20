# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2020-08-20

### Fixed

- tsconfig module type [#20]

## [1.0.3] - 2020-03-28

### Fixed

- Keep previous val on reject key [#16]

## [1.0.2] - 2020-03-27

### Fixed

- Missing delete key [#15]

## [1.0.1] - 2020-03-19

### Changed

- Add npm version badge and missing icons in docs
- Remove test files from npm pack

## [1.0.0] - 2020-03-15

### Added

- Docs (readme, license, changelog)
- New event onReceiveKey
- End-to-end tests with Cypress [#3]
- Handle clipboard paste [#11]
- Unit tests with Jest + Enzyme [#2]
- Right-to-left support [#9]
- Add ref support [#14]

### Fixed

- Base system on evt.key instead of evt.keyCode, to avoid conflicts (uppercase/lowercase, numeric keypad) [#1]
- Unnecessary re-renders (useMVU)
- Paste on MacOS [#13]

[unreleased]: https://github.com/unfog-io/unfog-cli/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/unfog-io/unfog-cli/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/unfog-io/unfog-cli/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/unfog-io/unfog-cli/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/unfog-io/unfog-cli/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/unfog-io/unfog-cli/releases/tag/v1.0.0

[#1]: https://github.com/unfog-io/unfog-cli/issues/1
[#2]: https://github.com/unfog-io/unfog-cli/issues/2
[#3]: https://github.com/unfog-io/unfog-cli/issues/3
[#9]: https://github.com/unfog-io/unfog-cli/issues/9
[#11]: https://github.com/unfog-io/unfog-cli/issues/11
[#13]: https://github.com/unfog-io/unfog-cli/issues/13
[#14]: https://github.com/unfog-io/unfog-cli/issues/14
[#15]: https://github.com/unfog-io/unfog-cli/issues/15
[#16]: https://github.com/unfog-io/unfog-cli/issues/16
[#20]: https://github.com/unfog-io/unfog-cli/issues/20
