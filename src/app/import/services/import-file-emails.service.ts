import { Injectable } from "@angular/core";
import { ImportFileService } from "./import-file.service";

export type EmailEntry = {
  personId: unknown;
  personEmail: unknown;
};

const EMAILS_REQUIRED_COLUMNS = 2;

@Injectable({
  providedIn: "root",
})
export class ImportFileEmailsService extends ImportFileService<EmailEntry> {
  constructor() {
    super(EMAILS_REQUIRED_COLUMNS);
  }

  protected rowToEntry(row: ReadonlyArray<unknown>): EmailEntry {
    const [personId, personEmail] = row;
    return {
      personId,
      personEmail,
    };
  }
}
