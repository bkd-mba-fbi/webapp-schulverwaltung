import { Injectable, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest, map, of, startWith, switchMap } from "rxjs";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { CourseWithStudentCount } from "src/app/shared/models/course.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { GradingItemsRestService } from "src/app/shared/services/grading-items-rest.service";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { catch404 } from "src/app/shared/utils/observable";

export type EvaluationSortKey = "name" | "grade";

export type EvaluationEventType = "course" | "study-class";
export type EvaluationEvent = {
  id: number;
  designation: string;
  type: EvaluationEventType;
  studentCount: number;
  gradingScaleId: Option<number>;
};

export type EvaluationEntry = {
  gradingItem: GradingItem;
  grade: Option<Grade>;
};

const INITIAL_SORT_CRITERIA: SortCriteria<EvaluationSortKey> = {
  primarySortKey: "name",
  ascending: true,
};

const EVALUATION_CONTEXT = "events-evaluation";

@Injectable()
export class EvaluationStateService {
  private route = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);
  private coursesService = inject(CoursesRestService);
  private studyClassesService = inject(StudyClassesRestService);
  private gradingItemsService = inject(GradingItemsRestService);
  private gradingScalesService = inject(GradingScalesRestService);

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
  event = toSignal<Option<EvaluationEvent>>(
    this.eventId$.pipe(switchMap(this.loadEvaluationEvent.bind(this))),
    { initialValue: null },
  );

  gradingItems = toSignal<ReadonlyArray<GradingItem>>(
    this.eventId$.pipe(
      switchMap(this.loadGradingItems.bind(this)),
      startWith([]),
    ),
    // { initialValue: [] as ReadonlyArray<GradingItem> },
    { requireSync: true },
  );
  gradingScale = toSignal<Option<GradingScale>>(
    toObservable(this.event).pipe(
      switchMap((event) =>
        this.loadGradingScale(event?.gradingScaleId ?? null),
      ),
    ),
    { initialValue: null },
  );

  entries = computed(() =>
    this.collectEntries(this.gradingItems(), this.gradingScale()),
  );

  private loadEvaluationEvent(
    eventId: Option<number>,
  ): Observable<Option<EvaluationEvent>> {
    if (eventId === null) return of(null);

    // We need to fetch courses/study classes from their specific endpoints,
    // instead of using /Event/{id}, since the `Designation` is not correct on
    // the `Event`. The approach is to try to load both and the the one that
    // will succeed.
    return this.loadingService.load(
      combineLatest([
        this.loadCourse(eventId),
        this.loadStudyClass(eventId),
      ]).pipe(map(([course, studyClass]) => course ?? studyClass)),
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

  private loadGradingItems(
    eventId: Option<number>,
  ): Observable<ReadonlyArray<GradingItem>> {
    if (!eventId) return of([]);

    return this.gradingItemsService.getListForEvent(eventId);
  }

  private loadGradingScale(
    gradingScaleId: Option<number>,
  ): Observable<Option<GradingScale>> {
    if (!gradingScaleId) return of(null);

    return this.gradingScalesService.get(gradingScaleId);
  }

  private collectEntries(
    gradingItems: ReadonlyArray<GradingItem>,
    gradingScale: Option<GradingScale>,
  ): ReadonlyArray<EvaluationEntry> {
    const grades = gradingScale?.Grades ?? [];

    return gradingItems.map((gradingItem) => {
      let grade: Option<Grade> = null;
      if (gradingItem.IdGrade) {
        grade =
          grades.find((grade) => grade.Id === gradingItem.IdGrade) ?? null;
      }
      return {
        gradingItem,
        grade,
      };
    });
  }
}
