import * as t from "io-ts";

const EventLeadership = t.type({
  Id: t.number,
  EventId: t.number,
  PersonId: t.number,
  // Role: t.string,
  // RoleId: t.number,
  // HRef: t.string,
});

type EventLeadership = t.TypeOf<typeof EventLeadership>;
export { EventLeadership };
