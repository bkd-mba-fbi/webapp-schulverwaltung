import { Injectable } from '@angular/core';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { SelectionService } from 'src/app/shared/services/selection.service';
import { map } from 'rxjs/operators';
import { getIdsGroupedByPerson } from 'src/app/shared/utils/lesson-presences';

@Injectable()
export class BlockLessonSelectionService extends SelectionService<
  LessonPresence
> {
  selectedIds$ = this.selection$.pipe(
    map(presences => presences.map(presence => presence.LessonRef.Id))
  );
}
