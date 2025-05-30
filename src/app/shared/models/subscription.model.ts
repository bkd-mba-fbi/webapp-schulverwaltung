import * as t from "io-ts";
import { LocalDateTimeFromString, Option } from "./common-types";
import { DropDownItemWithActive } from "./drop-down-item.model";

export enum SubscriptionDetailType {
  Int = 277,
  Currency = 279,
  ShortText = 290, // → Text in old implementation
  Text = 293, // → MemoText in old implementation
  YesNo = 291,
  Yes = 292,
  Date = 295,
}

const SubscriptionDetail = t.type({
  Id: t.string,
  SubscriptionId: t.number,
  VssId: t.number,
  EventId: t.number,
  // OpenInvoiceBookingId: Option(t.number),
  // BookingType: Option(t.string),
  DropdownItems: Option(t.array(DropDownItemWithActive)),
  // EnteringType: t.string,
  IdPerson: t.number,
  // IsValidated: t.boolean,
  // IsValidationMessage: t.boolean,
  // IsValidationStatus: t.boolean,
  // Required: t.boolean,
  ShowAsRadioButtons: t.boolean,
  Sort: t.string,
  Tooltip: Option(t.string),
  Value: Option(t.union([t.string, t.number])),
  VssDesignation: t.string,
  // VssStyleDescription: t.string,
  VssStyle: t.string,
  VssTypeId: t.number,
  VssType: t.string,
  // ReadOnly: t.boolean,
  // ValueRangeRegex: Option(t.string),
  // ValueRangeError: Option(t.string),
  // MaxLength: Option(t.string),
  // MaxFileSize: Option(t.string),
  // IdObject: t.string,
  // IdSubscription: t.number,
  // IdEvent: t.number,
  // IdAnmeldeVSS: t.number,
  // AdWert: Option(t.string),
  // VssBezeichnung: t.string,
  // VssTypEx: t.number,
  // AllowChanges: t.boolean,
  VssInternet: t.string,
  // HRef: t.string,
});

const Subscription = t.type({
  Id: t.number,
  // CurrentWorkProgressId: Option(t.string || Option(t.number)),
  EventId: Option(t.number),
  PersonId: Option(t.number),
  Status: t.string,
  // StatusId: Option(t.number),
  // IsOkay: Option(t.boolean),
  // IsQueued: Option(t.boolean),
  EventDesignation: Option(t.string),
  // EventInformation: Option(t.string || t.number),
  // EventNotes: Option(t.string || t.number),
  // CheckPersonalInformation: Option(t.boolean),
  // CorrespondencePersonId: Option(t.number),
  // CorrespondenceAddressTypeId: Option(t.string || t.number),
  // Billing1PersonId: Option(t.number),
  // Billing1AddressTypeId: Option(t.string || t.number),
  // Billing2PersonId: Option(t.string || t.number),
  // Billing2AddressTypeId: Option(t.string || t.number),
  // KindOfPaymentId1: Option(t.string || t.number),
  // KindOfPaymentEmail1: Option(t.string || t.number),
  // KindOfPaymentId2: Option(t.string || t.number),
  // KindOfPaymentEmail2: Option(t.string || t.number),
  // IdObject: Option(t.number),
  // IdSubscription: Option(t.number),
  // IdStatus: Option(t.number),
  // AnsweredQuestions: Option(t.string || t.number),
  // Messages: Option(t.string || t.number),
  // SubscriptionDetails: Option(t.array(SubscriptionDetail)),
  RegistrationDate: Option(LocalDateTimeFromString),
  // HRef: Option(t.string),
});

type SubscriptionDetail = t.TypeOf<typeof SubscriptionDetail>;
type Subscription = t.TypeOf<typeof Subscription>;
export { Subscription, SubscriptionDetail };
