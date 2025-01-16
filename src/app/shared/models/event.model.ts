import * as t from "io-ts";
import { Maybe } from "./common-types";

const Event = t.type({
  Id: t.number,
  // AreaOfEducation: t.string,
  // AreaOfEducationId: t.number,
  // EventCategory: t.string,
  // EventCategoryId: t.number,
  // EventLevel: t.string,
  // EventLevelId: t.number,
  // EventType: t.string,
  // EventTypeId: t.number,
  // Host: t.string,
  // HostId: t.string,
  // Status: t.string,
  // StatusId: t.number,
  // AllowSubscriptionByStatus: t.boolean,
  // AllowSubscriptionInternetByStatus: t.boolean,
  // DateFrom: null,
  // DateTo: null,
  Designation: t.string,
  // Duration: null,
  // FreeSeats: null,
  // HasQueue: t.boolean,
  // HighPrice: t.number,
  // LanguageOfInstruction: null,
  Leadership: Maybe(t.string),
  // Location: null,
  // MaxParticipants: t.number,
  // MinParticipants: t.number,
  // Number: t.string,
  // Price: t.number,
  // StatusDate: null,
  // SubscriptionDateFrom: null,
  // SubscriptionDateTo: null,
  // SubscriptionTimeFrom: null,
  // SubscriptionTimeTo: null,
  // TimeFrom: null,
  // TimeTo: null,
  // TypeOfSubscription: t.number,
  // Weekday: null,
  // IdObject: t.number,
  // StatusText: null,
  // Management: null,
  // GradingScaleId: null,
  // DateString: t.string,
  StudentCount: t.number,
  // HRef: t.string,
});

const EventSummary = t.type({
  Id: t.number,
  EventType: t.string,
  EventTypeId: t.number,
  Designation: t.string,
});

type Event = t.TypeOf<typeof Event>;
type EventSummary = t.TypeOf<typeof EventSummary>;
export { Event, EventSummary };
