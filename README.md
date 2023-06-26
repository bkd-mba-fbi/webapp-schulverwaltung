# webapp-schulverwaltung

[![lint test ✨](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/lintAndTest.yml/badge.svg?branch=master)](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/lintAndTest.yml)
[![build 🏭 deploy 🚀](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/buildDeploy.yml/badge.svg)](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/actions/workflows/buildDeploy.yml)

JavaScript web module to implement processes for school administration using the SLH.Evento backend (REST API).

[Demo](https://bkd-mba-fbi.github.io/webapp-schulverwaltung/app)

## Integration

Download the [latest build](https://bkd-mba-fbi.github.io/webapp-schulverwaltung/webapp-schulverwaltung.zip).

To integrate this application in your website, you have to copy and
paste the import of the `settings.js` and the CSS files from
`index.html`'s `<head>`:

```
<head>
  <script src="settings.js"></script>
  <link rel="stylesheet" href="styles.xyz.css"></head>
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

- Common aspects are documented in the [Wiki](https://github.com/bkd-mba-fbi/webapp-schulverwaltung/wiki)
- [Setup development environment](doc/setup-dev-environment.md)
- [Prettier](doc/prettier.md)
- [Browser support](doc/browser-support.md)
- [Internationalization (i18n)](doc/i18n.md)
- [API Data Contract (Data Decoding)](doc/io-ts.md)
