import { Params } from '@angular/router';
import { format } from 'date-fns';

import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';

export function buildParamsFromAbsenceFilter(
  filter: EditAbsencesFilter | EvaluateAbsencesFilter
): Params {
  return Object.keys(filter).reduce((acc, name) => {
    const value = serializeFilterValue((filter as any)[name]);
    if (value) {
      return { ...acc, [name]: value };
    }
    return acc;
  }, {});
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
