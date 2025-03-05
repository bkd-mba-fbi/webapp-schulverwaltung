import { EmailImportEntry } from "../../services/emails/import-validate-emails.service";
import { isEmail, isNumber } from "../common/validation";
import {
  InvalidPersonEmailError,
  InvalidPersonIdError,
  PersonNotFoundError,
} from "./error";

export type EmailImportEntryValidationFn = (entry: EmailImportEntry) => boolean;

export const assertValidPersonId: EmailImportEntryValidationFn = (entry) => {
  const valid = isNumber(entry.entry.personId);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonIdError();
  }
  return valid;
};

export const assertValidPersonEmail: EmailImportEntryValidationFn = (entry) => {
  const valid = isEmail(entry.entry.personEmail);
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new InvalidPersonEmailError();
  }
  return valid;
};

export const assertPersonExists: EmailImportEntryValidationFn = (entry) => {
  const valid = entry.data.person != null;
  if (!valid) {
    entry.validationStatus = "invalid";
    entry.validationError = new PersonNotFoundError();
  }
  return valid;
};
