# Prettier

[zurück](../README.md)

Wir verwenden Prettier zur automatischen Formatierung des Source Codes.

Der Einsatz erfolgt dreistufig:

- Integration in den Editor durch Formatierung beim Speichern (siehe https://prettier.io/docs/en/editors.html).
- Integration ins Git durch Formatierung beim Comitten (Pre-Commit Hook).
- Integration ins CI mit einem Linting-Step, welcher fehlschlägt, wenn eine (TypeScript-)Datei nicht Prettier-formatiert ist (`npm run lint:format`).

## Prettier Version aktualisieren

Prettier ist auf eine exakte Version gepinnt, da die Formatierung von Version zu Version unterschiedlich sein kann. Eine Aktualisierung kann manuell vorgenommen werden:

```
npm install --save-exact prettier@latest
```

Danach muss die Codebase neu formatiert werden:

```
npm run format
git commit -a -m "Reformat sources after Prettier update"
```
