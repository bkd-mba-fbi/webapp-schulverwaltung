import { Injectable } from "@angular/core";
import { ImportService, RowTypeFromSchema } from "./import.service";

const emailRowSchema = {
  "ID Person": "number",
  "E-Mail": "string",
} as const;
type EmailRow = RowTypeFromSchema<typeof emailRowSchema>;

export type EmailEntry = {
  personId: number;
  personEmail: string;
};

@Injectable()
export class ImportEmailsService extends ImportService<EmailEntry> {
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
