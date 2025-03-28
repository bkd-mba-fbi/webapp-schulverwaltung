import { Injectable, signal } from "@angular/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { Event } from "src/app/shared/models/event.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";

export type EvaluationSortKey = "PersonFullname" | "GradeValue";

const INITIAL_SORT_CRITERIA: SortCriteria<EvaluationSortKey> = {
  primarySortKey: "PersonFullname",
  ascending: true,
};

@Injectable({
  providedIn: "root",
})
export class EvaluationStateService {
  sortCriteria = signal<Option<SortCriteria<EvaluationSortKey>>>(
    INITIAL_SORT_CRITERIA,
  );
  loading = signal(false);
  event = signal<Option<Event>>({
    Id: 1,
    Designation: "Mathematik-ALB, BVS2024a",
    StudentCount: 23,
    Leadership: undefined,
  });
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
