# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Docs (readme, license, changelog)
- New event onReceiveKey
- End-to-end tests with Cypress

### Fixed

- Base system on evt.key instead of evt.keyCode, to avoid conflicts (uppercase/lowercase, numeric keypad) [#1]

[#1]: https://github.com/unfog-io/unfog-cli/issues/1
