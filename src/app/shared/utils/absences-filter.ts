import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";
import { addDays, format, isSameDay, subDays } from "date-fns";
import { EditAbsencesFilter } from "src/app/edit-absences/services/edit-absences-state.service";
import { EvaluateAbsencesFilter } from "src/app/evaluate-absences/services/evaluate-absences-state.service";

export function buildParamsFromAbsenceFilter(
  filter: EditAbsencesFilter | EvaluateAbsencesFilter,
): Params {
  return Object.keys(filter).reduce((acc, name) => {
    const value = serializeFilterValue(
      (filter as unknown as Record<string, unknown>)[name],
    );
    if (value) {
      return { ...acc, [name]: value };
    }
    return acc;
  }, {});
}

export function addAbsencesFilterDateParams<
  TFilter extends {
    dateFrom: Option<Date>;
    dateTo: Option<Date>;
  },
>(absencesFilter: TFilter, params: HttpParams): HttpParams {
  if (
    absencesFilter.dateFrom &&
    absencesFilter.dateTo &&
    isSameDay(absencesFilter.dateFrom, absencesFilter.dateTo)
  ) {
    params = params.set(
      "filter.LessonDateTimeFrom",
      `=${format(absencesFilter.dateFrom, "yyyy-MM-dd")}`,
    );
  } else {
    if (absencesFilter.dateFrom) {
      params = params.set(
        "filter.LessonDateTimeFrom",
        `>${format(subDays(absencesFilter.dateFrom, 1), "yyyy-MM-dd")}`,
      );
    }
    if (absencesFilter.dateTo) {
      params = params.set(
        "filter.LessonDateTimeTo",
        `<${format(addDays(absencesFilter.dateTo, 1), "yyyy-MM-dd")}`,
      );
    }
  }
  return params;
}

function serializeFilterValue(value: unknown): Option<string> {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return format(value, "yyyy-MM-dd");
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
}
