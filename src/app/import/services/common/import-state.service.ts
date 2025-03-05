import { Injectable, signal } from "@angular/core";
import { ParsedEntry } from "./import-file.service";

export const IMPORT_TYPES = ["subscriptionDetails", "emails"] as const;
export type ImportType = (typeof IMPORT_TYPES)[number];

export type ValidationStatus = "validating" | "valid" | "invalid";
export type ImportStatus = "importing" | "success" | "error" | null;

export abstract class ValidationError<TEntry> {
  abstract type: string;
  columns: ReadonlyArray<keyof TEntry>;
}

export type ImportEntry<
  TEntry extends ParsedEntry,
  TData,
  TValidationError extends ValidationError<TEntry>,
  TImportError,
> = {
  validationStatus: ValidationStatus;
  importStatus: ImportStatus;
  entry: TEntry;
  data: TData;
  validationError: Option<TValidationError>;
  importError: Option<TImportError>;
};

@Injectable({
  providedIn: "root",
})
export class ImportStateService {
  importType = signal<ImportType>(IMPORT_TYPES[0]);
  file = signal<Option<File>>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedEntries = signal<Option<ReadonlyArray<any>>>(null);
  importEntries =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signal<Option<ReadonlyArray<ImportEntry<any, any, any, any>>>>(null);
}
