# Setup development environment

[back](../README.md)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Preparation

- Install Node.js (preferably using [NVM](https://github.com/creationix/nvm))
- Clone this repository
- Execute `npm install`
- You're good to go

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

_Important note for IE 11 testing:_ the dev server has to be started with `npm run start:es5`, since `ng serve` [does not build the bundles for differential loading](https://github.com/angular/angular-cli/issues/14455) (it generates a single ES2015 build per default). Consider also: https://angular.io/guide/browser-support

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `npm run build:prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
