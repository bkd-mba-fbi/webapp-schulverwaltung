import { read, utils } from "xlsx";

export type ParsedEntry = Dict<unknown>;

export class ParseError {
  get type() {
    return this.constructor.name;
  }
}

export class EmptyFileError extends ParseError {}

export class MissingColumnsError extends ParseError {
  constructor(public columns: ReadonlyArray<string>) {
    super();
  }
}

/**
 * Base class of for services that are parsing a file & perform basic
 * verifications. These services should not contain any state.
 */
export abstract class ImportFileService<
  TEntry extends ParsedEntry,
  TRow extends Dict<unknown> = Dict<unknown>,
> {
  constructor(protected columns: ReadonlyArray<string>) {}

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
    const rows = utils.sheet_to_json<TRow>(sheet);
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
    const columns = Object.keys(rows[0]);
    const missing = this.columns.reduce<MissingColumnsError["columns"]>(
      (acc, column) => (columns.includes(column) ? acc : [...acc, column]),
      [],
    );

    if (missing.length > 0) {
      return new MissingColumnsError(missing);
    }

    return null;
  }
}
