import { SubscriptionDetailType } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";
import {
  isNumber,
  isOptionalEmail,
  isOptionalNumber,
  isPresent,
  isString,
} from "../validation";
import {
  EventNotFoundError,
  InvalidDropdownValueError,
  InvalidEventIdError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  InvalidSubscriptionDetailIdError,
  InvalidValueError,
  MissingPersonIdEmailError,
  MissingValueError,
  PersonNotFoundError,
  SubscriptionDetailNotEditableError,
  SubscriptionDetailNotFoundError,
} from "./error";

export type EntryValidationFn = (entry: SubscriptionDetailImportEntry) => {
  valid: boolean;
  entry: SubscriptionDetailImportEntry;
};

export const assertValidEventId: EntryValidationFn = (entry) => {
  const valid = isNumber(entry.entry.eventId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidEventIdError();
  }
  return { valid, entry };
};

export const assertValidPersonId: EntryValidationFn = (entry) => {
  const valid = isOptionalNumber(entry.entry.personId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonIdError();
  }
  return { valid, entry };
};

export const assertValidPersonEmail: EntryValidationFn = (entry) => {
  const valid = isOptionalEmail(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonEmailError();
  }
  return { valid, entry };
};

export const assertPersonIdEmailPresent: EntryValidationFn = (entry) => {
  const valid =
    isPresent(entry.entry.personId) || isPresent(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingPersonIdEmailError();
  }
  return { valid, entry };
};

export const assertValidSubscriptionDetailId: EntryValidationFn = (entry) => {
  const valid = isNumber(entry.entry.subscriptionDetailId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidSubscriptionDetailIdError();
  }
  return { valid, entry };
};

export const assertValuePresent: EntryValidationFn = (entry) => {
  const valid = isPresent(entry.entry.value);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new MissingValueError();
  }
  return { valid, entry };
};

export const assertEventExists: EntryValidationFn = (entry) => {
  const valid = entry.data.event !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new EventNotFoundError();
  }
  return { valid: true, entry };
};

export const assertPersonExists: EntryValidationFn = (entry) => {
  const valid = entry.data.person !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new PersonNotFoundError();
  }
  return { valid: true, entry };
};

export const assertSubscriptionDetailExists: EntryValidationFn = (entry) => {
  const valid = entry.data.subscriptionDetail !== undefined;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new SubscriptionDetailNotFoundError();
  }
  return { valid: true, entry };
};

export const assertSubscriptionDetailEditable: EntryValidationFn = (entry) => {
  const detail = entry.data.subscriptionDetail;
  const valid = detail?.VssInternet === "E" && detail?.VssStyle === "TX";
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new SubscriptionDetailNotEditableError();
  }
  return { valid: true, entry };
};

export const assertSubscriptionDetailType: EntryValidationFn = (entry) => {
  const typeId = entry.data.subscriptionDetail?.VssTypeId;
  const value = entry.entry.value;
  const valid =
    ((typeId === SubscriptionDetailType.IntField ||
      typeId === SubscriptionDetailType.Currency) &&
      isNumber(value)) ||
    ((typeId === SubscriptionDetailType.Text ||
      typeId === SubscriptionDetailType.MemoText) &&
      isString(value));
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidValueError();
  }
  return { valid: true, entry };
};

export const assertSubscriptionDetailDropdownItems: EntryValidationFn = (
  entry,
) => {
  const items = entry.data.subscriptionDetail?.DropdownItems?.map(
    (item) => item.Key,
  );
  const value = entry.entry.value;
  const valid = !items || items.includes(value as never);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidDropdownValueError();
  }
  return { valid: true, entry };
};
