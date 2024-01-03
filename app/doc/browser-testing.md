[back](../README.md)

# Browser Testing

## Requirements

We support the evergreen browsers (Chrome, Firefox, Safari, Edge).

## BrowserStack.com

### Live Testing

When testing browser compatibility with [BrowserStack](https://www.browserstack.com/), consider the following combination of Dev Server and URL to use.

| OS        | Browser               | Dev Server                   | URL                        |
| --------- | --------------------- | ---------------------------- | -------------------------- |
| Windows   | Chrome, Firefox, Edge | `npm start`                  | `http://localhost:4200`    |
| Android   | Chrome                | `npm start`                  | `http://localhost:4200`    |
| macOS/iOS | Safari                | `npm run start:browserstack` | `http://bs-local.com:8000` |

### Authentication

With all browsers you must store a valid token in localStorage to be able to use the app.
