import { Injectable, signal } from "@angular/core";

export const IMPORT_TYPES = ["subscriptionDetails", "emails"] as const;
export type ImportType = (typeof IMPORT_TYPES)[number];

@Injectable({
  providedIn: "root",
})
export class ImportStateService {
  importType = signal<ImportType>(IMPORT_TYPES[0]);
  file = signal<Option<File>>(null);
  headers = signal<ReadonlyArray<string>>([]);
  entries = signal<ReadonlyArray<Dict<unknown>>>([]);
}
