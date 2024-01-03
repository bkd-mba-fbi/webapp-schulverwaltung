[back](../README.md)

# Setup & Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Getting Started

Preparation:

- Install Node.js (preferably using [NVM](https://github.com/creationix/nvm)).
- Clone this repository.
- Execute `nvm use` to enable the correct Node version.
- Execute `npm install` to install the dependencies.
- Copy [src/settings.example.js](../src/settings.example.js) to `src/settings.js` and adjust its contents.
- You're good to go 🚀

Start the development server:

```
npm start
```

The application is then running on http://localhost:4200.

To be able to make authenticated requests to the API, the OAuth access token has to be available in localStorage (or sessionStorage) under the key `CLX.LoginToken` (by setting `localStorage.setItem("CLX.LoginToken", "ey...")`). If not provided, the application displays an unauthenticated message to the user.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Build the project:

```
npm run build
```

Or for a production build:

```
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

If you have cloned the [event-portal](https://github.com/bkd-mba-fbi/evento-portal/) repository to `../evento-portal` relative to this repository (i.e. into the same directory), you can run the following to build and copy the application to the _Evento Portal_ for testing it integrated:

```
npm run build-and-copy-local
```

Visualize the contents of the generated bundle by running:

```
npm run analyze
```

## Linting & Testing

### Linting & Checks

Check source files with [ESLint](https://eslint.org/) (for the configuration, see [.eslintrc.json](./.eslintrc.json)):

```
npm run lint
```

Print a report of unused dependencies, files & exports using [Knip](https://github.com/webpro/knip) (for the configuration, see [.knip.json](../.knip.json)):

```
npm run unused
```

### Unit tests

Execute the unit tests via [Karma](https://karma-runner.github.io):

```
npm test
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
