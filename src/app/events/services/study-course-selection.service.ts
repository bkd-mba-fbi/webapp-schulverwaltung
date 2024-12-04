import { Injectable } from "@angular/core";
import { map, shareReplay } from "rxjs";
import { SelectionService } from "src/app/shared/services/selection.service";
import { StudentEntry } from "./events-students-state.service";

@Injectable()
export class StudyCourseSelectionService extends SelectionService<StudentEntry> {
  selectedIds$ = this.selection$.pipe(
    map((entries) => entries.map(({ id }) => id)),
    shareReplay(1),
  );
}
