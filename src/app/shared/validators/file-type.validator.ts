import { SchemaPath, validate } from "@angular/forms/signals";

export function fileType(
  path: SchemaPath<Option<File>>,
  {
    acceptedFileTypes,
    when,
  }: {
    /**
     * An array of the allowed content types the file can have.
     */
    acceptedFileTypes: ReadonlyArray<string>;
    when?: () => boolean;
  },
): void {
  validate(path, ({ value }) => {
    const file = value();
    if (file && !acceptedFileTypes.includes(file.type) && (!when || when())) {
      return {
        kind: "fileType",
        message: `The file type is not allowed.`,
      };
    }

    return null;
  });
}
