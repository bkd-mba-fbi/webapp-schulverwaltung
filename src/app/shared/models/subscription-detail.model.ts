import * as t from 'io-ts';
import { Option } from './common-types';

const DropDownItem = t.type({
  Key: t.string,
  Value: t.string,
});

const SubscriptionDetail = t.type({
  Id: t.string,
  SubscriptionId: t.number,
  VssId: t.number,
  EventId: t.number,
  // OpenInvoiceBookingId: Option(t.number),
  // BookingType: Option(t.string),
  DropdownItems: Option(t.array(DropDownItem)),
  // EnteringType: t.string,
  IdPerson: t.number,
  // IsValidated: t.boolean,
  // IsValidationMessage: t.boolean,
  // IsValidationStatus: t.boolean,
  // Required: t.boolean,
  ShowAsRadioButtons: t.boolean,
  // Sort: t.string,
  // Tooltip: Option(t.string),
  Value: Option(t.string),
  // VssDesignation: t.string,
  // VssStyleDescription: t.string,
  // VssStyle: t.string,
  // VssTypeId: t.number,
  // VssType: t.string,
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
  // VssInternet: t.string,
  // HRef: t.string,
});

type SubscriptionDetail = t.TypeOf<typeof SubscriptionDetail>;
export { SubscriptionDetail as SubscriptionDetail };