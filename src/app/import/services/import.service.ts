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

export abstract class ImportService<
  TEntry extends object,
  TRowSchema extends Dict<string> = Dict<string>,
  TRow extends object = RowTypeFromSchema<TRowSchema>,
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
  protected verify(rows: ReadonlyArray<TRow>) {
    const columns = Object.keys(rows[0]);
    const columnsResult = this.verifyColumns(columns);
    if (!columnsResult.success) {
      // TODO
    }
  }

  protected verifyColumns(columns: ReadonlyArray<unknown>): {
    success: boolean;
    missing: ReadonlyArray<string>;
  } {
    const requiredColumns = Object.keys(this.rowSchema);
    const missing = requiredColumns.reduce<ReadonlyArray<string>>(
      (acc, column) => (columns.includes(column) ? acc : [...acc, column]),
      [],
    );
    return {
      success: missing.length === 0,
      missing,
    };
  }
}
