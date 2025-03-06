import { Injectable } from "@angular/core";
import { isEmail } from "../../utils/common/validation";
import { ImportFileService } from "../common/import-file.service";

export type SubscriptionDetailEntry = {
  eventId: unknown;
  personId: unknown;
  personEmail: unknown;
  subscriptionDetailId: unknown;
  value: unknown;
};

const SUBSCRIPTION_DETAILS_REQUIRED_COLUMNS = 4;

@Injectable({
  providedIn: "root",
})
export class ImportFileSubscriptionDetailsService extends ImportFileService<SubscriptionDetailEntry> {
  constructor() {
    super(SUBSCRIPTION_DETAILS_REQUIRED_COLUMNS);
  }

  protected rowToEntry(row: ReadonlyArray<unknown>): SubscriptionDetailEntry {
    const [eventId, personIdOrEmail, subscriptionDetailId, value] = row;

    let personId: unknown;
    let personEmail: unknown;
    if (isEmail(personIdOrEmail)) {
      personEmail = personIdOrEmail;
    } else {
      personId = personIdOrEmail;
    }

    return {
      eventId,
      personId,
      personEmail,
      subscriptionDetailId,
      value,
    };
  }
}
