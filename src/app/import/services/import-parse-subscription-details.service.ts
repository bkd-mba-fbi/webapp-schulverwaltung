import { Injectable } from "@angular/core";
import { ImportParseService } from "./import-parse.service";

export type SubscriptionDetailEntry = {
  eventId: unknown;
  personId: unknown;
  personEmail: unknown;
  subscriptionDetailId: unknown;
  value: unknown;
};

@Injectable({
  providedIn: "root",
})
export class ImportParseSubscriptionDetailsService extends ImportParseService<SubscriptionDetailEntry> {
  constructor() {
    super(["ID Anlass", "ID Person", "ID AD", "Wert", "E-Mail"]);
  }

  protected rowToEntry(row: Dict<unknown>): SubscriptionDetailEntry {
    const [
      eventIdColumn,
      personIdColumn,
      subscriptionDetailIdColumn,
      valueColumn,
      personEmailColumn,
    ] = this.columns;
    return {
      eventId: row[eventIdColumn],
      personId: row[personIdColumn],
      personEmail: row[personEmailColumn],
      subscriptionDetailId: row[subscriptionDetailIdColumn],
      value: row[valueColumn],
    };
  }
}
