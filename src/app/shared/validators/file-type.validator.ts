import { SchemaPath, validate } from "@angular/forms/signals";

export function fileType(
  path: SchemaPath<Option<File>>,
  {
    acceptedFileTypes,
    when,
  }: {
    /**
     * An array of the allowed file types the file can have (may be either
     * content type or file extension with leading dot).
     */
    acceptedFileTypes: ReadonlyArray<string>;
    when?: () => boolean;
  },
): void {
  validate(path, ({ value }) => {
    const file = value();
    if (
      file &&
      !isValidFileType(file, acceptedFileTypes) &&
      (!when || when())
    ) {
      return {
        kind: "fileType",
        message: `The file type is not allowed.`,
      };
    }

    return null;
  });
}

function isValidFileType(
  file: File,
  acceptedFileTypes: ReadonlyArray<string>,
): boolean {
  return acceptedFileTypes.some((acceptedFileType) =>
    acceptedFileType.startsWith(".")
      ? file.name.endsWith(acceptedFileType)
      : file.type === acceptedFileType,
  );
}
