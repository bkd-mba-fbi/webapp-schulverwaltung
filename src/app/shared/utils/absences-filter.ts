import { HttpParams } from '@angular/common/http';
import { format } from 'date-fns';

import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';

export function buildHttpParamsFromAbsenceFilter(
  filter: EditAbsencesFilter | EvaluateAbsencesFilter
): HttpParams {
  return Object.keys(filter).reduce((acc, name) => {
    const value = serializeFilterValue((filter as any)[name]);
    if (value) {
      return acc.set(name, value);
    }
    return acc;
  }, new HttpParams());
}

function serializeFilterValue(value: any): Option<string> {
  if (!value) {
    return value;
  }
  if (value instanceof Date) {
    return format(value, 'yyyy-MM-dd');
  }
  return String(value);
}
