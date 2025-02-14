import { Injectable } from "@angular/core";
import { ImportParseService, RowTypeFromSchema } from "./import-parse.service";

const subscriptionDetailRowSchema = {
  "ID Anlass": "number",
  "ID Person": "number",
  "ID AD": "number",
  Wert: "string",
  "E-Mail": "string",
} as const;
type SubscriptionDetailRow = RowTypeFromSchema<
  typeof subscriptionDetailRowSchema
>;

export type SubscriptionDetailEntry = {
  eventId: number;
  personId: number;
  subscriptionDetailId: number;
  value: string;
  personEmail?: string;
};

@Injectable({
  providedIn: "root",
})
export class ImportParseSubscriptionDetailsService extends ImportParseService<SubscriptionDetailEntry> {
  constructor() {
    super(subscriptionDetailRowSchema);
  }

  protected rowToEntry(row: SubscriptionDetailRow): SubscriptionDetailEntry {
    return {
      eventId: row["ID Anlass"],
      personId: row["ID Person"],
      subscriptionDetailId: row["ID AD"],
      value: row.Wert,
      personEmail: row["E-Mail"],
    };
  }
}
