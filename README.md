# webapp-schulverwaltung

[![Lint & Test](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/test.yml)
[![Build, Integrate & ZIP](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/build.yml/badge.svg)](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/build.yml)
[![SBOM](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/bom.yml/badge.svg?branch=main)](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/bom.yml)

JavaScript web module to implement processes for school administration using the SLH.Evento backend (REST API).

This project is realized with [Angular](https://angular.io/), [Bootstrap](https://getbootstrap.com/) and [io-ts](https://github.com/gcanti/io-ts). It is open source software, licensed under the terms of the [MIT license](./LICENSE).

Download the [latest build](https://bkd-mba-fbi.github.io/webapp-schulverwaltung/webapp-schulverwaltung.zip) or checkout the [Demo](https://bkd-mba-fbi.github.io/webapp-schulverwaltung/app).

## Documentation

### Evento Portal

Although it can be used standalone during development, the _webapp-schulverwaltung_ is embedded in the [Evento Portal](https://github.com/bkd-mba-fbi/evento-portal) and developed by the same team, therefore the documentation of the _Evento Portal_ is relevant for this project to a large extent too, especially the following documents:

- [Software Architecture Documentation (SAD)](https://github.com/bkd-mba-fbi/evento-portal/blob/main/doc/sad.md)
- [App Integration & API](https://github.com/bkd-mba-fbi/evento-portal/blob/main/doc/app-integration.md) – Providing of the OAuth tokens etc.
- [Git Workflow](https://github.com/bkd-mba-fbi/evento-portal/blob/main/doc/git.md) – Branching (except the release branches) & commit messages
- [Prettier](https://github.com/bkd-mba-fbi/evento-portal/blob/main/doc/prettier.md) – Source code formatting

### General

- [Wiki](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/wiki) – Common topics

### Development

- [Setup & Development](doc/development.md) – Start local development, run linting & tests
- [Internationalization (i18n)](doc/i18n.md) – Translating texts
- [Browser Testing](doc/browser-testing.md) – Support & BrowserStack.com
- [Data Decoding with io-ts](doc/io-ts.md) – API data contract
- [Reactivity](doc/reactivity.md) – Dos and don'ts when using signals & observables
