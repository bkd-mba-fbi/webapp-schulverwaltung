# Prettier

[back](../README.md)

We use Prettier to automatically format the source code.

The module is integrated threefold:

- Format on save in the editor, see https://prettier.io/docs/en/editors.html
- Pre-commit hook in Git
- Linting step in the CI pipeline: The build fails when a (TypeScript) file is not properly formatted (`npm run lint:format`)

## Update Prettier version

Automatic Prettier updates are disabled, because the formatting rules can change in newer versions. Therefore an exact version of the Prettier module is installed.

You can update it manually:

```
npm install --save-exact prettier@latest
```

To reformat the code base afterwards:

```
npm run format
git commit -a -m "Reformat sources after Prettier update"
```
