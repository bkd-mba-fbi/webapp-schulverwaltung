[back](../README.md)

# Setup & Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Getting Started

Preparation:

- Clone this repository.
- Use [mise](https://mise.jdx.dev/) or [nvm](https://github.com/nvm-sh/nvm) (with `nvm use`) to install/activate the project's Node.js version.
- Install Corepack and activate PNPM:

```bash
npm install --global corepack@latest
corepack enable pnpm
```

- Execute `pnpm install` to install the dependencies.
- Copy [src/settings.example.js](../src/settings.example.js) to `src/settings.js` and adjust its contents.
- You're good to go 🚀

Start the development server:

```
pnpm start
```

The application is then running on http://localhost:4200.

To be able to make authenticated requests to the API, the OAuth access token has to be available in localStorage (or sessionStorage) under the key `CLX.LoginToken` (by setting `localStorage.setItem("CLX.LoginToken", "ey...")`). If not provided, the application displays an unauthenticated message to the user.

For local OAuth login, provide `dev.auth.json` at `http://localhost:4200/dev.auth.json` with `OAuthServer`, `Instance`, and `ClientId` string properties. The **Get token** controls use the scope claim from the stored JWT to set the initial selection when available; without a token, the first dropdown option is selected. Choose `Tutoring`, `Public`, or `NG` to select a scope for the next login. The controls are shown only on `localhost` when the configuration is available. Login uses the authorization code flow with PKCE (`response_type=code`, `code_challenge_method=s256`) and the current page URL without its route hash as `redirectUrl`; this URL must be registered for the OAuth consumer. The selected scope is sent as `application_scope`. On return, the code is exchanged with a JSON `POST` to `{OAuthServer}/Token` using `grant_type=authorization_code`, `code`, and `code_verifier`. The access token is stored in `sessionStorage` under `CLX.LoginToken`, and the previous application route is restored. **View token** decodes and formats the JWT payload in a modal; the modal also provides local deletion and remote revocation via `POST {OAuthServer}/Authorization/{Instance}/Logout`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Build the project:

```
pnpm run build
```

Or for a production build:

```
pnpm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

If you have cloned the [event-portal](https://github.com/bkd-mba-fbi/evento-portal/) repository to `../evento-portal` relative to this repository (i.e. into the same directory), you can run the following to build and copy the application to the _Evento Portal_ for testing it integrated:

```
pnpm run build-and-copy-local
```

Visualize the contents of the generated bundle by running:

```
pnpm run analyze
```

## Linting & Testing

### Linting & Checks

Check source files with [ESLint](https://eslint.org/) (for the configuration, see [.eslintrc.json](./.eslintrc.json)):

```
pnpm run lint
```

Print a report of unused dependencies, files & exports using [Knip](https://github.com/webpro/knip) (for the configuration, see [.knip.json](../.knip.json)):

```
pnpm run unused
```

### Unit tests

Execute the unit tests via [Karma](https://karma-runner.github.io):

```
pnpm test
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
