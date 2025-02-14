import { Injectable } from "@angular/core";
import { ImportParseService, RowTypeFromSchema } from "./import-parse.service";

const emailRowSchema = {
  "ID Person": "number",
  "E-Mail": "string",
} as const;
type EmailRow = RowTypeFromSchema<typeof emailRowSchema>;

export type EmailEntry = {
  personId: number;
  personEmail: string;
};

@Injectable({
  providedIn: "root",
})
export class ImportParseEmailsService extends ImportParseService<EmailEntry> {
  constructor() {
    super(emailRowSchema);
  }

  protected rowToEntry(row: EmailRow): EmailEntry {
    return {
      personId: row["ID Person"],
      personEmail: row["E-Mail"],
    };
  }
}
