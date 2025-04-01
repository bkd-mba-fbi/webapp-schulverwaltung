import { Injectable, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { Observable, map, of, switchMap } from "rxjs";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { CourseWithStudentCount } from "src/app/shared/models/course.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { catch404 } from "src/app/shared/utils/observable";
import { toLazySignal } from "src/app/shared/utils/to-lazy-signal";

export type EvaluationSortKey = "name" | "grade";

export type EvaluationEventType = "course" | "study-class";
export type EvaluationEvent = {
  id: number;
  designation: string;
  type: EvaluationEventType;
  studentCount: number;
  gradingScaleId: Option<number>;
};

const INITIAL_SORT_CRITERIA: SortCriteria<EvaluationSortKey> = {
  primarySortKey: "name",
  ascending: true,
};

const EVALUATION_CONTEXT = "events-evaluation";

@Injectable()
export class EvaluationStateService {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesRestService);
  private studyClassesService = inject(StudyClassesRestService);
  private loadingService = inject(LoadingService);

  sortCriteria = signal<Option<SortCriteria<EvaluationSortKey>>>(
    INITIAL_SORT_CRITERIA,
  );
  loading = toSignal(this.loadingService.loading(EVALUATION_CONTEXT), {
    requireSync: true,
  });

  eventId$ =
    this.route.parent?.params.pipe(
      map((params) => {
        const eventId = params["id"];
        return eventId ? Number(eventId) : null;
      }),
    ) ?? of(null);
  event = toLazySignal(
    this.eventId$.pipe(switchMap(this.loadEvaluationEvent.bind(this))),
    { initialValue: null },
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

  private loadEvaluationEvent(
    eventId: Option<number>,
  ): Observable<Option<EvaluationEvent>> {
    if (eventId === null) return of(null);

    // We need to fetch courses/study classes from their specific endpoints,
    // instead of using /Event/{id}, since the `Designation` is not correct on
    // the `Event`. The approach is to try to load the course first, then
    // fallback to study class. Like this at least for the courses we only need
    // one sequential request.
    return this.loadingService.load(
      this.loadCourse(eventId).pipe(
        switchMap((course) =>
          course ? of(course) : this.loadStudyClass(eventId),
        ),
      ),
      EVALUATION_CONTEXT,
    );
  }

  private loadCourse(eventId: number): Observable<Option<EvaluationEvent>> {
    return this.coursesService.getCourseWithStudentCount(eventId).pipe(
      catch404(),
      map((course) =>
        course ? this.buildEvaluationEventFromCourse(course) : null,
      ),
    );
  }

  private loadStudyClass(eventId: number): Observable<Option<EvaluationEvent>> {
    return this.studyClassesService.get(eventId).pipe(
      catch404(),
      map((studyClass) =>
        studyClass ? this.buildEvaluationEventFromStudyClass(studyClass) : null,
      ),
    );
  }

  private buildEvaluationEventFromCourse(
    course: CourseWithStudentCount,
  ): EvaluationEvent {
    return {
      id: course.Id,
      designation: `${course.Designation}, ${course.Classes?.map((c) => c.Number).join(", ")}`,
      type: "course",
      studentCount: course.AttendanceRef.StudentCount ?? 0,
      gradingScaleId: course.GradingScaleId,
    };
  }

  private buildEvaluationEventFromStudyClass(
    studyClass: StudyClass,
  ): EvaluationEvent {
    return {
      id: studyClass.Id,
      designation: studyClass.Designation,
      type: "study-class",
      studentCount: studyClass.StudentCount,
      gradingScaleId: null,
    };
  }
}
