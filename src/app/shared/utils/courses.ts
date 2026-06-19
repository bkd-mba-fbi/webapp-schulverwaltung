import { startOfDay } from "date-fns";
import { EventScope } from "src/app/events/components/common/events-scope-select/events-scope-select.component";

export function filterEventsForScope<T extends { DateTo: Option<Date> }>(
  scope: EventScope,
  events: ReadonlyArray<T>,
): ReadonlyArray<T> {
  const today = startOfDay(new Date());
  return events.filter(
    (event) =>
      (scope === "current" && (!event.DateTo || event.DateTo >= today)) ||
      (scope === "past" && event.DateTo && event.DateTo < today),
  );
}
