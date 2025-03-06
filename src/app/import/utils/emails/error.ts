import { ValidationError } from "../../services/common/import-state.service";
import { EmailEntry } from "../../services/emails/import-file-emails.service";

export abstract class EmailValidationError extends ValidationError<EmailEntry> {}

export class InvalidPersonIdError extends EmailValidationError {
  constructor() {
    super("InvalidPersonIdError", ["personId"]);
  }
}

export class InvalidPersonEmailError extends EmailValidationError {
  constructor() {
    super("InvalidPersonEmailError", ["personEmail"]);
  }
}

export class PersonNotFoundError extends EmailValidationError {
  constructor() {
    super("PersonNotFoundError", ["personId", "personEmail"]);
  }
}
