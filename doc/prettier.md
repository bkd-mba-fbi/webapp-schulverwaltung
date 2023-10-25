# Prettier

[back](../README.md)

We use Prettier to automatically format the source code.

The module is integrated as follows:

- Format on save in the editor, see https://prettier.io/docs/en/editors.html
- Pre-commit hook in Git

## Update Prettier version

Automatic Prettier updates are disabled, because the formatting rules can change in newer versions. Therefore an exact version of the Prettier module is installed.

You can update it manually (will also reformat source with new Prettier version):

```
npm run format:upgrade
git commit -a -m "Reformat sources after Prettier update"
```

Or to just reformat the code:

```
npm run format
git commit -a -m "Reformat sources after Prettier update"
```
