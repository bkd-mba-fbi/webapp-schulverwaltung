import { Observable, firstValueFrom } from "rxjs";

export type MissingPersonError = {
  type: "MissingPersonError";
  detail: {
    index: number;
    column?: string;
    personId: number;
    email: string;
  };
};

export type ValidationError = MissingPersonError;

export abstract class ImportValidateService<
  TEntry extends Dict<unknown>,
  TAdditionalData extends Dict<unknown>,
> {
  async fetchAndValidate(entries: ReadonlyArray<TEntry>): Promise<{
    errors: Option<ReadonlyArray<ValidationError>>;
    headers: ReadonlyArray<string>;
    entries: ReadonlyArray<TEntry & TAdditionalData>;
  }> {
    const entriesWithAdditionalData = await firstValueFrom(this.fetch(entries));
    const errors = this.validate(entriesWithAdditionalData);
    return {
      errors: errors.length > 0 ? errors : null,
      headers: [],
      entries: entriesWithAdditionalData,
    };
  }

  /**
   * Fetches additional data & decorates the parsed entries from the Excel file.
   */
  protected abstract fetch(
    entries: ReadonlyArray<TEntry>,
  ): Observable<ReadonlyArray<TEntry & TAdditionalData>>;

  /**
   * Logically validates the given entries.
   */
  protected abstract validate(
    entries: ReadonlyArray<TEntry & TAdditionalData>,
  ): ReadonlyArray<ValidationError>;
}
