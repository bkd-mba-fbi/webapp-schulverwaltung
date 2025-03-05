import { SubscriptionDetailType } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailImportEntry } from "../../services/subscription-details/import-validate-subscription-details.service";
import {
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

export const assertSubscriptionDetailEditable: SubscriptionDetailValidationFn =
  (entry) => {
    const detail = entry.data.subscriptionDetail;
    const valid = detail?.VssInternet === "E" && detail?.VssStyle === "TX";
    if (!valid) {
      entry.validationStatus = "invalid";
      entry.validationError = new SubscriptionDetailNotEditableError();
    }
    return valid;
  };

export const assertSubscriptionDetailType: SubscriptionDetailValidationFn = (
  entry,
) => {
  const detail = entry.data.subscriptionDetail;
  const typeId = detail?.VssTypeId;
  const { value } = entry.entry;
  const valid =
    detail?.DropdownItems != null || // Entries with dropdown items will be checked by another assertion
    ((typeId === SubscriptionDetailType.Int ||
      typeId === SubscriptionDetailType.Currency) &&
      isNumber(value)) ||
    ((typeId === SubscriptionDetailType.Text ||
      typeId === SubscriptionDetailType.MemoText) &&
      isString(value));
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidValueTypeError();
  }
  return valid;
};

export const assertSubscriptionDetailDropdownItems: SubscriptionDetailValidationFn =
  (entry) => {
    const items = entry.data.subscriptionDetail?.DropdownItems?.map((item) =>
      String(item.Key),
    );
    const { value } = entry.entry;
    const valid = items == null || items.includes(String(value));
    if (!valid) {
      entry.validationStatus = "invalid";
      entry.validationError = new InvalidDropdownValueError();
    }
    return valid;
  };
