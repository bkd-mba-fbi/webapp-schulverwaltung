import { Injectable, computed, signal } from "@angular/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { Event } from "src/app/shared/models/event.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";

export type EvaluationSortKey = "name" | "grade";

const INITIAL_SORT_CRITERIA: SortCriteria<EvaluationSortKey> = {
  primarySortKey: "name",
  ascending: true,
};
const STUDY_CLASS_EVENT_TYPE_ID = 10;

@Injectable({
  providedIn: "root",
})
export class EvaluationStateService {
  sortCriteria = signal<Option<SortCriteria<EvaluationSortKey>>>(
    INITIAL_SORT_CRITERIA,
  );
  loading = signal(false);
  event = signal<Option<Event>>({
    Id: 10064,
    Designation: "Mathematik-ALB, BVS2024a",
    EventTypeId: 1,
    StudentCount: 23,
    Leadership: undefined,
  });
  isStudyClass = computed(
    () => this.event()?.EventTypeId === STUDY_CLASS_EVENT_TYPE_ID,
  );
  gradingItems = signal<ReadonlyArray<GradingItem>>([
    {
      Id: "1",
      IdPerson: 1,
      PersonFullname: "Paul McCartney",
      IdGrade: null,
      GradeValue: null,
    },
    {
      Id: "2",
      IdPerson: 2,
      PersonFullname: "John Lennon",
      IdGrade: null,
      GradeValue: null,
    },
    {
      Id: "3",
      IdPerson: 3,
      PersonFullname: "George Harrison",
      IdGrade: null,
      GradeValue: null,
    },
    {
      Id: "4",
      IdPerson: 4,
      PersonFullname: "Ringo Starr",
      IdGrade: null,
      GradeValue: null,
    },
  ]);
}
