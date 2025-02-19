import { read, utils } from "xlsx";

export type ParsedEntry = Dict<unknown>;

export type EmptyError = {
  type: "empty";
};

export type MissingColumnsError = {
  type: "missingColumns";
  detail: ReadonlyArray<string>;
};

export type ParseError = EmptyError | MissingColumnsError;

/**
 * Base class of for services that are parsing a file & perform basic
 * verifications. These services should not contain any state.
 */
export abstract class ImportParseService<
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
    const missing = this.columns.reduce<MissingColumnsError["detail"]>(
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
}
