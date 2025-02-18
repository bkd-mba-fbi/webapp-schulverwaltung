import { Injectable } from "@angular/core";
import { ImportParseService } from "./import-parse.service";

export type EmailEntry = {
  personId: unknown;
  personEmail: unknown;
};

@Injectable({
  providedIn: "root",
})
export class ImportParseEmailsService extends ImportParseService<EmailEntry> {
  constructor() {
    super(["ID Person", "E-Mail"]);
  }

  protected rowToEntry(row: Dict<unknown>): EmailEntry {
    const [personColumn, personEmailColumn] = this.columns;
    return {
      personId: row[personColumn],
      personEmail: row[personEmailColumn],
    };
  }
}
