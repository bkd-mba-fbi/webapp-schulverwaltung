import { ValidationError } from "../../services/common/import-state.service";
import { EmailEntry } from "../../services/emails/import-file-emails.service";

export abstract class EmailValidationError extends ValidationError<EmailEntry> {}

export class InvalidPersonIdError extends EmailValidationError {
  type = "InvalidPersonIdError";

  constructor() {
    super();
    this.columns = ["personId"];
  }
}

export class InvalidPersonEmailError extends EmailValidationError {
  type = "InvalidPersonEmailError";

  constructor() {
    super();
    this.columns = ["personEmail"];
  }
}

export class PersonNotFoundError extends EmailValidationError {
  type = "PersonNotFoundError";

  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}
