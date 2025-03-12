import { SubscriptionDetailType } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailImportEntry } from "../../services/subscription-details/import-validate-subscription-details.service";
import {
  isInteger,
  isNumber,
  isOptionalEmail,
  isOptionalNumber,
  isPresent,
  isString,
} from "../common/validation";
import {
  EventNotFoundError,
  InvalidDropdownValueError,
  InvalidEventIdError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  InvalidSubscriptionDetailIdError,
  InvalidValueTypeError,
  MissingPersonIdEmailError,
  MissingValueError,
  PersonNotFoundError,
  SubscriptionDetailNotEditableError,
  SubscriptionDetailNotFoundError,
} from "./error";

export type SubscriptionDetailValidationFn = (
  entry: SubscriptionDetailImportEntry,
) => boolean;

export const assertValidEventId: SubscriptionDetailValidationFn = (entry) => {
  const valid = isNumber(entry.entry.eventId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidEventIdError();
  }
  return valid;
};

export const assertValidPersonId: SubscriptionDetailValidationFn = (entry) => {
  const valid = isOptionalNumber(entry.entry.personId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonIdError();
  }
  return valid;
};

export const assertValidPersonEmail: SubscriptionDetailValidationFn = (
  entry,
) => {
  const valid = isOptionalEmail(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonEmailError();
  }
  return valid;
};

export const assertPersonIdEmailPresent: SubscriptionDetailValidationFn = (
  entry,
) => {
  const valid =
    isPresent(entry.entry.personId) || isPresent(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingPersonIdEmailError();
  }
  return valid;
};

export const assertValidSubscriptionDetailId: SubscriptionDetailValidationFn = (
  entry,
) => {
  const valid = isNumber(entry.entry.subscriptionDetailId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidSubscriptionDetailIdError();
  }
  return valid;
};

export const assertValuePresent: SubscriptionDetailValidationFn = (entry) => {
  const valid = isPresent(entry.entry.value);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingValueError();
  }
  return valid;
};

export const assertEventExists: SubscriptionDetailValidationFn = (entry) => {
  const valid = entry.data.event != null;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new EventNotFoundError();
  }
  return valid;
};

export const assertPersonExists: SubscriptionDetailValidationFn = (entry) => {
  const valid = entry.data.person != null;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new PersonNotFoundError();
  }
  return valid;
};

/**
 * The /Subscriptions/{subscriptionId}/SubscriptionDetails endpoint does not
 * return details that don't have VssInternet="E". So there is no way to
 * differentiate between the case where no subscription exists for a given
 * person/event and the case where a subscription exists, but can't be edited
 * through the Internet (VssInternet!="E"). We solve this by using a generic
 * error message that covers both cases.
 */
export const assertSubscriptionDetailExists: SubscriptionDetailValidationFn = (
  entry,
) => {
  const valid = entry.data.subscriptionDetail != null;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new SubscriptionDetailNotFoundError();
  }
  return valid;
};

/**
 * Actually, the /Subscriptions/{subscriptionId}/SubscriptionDetails endpoint
 * does not return details that don't have VssInternet="E". But we leave this
 * assertion in place for now.
 */
export const assertSubscriptionDetailEditable: SubscriptionDetailValidationFn =
  (entry) => {
    const detail = entry.data.subscriptionDetail;
    const valid = detail?.VssInternet === "E";
    if (!valid) {
      entry.validationStatus = "invalid";
      entry.validationError = new SubscriptionDetailNotEditableError();
    }
    return valid;
  };

export const assertSubscriptionDetailType: SubscriptionDetailValidationFn = (
  entry,
) => {
  const ALLOWED_VSS_TYPES = [
    SubscriptionDetailType.Int,
    SubscriptionDetailType.Currency,
    SubscriptionDetailType.ShortText,
    SubscriptionDetailType.Text,
  ];
  const detail = entry.data.subscriptionDetail;
  const typeId = detail?.VssTypeId;
  const { value } = entry.entry;
  const valid =
    detail?.DropdownItems != null || // Entries with dropdown items will be checked by assertSubscriptionDetailDropdownItems
    (ALLOWED_VSS_TYPES.includes(typeId as never) &&
      ((typeId === SubscriptionDetailType.Int && isInteger(value)) ||
        (typeId === SubscriptionDetailType.Currency && isNumber(value)) ||
        (typeId === SubscriptionDetailType.ShortText && isString(value)) ||
        (typeId === SubscriptionDetailType.Text && isString(value))));
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidValueTypeError();
  }
  return valid;
};

export const assertSubscriptionDetailDropdownItems: SubscriptionDetailValidationFn =
  (entry) => {
    const itemsValues = entry.data.subscriptionDetail?.DropdownItems?.filter(
      (item) => item.IsActive,
    )?.map((item) => item.Value);
    const { value } = entry.entry;
    const valid = itemsValues == null || itemsValues.includes(String(value));
    if (!valid) {
      entry.validationStatus = "invalid";
      entry.validationError = new InvalidDropdownValueError();
    }
    return valid;
  };
