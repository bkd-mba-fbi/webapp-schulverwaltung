import { ValidationError } from "../../services/common/import-state.service";
import { SubscriptionDetailEntry } from "../../services/subscription-details/import-file-subscription-details.service";

export abstract class SubscriptionDetailValidationError extends ValidationError<SubscriptionDetailEntry> {}

export class InvalidEventIdError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidEventIdError", ["eventId"]);
  }
}

export class InvalidPersonIdError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidPersonIdError", ["personId"]);
  }
}

export class InvalidPersonEmailError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidPersonEmailError", ["personEmail"]);
  }
}

/**
 * Neither Person Id, nor E-Mail is present.
 */
export class MissingPersonIdEmailError extends SubscriptionDetailValidationError {
  constructor() {
    super("SubscriptionDetailValidationError", ["personId", "personEmail"]);
  }
}

export class InvalidSubscriptionDetailIdError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidSubscriptionDetailIdError", ["subscriptionDetailId"]);
  }
}

/**
 * "Wert" is empty.
 */
export class MissingValueError extends SubscriptionDetailValidationError {
  constructor() {
    super("MissingValueError", ["value"]);
  }
}

export class EventNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super("EventNotFoundError", ["eventId"]);
  }
}

export class PersonNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super("PersonNotFoundError", ["personId", "personEmail"]);
  }
}

export class SubscriptionDetailNotFoundError extends SubscriptionDetailValidationError {
  constructor() {
    super("SubscriptionDetailNotFoundError", ["subscriptionDetailId"]);
  }
}

/**
 * The subscription detail does not support editing via the internet.
 */
export class SubscriptionDetailNotEditableError extends SubscriptionDetailValidationError {
  constructor() {
    super("SubscriptionDetailNotEditableError", ["subscriptionDetailId"]);
  }
}

/**
 * The subscription detail value ("Wert") does not comply with the "VssType".
 */
export class InvalidValueTypeError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidValueTypeError", ["value"]);
  }
}

/**
 * The subscription detail value ("Wert") is not part of the "DropdownItems".
 */
export class InvalidDropdownValueError extends SubscriptionDetailValidationError {
  constructor() {
    super("InvalidDropdownValueError", ["value"]);
  }
}
