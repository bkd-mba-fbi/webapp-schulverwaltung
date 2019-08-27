import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { SelectionService } from 'src/app/shared/services/selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { getIdsGroupedByPerson } from 'src/app/shared/utils/lesson-presences';

@Injectable()
export class EditAbsencesSelectionService extends SelectionService<
  LessonPresence
> {
  selectedIds$ = this.selection$.pipe(map(getIdsGroupedByPerson));
}
