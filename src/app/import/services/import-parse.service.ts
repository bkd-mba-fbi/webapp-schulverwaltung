import { read, utils } from "xlsx";
import { notNull } from "src/app/shared/utils/filter";

export type RowTypeFromSchema<TRowSchema extends Dict<string>> = {
  [K in keyof TRowSchema]: TRowSchema[K] extends "number" ? number : string;
};

export type EmptyError = {
  type: "empty";
};

export type MissingColumnsError = {
  type: "missingColumns";
  detail: ReadonlyArray<string>;
};

export type InvalidTypesError = {
  type: "invalidTypes";
  detail: ReadonlyArray<{
    index: number;
    column: string;
    value: unknown;
    expectedType: string;
  }>;
};

export type ParseError = EmptyError | MissingColumnsError | InvalidTypesError;

/**
 * Base class of for services that are parsing a file & perform basic
 * verifications. These services should not contain any state.
 */
export abstract class ImportParseService<
  TEntry extends Dict<unknown>,
  TRowSchema extends Dict<string> = Dict<string>,
  TRow extends Dict<unknown> = RowTypeFromSchema<TRowSchema>,
> {
  constructor(protected rowSchema: TRowSchema) {}

  /**
   * Parses the given Excel file and returns
   */
  async parseAndVerify(file: File): Promise<{
    error: Option<ParseError>;
    headers: ReadonlyArray<string>;
    entries: ReadonlyArray<TEntry>;
  }> {
    const rows = await this.parse(file);
    const error = this.verify(rows);
    const entries = rows.map(this.rowToEntry.bind(this));
    const headers = Object.keys(entries[0]);
    return {
      error,
      headers,
      entries,
    };
  }

  /**
   * Parse Excel sheet
   */
  protected async parse(file: File): Promise<ReadonlyArray<TRow>> {
    // TODO: Handle errors (e.g. what happens if the file is not an Excel file?)
    // and return a VerificationError in this case
    const buffer = await file?.arrayBuffer();
    const book = read(buffer);
    const sheet = book.Sheets[book.SheetNames[0]];
    const rows = utils.sheet_to_json<TRow>(sheet);
    console.log(rows);
    return rows;
  }

  protected abstract rowToEntry(row: TRow): TEntry;

  /**
   * Verify basic data format
   */
  protected verify(rows: ReadonlyArray<TRow>): Option<ParseError> {
    const emptyError = this.verifyNonEmpty(rows);
    if (emptyError) {
      return emptyError;
    }

    const missingColumnsError = this.verifyColumns(rows);
    if (missingColumnsError) {
      return missingColumnsError;
    }

    const invalidTypesError = this.verifyTypes(rows);
    if (invalidTypesError) {
      return invalidTypesError;
    }

    return null;
  }

  protected verifyNonEmpty(rows: ReadonlyArray<TRow>): Option<EmptyError> {
    if (rows.length === 0) {
      return { type: "empty" };
    }

    return null;
  }

  protected verifyColumns(
    rows: ReadonlyArray<TRow>,
  ): Option<MissingColumnsError> {
    const columns = Object.keys(rows[0]);
    const requiredColumns = Object.keys(this.rowSchema);
    const missing = requiredColumns.reduce<MissingColumnsError["detail"]>(
      (acc, column) => (columns.includes(column) ? acc : [...acc, column]),
      [],
    );

    if (missing.length > 0) {
      return {
        type: "missingColumns",
        detail: missing,
      };
    }

    return null;
  }

  protected verifyTypes(rows: ReadonlyArray<TRow>): Option<InvalidTypesError> {
    const invalid = rows.reduce<InvalidTypesError["detail"]>(
      (acc, row, i) => [...acc, ...this.verifyTypeForRow(row, i)],
      [],
    );

    if (invalid.length > 0) {
      return {
        type: "invalidTypes",
        detail: invalid,
      };
    }

    return null;
  }

  protected verifyTypeForRow(
    row: TRow,
    index: number,
  ): InvalidTypesError["detail"] {
    return Object.keys(row)
      .map((column) => {
        const value = row[column];
        const availableColumns = Object.keys(this.rowSchema);
        const expectedType = this.rowSchema[column];
        return availableColumns.includes(column) &&
          !this.hasValidType(expectedType, value)
          ? {
              index,
              column,
              value,
              expectedType,
            }
          : null;
      })
      .filter(notNull);
  }

  protected hasValidType(type: string, value: unknown): boolean {
    switch (type) {
      case "number":
        return typeof value === "number" || !isNaN(Number(value));
      default:
        return true;
    }
  }
}
