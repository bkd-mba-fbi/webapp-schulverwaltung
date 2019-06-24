import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { SelectionService } from 'src/app/shared/services/selection.service';
import { OpenAbsencesEntry } from '../models/open-absences-entry.model';
import { getIdsGroupedByPerson } from 'src/app/shared/utils/lesson-presences';
import { flattenOpenAbsencesEntries } from '../utils/open-absences-entries';

@Injectable()
export class OpenAbsencesEntriesSelectionService extends SelectionService<
  OpenAbsencesEntry
> {
  selectedIds$ = this.selection$.pipe(
    map(entries => getIdsGroupedByPerson(flattenOpenAbsencesEntries(entries)))
  );
}
