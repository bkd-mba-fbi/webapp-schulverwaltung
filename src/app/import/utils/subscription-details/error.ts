import { SubscriptionDetailEntry } from "../../services/import-file-subscription-details.service";
import { ValidationError } from "../../services/import-state.service";

///// Validation errors /////

export abstract class SubscriptionDetailValidationError extends ValidationError<SubscriptionDetailEntry> {}

export class InvalidEventIdError extends ValidationError<SubscriptionDetailEntry> {
  type = "InvalidEventIdError";

  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class InvalidPersonIdError extends ValidationError<SubscriptionDetailEntry> {
  type = "InvalidPersonIdError";

  constructor() {
    super();
    this.columns = ["personId"];
  }
}

export class InvalidPersonEmailError extends ValidationError<SubscriptionDetailEntry> {
  type = "InvalidPersonEmailError";

  constructor() {
    super();
    this.columns = ["personEmail"];
  }
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export class MissingPersonIdEmailError extends SubscriptionDetailValidationError {
  type = "SubscriptionDetailValidationError";

  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class InvalidSubscriptionDetailIdError extends SubscriptionDetailValidationError {
  type = "InvalidSubscriptionDetailIdError";

  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * "Wert" is empty.
 */
export class MissingValueError extends SubscriptionDetailValidationError {
  type = "MissingValueError";

  constructor() {
    super();
    this.columns = ["value"];
  }
}

export class EventNotFoundError extends SubscriptionDetailValidationError {
  type = "EventNotFoundError";

  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class PersonNotFoundError extends SubscriptionDetailValidationError {
  type = "PersonNotFoundError";

  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class SubscriptionDetailNotFoundError extends SubscriptionDetailValidationError {
  type = "SubscriptionDetailNotFoundError";

  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail does not support editing via the internet.
 */
export class SubscriptionDetailNotEditableError extends SubscriptionDetailValidationError {
  type = "SubscriptionDetailNotEditableError";

  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export class InvalidValueTypeError extends SubscriptionDetailValidationError {
  type = "InvalidValueTypeError";

  constructor() {
    super();
    this.columns = ["value"];
  }
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export class InvalidDropdownValueError extends SubscriptionDetailValidationError {
  type = "InvalidDropdownValueError";

  constructor() {
    super();
    this.columns = ["value"];
  }
}

///// Import errors /////

export class SubscriptionDetailImportError {
  constructor(public error: unknown) {}
}
