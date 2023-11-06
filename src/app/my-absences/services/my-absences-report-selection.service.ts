import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LessonPresence } from "../../shared/models/lesson-presence.model";
import { SelectionService } from "../../shared/services/selection.service";
import { getIdsGroupedByPerson } from "../../shared/utils/lesson-presences";

@Injectable()
export class MyAbsencesReportSelectionService extends SelectionService<LessonPresence> {
  selectedIds$ = this.selection$.pipe(map(getIdsGroupedByPerson));
}
