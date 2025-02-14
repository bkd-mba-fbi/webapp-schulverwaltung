import { computed, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { filter, switchMap } from "rxjs";
import { read, utils } from "xlsx";
import { notNull } from "src/app/shared/utils/filter";

// setFile
// parse → Parse Excel sheet
// verify → Verify columns & data types
// fetchAndValidate → Fetch records and validate data
// import

export type RowTypeFromSchema<TRowSchema extends Dict<string>> = {
  [K in keyof TRowSchema]: TRowSchema[K] extends "number" ? number : string;
};

type MissingColumnsError = {
  type: "missingColumns";
  detail: ReadonlyArray<string>;
};

type InvalidTypesError = {
  type: "invalidTypes";
  detail: ReadonlyArray<{
    row: number;
    column: string;
    value: unknown;
    expectedType: string;
  }>;
};

type VerificationError = MissingColumnsError | InvalidTypesError;

export abstract class ImportService<
  TEntry extends Dict<unknown>,
  TRowSchema extends Dict<string> = Dict<string>,
  TRow extends Dict<unknown> = RowTypeFromSchema<TRowSchema>,
> {
  file = signal<Option<File>>(null);
  protected rows = toSignal(
    toObservable(this.file).pipe(
      filter(notNull),
      switchMap(this.parse.bind(this)),
    ),
    { initialValue: [] },
  );
  entries = computed(() => this.rows().map(this.rowToEntry.bind(this)));
  headers = computed(() => Object.keys(this.entries()[0]));

  constructor(protected rowSchema: TRowSchema) {}

  setFile(file: Option<File>): void {
    this.file.set(file);
  }

  /**
   * Parse Excel sheet
   */
  protected async parse(file: File): Promise<ReadonlyArray<TRow>> {
    const buffer = await file?.arrayBuffer();
    const book = read(buffer);
    const sheet = book.Sheets[book.SheetNames[0]];
    const rows = utils.sheet_to_json<TRow>(sheet);
    console.log(rows);
    return rows;
  }

  protected abstract rowToEntry(row: TRow): TEntry;

  /**
   * Verify columns & data types
   */
  protected verify(rows: ReadonlyArray<TRow>): Option<VerificationError> {
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
      (acc, row, i) => [...acc, ...this.verifyTypeForRow(row, i + 1)],
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
    line: number,
  ): InvalidTypesError["detail"] {
    return Object.keys(row)
      .map((column) => {
        const value = row[column];
        const expectedType = this.rowSchema[column];
        return this.hasValidType(expectedType, value)
          ? null
          : {
              type: "invalidTypes",
              row: line,
              column,
              value,
              expectedType,
            };
      })
      .filter(notNull);
  }

  protected hasValidType(type: string, value: unknown): boolean {
    switch (type) {
      case "number":
        return typeof value === "number" || !isNaN(Number(value));
      case "string":
        return typeof value === "string";
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }
}
