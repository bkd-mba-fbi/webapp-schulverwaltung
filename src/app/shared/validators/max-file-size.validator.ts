import { SchemaPath, validate } from "@angular/forms/signals";

export function maxFileSize(
  path: SchemaPath<Option<File>>,
  { maxBytes, when }: { maxBytes: number; when?: () => boolean },
): void {
  validate(path, ({ value }) => {
    const file = value();
    if (file && file.size > maxBytes && (!when || when())) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      const maxSizeMb = (maxBytes / 1024 / 1024).toFixed(1);
      return {
        kind: "maxFileSize",
        message: `The file is too large (${sizeMb} MB, max ${maxSizeMb} MB)`,
        size: sizeMb,
        maxSize: maxSizeMb,
      };
    }

    return null;
  });
}
