import { read, utils } from "xlsx";

export type ParsedEntry = Dict<unknown>;

export abstract class ParseError {
  abstract type: string;
}

export class EmptyFileError extends ParseError {
  type = "EmptyFileError";
}

export class MissingColumnsError extends ParseError {
  type = "MissingColumnsError";

  constructor(
    public actualColumns: number,
    public requiredColumns: number,
  ) {
    super();
  }
}

/**
 * Base class of for services that are parsing a file & perform basic
 * verifications. These services should not contain any state.
 */
export abstract class ImportFileService<
  TEntry extends ParsedEntry,
  TRow extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
> {
  constructor(public requiredColumns: number) {}

  /**
   * Parses the given Excel file and returns
   */
  async parseAndVerify(file: File): Promise<{
    error: Option<ParseError>;
    entries: ReadonlyArray<TEntry>;
  }> {
    const rows = await this.parse(file);
    const error = this.verify(rows);
    const entries = rows.map(this.rowToEntry.bind(this));
    return {
      error,
      entries,
    };
  }

  /**
   * Parse Excel sheet
   */
  protected async parse(file: File): Promise<ReadonlyArray<TRow>> {
    const buffer = await file.arrayBuffer();
    const book = read(buffer);
    const sheet = book.Sheets[book.SheetNames[0]];
    const data = utils.sheet_to_json<TRow>(
      sheet,
      { header: 1 }, // The `header` option causes the result to be an array of arrays instead of an array of objects
    );
    return data
      .slice(1) // Skip the header row
      .filter((row) => row.length > 0); // Ignore empty rows
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

    return null;
  }

  protected verifyNonEmpty(rows: ReadonlyArray<TRow>): Option<EmptyFileError> {
    if (rows.length === 0) {
      return new EmptyFileError();
    }

    return null;
  }

  protected verifyColumns(
    rows: ReadonlyArray<TRow>,
  ): Option<MissingColumnsError> {
    if (rows.length > 0) {
      const actualColumns = Object.keys(rows[0]).length;
      if (actualColumns < this.requiredColumns) {
        return new MissingColumnsError(actualColumns, this.requiredColumns);
      }
    }

    return null;
  }
}
