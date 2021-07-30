# Browser support

[back](../README.md)

We support the evergreen browsers (Chrome, Firefox, Safari, Edge).

## Testing with BrowserStack

When testing browser compatiblity with [BrowserStack](https://www.browserstack.com/), consider the following combination of Dev Server and URL to use.

| OS        | Browser               | Dev Server                   | URL                        |
| --------- | --------------------- | ---------------------------- | -------------------------- |
| Windows   | Chrome, Firefox, Edge | `npm start`                  | `http://localhost:4200`    |
| Android   | Chrome                | `npm start`                  | `http://localhost:4200`    |
| macOS/iOS | Safari                | `npm run start:browserstack` | `http://bs-local.com:8000` |

With all browsers you must store a valid token in localStorage to be able to use the app.
