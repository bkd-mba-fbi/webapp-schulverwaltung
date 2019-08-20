import * as t from 'io-ts';

const ModuleInstance = t.type({
  Id: t.number,
  // ModuleId: t.number,
  // EventCategory: t.string,
  // EventCategoryId: t.number,
  // Status: t.string,
  // StatusId: t.number,
  // DateFrom: Option(LocalDateTimeFromString),
  // DateTo: Option(LocalDateTimeFromString),
  Designation: t.string
  // DisplayText: t.string,
  // Duration: Option(t.number),
  // HasQueue: t.boolean,
  // LanguageOfInstruction: Option(t.string),
  // Location: Option(t.string),
  // MaxParticipants: t.number,
  // MinParticipants: t.number,
  // Note: Option(t.string),
  // Number: t.string,
  // SubscriptionDateTimeFrom: Option(LocalDateTimeFromString),
  // SubscriptionDateTimeTo: Option(LocalDateTimeFromString),
  // TimeFrom: Option(t.string),
  // TimeTo: Option(t.string),
  // HRef: t.string
});
type ModuleInstance = t.TypeOf<typeof ModuleInstance>;
export { ModuleInstance };
