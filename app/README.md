# Absenzenmanagement

[![Build Status](https://travis-ci.com/bkd-mba-fbi/absenzenmanagement.svg?branch=master)](https://travis-ci.com/bkd-mba-fbi/absenzenmanagement)
[![lint test ✨](https://github.com/bkd-mba-fbi/absenzenmanagement/actions/workflows/lintAndTest.yml/badge.svg?branch=master)](https://github.com/bkd-mba-fbi/absenzenmanagement/actions/workflows/lintAndTest.yml)
[![build 🏭 deploy 🚀](https://github.com/bkd-mba-fbi/absenzenmanagement/actions/workflows/buildDeploy.yml/badge.svg)](https://github.com/bkd-mba-fbi/absenzenmanagement/actions/workflows/buildDeploy.yml)

JavaScript web module to implement the process "Absenzenverwaltung"
using the CLX.Evento backend (REST API).

[Demo](https://bkd-mba-fbi.github.io/absenzenmanagement/app)

## Integration

Download the [latest build](https://bkd-mba-fbi.github.io/absenzenmanagement/absenzenmanagement.zip).

To integrate this application in your website, you have to copy and
paste the import of the `settings.js` and the CSS files from
`index.html`'s `<head>`:

```
<head>
  <script src="settings.js"></script>
  <link rel="stylesheet" href="styles.xyz.css"></head>
  <link rel="stylesheet" href="styles-notifications.xyz.css"></head>
</head>
```

In addition, you have to copy and paste the root-tags and all `<script>`
tags from `index.html`'s `<body>`:

```
<body>
  <erz-notifications></erz-notifications>
  <erz-app></erz-app>
  <script type="text/javascript" src="runtime.xyz.js"></script>
  ...
  <script type="text/javascript" src="main.xyz.js"></script>
</body>
```

To configure the app, you have to rename the file
`settings.example.js` to `settings.js` and adjust its contents.

To configure the position of the notification bell and popup, you may want to edit `styles-notifications.scss`.

### Authorization

The website integrating this application has to make sure the OAuth
access token is available in localStorage (or sessionStorage) under
the key `CLX.LoginToken` (e.g. by setting
`localStorage.setItem('CLX.LoginToken', '...')`). If not provided, the
application displays a unauthenticated message to the user.

### Important Notes

- When integrated into the Evento Application, the App is wrapped in a
  `<form>` tag. It is therefore important, that all `<button>`'s are
  defined with `type="button"` attribute, otherwise the global form
  will get submitted which results in a page reload.

## Development

- Common aspects are documented in the [Wiki](https://github.com/bkd-mba-fbi/absenzenmanagement/wiki)
- [Setup development environment](doc/setup-dev-environment.md)
- [Prettier](doc/prettier.md)
- [Browser support](doc/browser-support.md)
- [Internationalization (i18n)](doc/i18n.md)
- [API Data Contract (Data Decoding)](doc/io-ts.md)
