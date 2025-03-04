import { SubscriptionDetailEntry } from "../../services/import-file-subscription-details.service";
import { ValidationError } from "../../services/import-state.service";

///// Validation errors /////

export class SubscriptionDetailValidationError extends ValidationError<SubscriptionDetailEntry> {}

export class InvalidEventIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class InvalidPersonIdError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["personId"];
  }
}

export class InvalidPersonEmailError extends ValidationError<SubscriptionDetailEntry> {
  constructor() {
    super();
    this.columns = ["personEmail"];
  }
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export class MissingPersonIdEmailError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class InvalidSubscriptionDetailIdError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * "Wert" is empty.
 */
export class MissingValueError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

export class EventNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["eventId"];
  }
}

export class PersonNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["personId", "personEmail"];
  }
}

export class SubscriptionDetailNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail does not support editing via the internet.
 */
export class SubscriptionDetailNotEditableError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["subscriptionDetailId"];
  }
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export class InvalidValueTypeError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export class InvalidDropdownValueError extends SubscriptionDetailValidationError {
  constructor() {
    super();
    this.columns = ["value"];
  }
}

///// Import errors /////

export class SubscriptionDetailImportError extends ValidationError<SubscriptionDetailEntry> {}
