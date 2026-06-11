import { format, subDays } from "date-fns";
import { EventScope } from "src/app/events/components/common/events-scope-select/events-scope-select.component";

export function getCourseFilterParamsForScope(
  scope: EventScope,
): Record<string, string> {
  const today = new Date();
  if (scope === "past") {
    return {
      "filter.DateTo": `<${format(today, "yyyy-MM-dd")}`,
    };
  }
  return {
    "filter.DateTo": `>${format(subDays(today, 1), "yyyy-MM-dd")}`,
  };
}
