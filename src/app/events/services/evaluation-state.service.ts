import { HttpContext } from "@angular/common/http";
import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Params } from "@angular/router";
import sortBy from "lodash-es/sortBy";
import uniqBy from "lodash-es/uniqBy";
import { Observable, combineLatest, map, of, startWith, switchMap } from "rxjs";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import { SubscriptionDetailsDisplay } from "src/app/shared/models/configurations.model";
import { CourseWithStudentCount } from "src/app/shared/models/course.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { ConfigurationsRestService } from "src/app/shared/services/configurations-rest.service";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { GradingItemsRestService } from "src/app/shared/services/grading-items-rest.service";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { catch404 } from "src/app/shared/utils/observable";
import { evaluationEntryComparator } from "../utils/evaluation";

export type EvaluationSortKey = "name" | "grade";

export type EvaluationEventType = "course" | "study-class";

export type EvaluationEvent = {
  id: number;
  designation: string;
  type: EvaluationEventType;
  studentCount: number;
  gradingScaleId: Option<number>;
};

export type EvaluationColumn = {
  vssId: number;
  title: string;
  tooltip: Option<string>;
  sort: string;
};

export type EvaluationSubscriptionDetail = {
  detail: SubscriptionDetail;
  value: Option<WritableSignal<SubscriptionDetail["Value"]>>;
};

export type EvaluationEntry = {
  gradingItem: GradingItem;
  grade: Option<Grade>;
  columns: ReadonlyArray<Option<EvaluationSubscriptionDetail>>;
  criteria: ReadonlyArray<EvaluationSubscriptionDetail>;
  evaluationRequired: boolean;
};

export type EvaluationSortCriteria = SortCriteria<EvaluationSortKey>;
const INITIAL_SORT_CRITERIA: EvaluationSortCriteria = {
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
  private configurationsService = inject(ConfigurationsRestService);
  private subscriptionDetailsService = inject(SubscriptionDetailsRestService);

  private eventId$ =
    (this.route.parent?.params ?? of({} as Params)).pipe(
      map((params) => {
        const eventId = params["id"];
        return eventId ? Number(eventId) : null;
      }),
    ) ?? of(null);

  ///// Public signals /////

  sortCriteria = signal<EvaluationSortCriteria>(INITIAL_SORT_CRITERIA);

  loading = toSignal(this.loadingService.loading(EVALUATION_CONTEXT), {
    requireSync: true,
  });

  noEvaluation = computed(
    () =>
      !this.gradingScale() &&
      this.columns().length === 0 &&
      this.entries().every(({ criteria }) => criteria.length === 0),
  );

  /**
   * The course or study class.
   */
  event = toSignal<Option<EvaluationEvent>>(
    this.eventId$.pipe(switchMap(this.loadEvaluationEvent.bind(this))),
    { initialValue: null },
  );

  /**
   * The columns of the evaluation table.
   */
  columns = computed(() =>
    this.collectColumns(this.columnSubscriptionDetails()),
  );

  /**
   * The rows of the evaluation table.
   */
  entries = computed(() =>
    this.sortEntries(this.unsortedEntries(), this.sortCriteria()),
  );

  gradingItems = linkedSignal({
    source: toSignal(
      this.eventId$.pipe(
        switchMap(this.loadGradingItems.bind(this)),
        startWith([]),
      ),
      { initialValue: [] },
    ),
    computation: (items) => items,
  });

  gradingScale = toSignal<Option<GradingScale>>(
    toObservable(this.event).pipe(
      switchMap((event) =>
        this.loadGradingScale(event?.gradingScaleId ?? null),
      ),
    ),
    { initialValue: null },
  );

  ///// Private signals /////

  /**
   * VssIds of the subscription details to decide whether to display them as
   * column or criteria.
   */
  private subscriptionDetailsDisplay = toSignal<
    Option<SubscriptionDetailsDisplay>
  >(this.loadSubscriptionDetailsDisplay(), { initialValue: null });

  /**
   * All subscription details of the event (of all persons, columns and
   * criteria).
   */
  private fetchedSubscriptionDetails: Signal<
    ReadonlyArray<SubscriptionDetail>
  > = toSignal(
    this.eventId$.pipe(switchMap(this.loadSubscriptionDetails.bind(this))),
    {
      initialValue: [],
    },
  );

  private subscriptionDetails = linkedSignal(() =>
    this.fetchedSubscriptionDetails(),
  );

  /**
   * Decouple the detail values from the details, since we don't want to
   * overwrite the value the user is currently editing, when the subscription
   * details are updated after a change of another detail. Also, we want to be
   * able to revert the value in case of an error during save.
   */
  private subscriptionDetailsValues = computed<
    Dict<WritableSignal<SubscriptionDetail["Value"]>>
  >(() =>
    this.fetchedSubscriptionDetails().reduce(
      (acc, detail) => ({
        ...acc,
        [this.getDetailId(detail)]: signal(detail.Value),
      }),
      {} as Dict<WritableSignal<SubscriptionDetail["Value"]>>,
    ),
  );

  /**
   * Subscription details of the event that should be displayed as columns (of
   * all persons).
   */
  private columnSubscriptionDetails = computed(() =>
    this.filterColumns(
      this.subscriptionDetails(),
      this.subscriptionDetailsDisplay(),
    ),
  );

  /**
   * Subscription details of the event that should be displayed as criteria (of
   * all persons).
   */
  private criteriaSubscriptionDetails = computed(() =>
    this.filterCriteria(
      this.subscriptionDetails(),
      this.subscriptionDetailsDisplay(),
    ),
  );

  private unsortedEntries = computed(() =>
    this.collectEntries(
      this.gradingItems(),
      this.gradingScale(),
      this.columns(),
      this.columnSubscriptionDetails(),
      this.criteriaSubscriptionDetails(),
      this.subscriptionDetailsValues(),
    ),
  );

  ///// Public methods /////

  updateGradingItems(gradingItems: ReadonlyArray<GradingItem>) {
    this.gradingItems.set(gradingItems);
  }

  updateSubscriptionDetail(
    detail: SubscriptionDetail,
    value: SubscriptionDetail["Value"],
  ): void {
    const updatedDetails: ReadonlyArray<SubscriptionDetail> =
      this.subscriptionDetails().map((existing) => {
        if (this.getDetailId(existing) === this.getDetailId(detail)) {
          return { ...existing, Value: value };
        }
        return existing;
      });

    this.subscriptionDetails.set(updatedDetails);
  }

  ///// Event (course/study-class) /////

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
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingForStatus: [404],
    });
    return this.coursesService
      .getCourseWithStudentCount(eventId, { context })
      .pipe(
        catch404(),
        map((course) =>
          course ? this.buildEvaluationEventFromCourse(course) : null,
        ),
      );
  }

  private loadStudyClass(eventId: number): Observable<Option<EvaluationEvent>> {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingForStatus: [404],
    });
    return this.studyClassesService.get(eventId, { context }).pipe(
      catch404(),
      map((studyClass) =>
        studyClass ? this.buildEvaluationEventFromStudyClass(studyClass) : null,
      ),
    );
  }

  private buildEvaluationEventFromCourse(
    course: CourseWithStudentCount,
  ): EvaluationEvent {
    const classes = course.Classes?.map((c) => c.Number) ?? [];
    const designation =
      classes.length > 0
        ? `${course.Designation}, ${classes.join(", ")}`
        : course.Designation;
    return {
      id: course.Id,
      designation,
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

  ///// Grades /////

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

  ///// Subscription details /////

  private loadSubscriptionDetailsDisplay(): Observable<SubscriptionDetailsDisplay> {
    return this.configurationsService.getSubscriptionDetailsDisplay();
  }

  private loadSubscriptionDetails(
    eventId: Option<number>,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    if (!eventId) return of([]);

    return this.subscriptionDetailsService.getListForEvent(eventId);
  }

  private filterColumns(
    subscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    subscriptionDetailsDisplay: Option<SubscriptionDetailsDisplay>,
  ): ReadonlyArray<SubscriptionDetail> {
    if (!subscriptionDetailsDisplay) return [];

    const columnDetailIds = subscriptionDetailsDisplay.adAsColumns;
    const columnDetails = subscriptionDetails.filter((detail) =>
      columnDetailIds.includes(Number(detail.VssId)),
    );
    return sortBy(columnDetails, (d) => d.Sort);
  }

  private filterCriteria(
    subscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    subscriptionDetailsDisplay: Option<SubscriptionDetailsDisplay>,
  ): ReadonlyArray<SubscriptionDetail> {
    if (!subscriptionDetailsDisplay) return [];

    const criteriaDetailIds = subscriptionDetailsDisplay.adAsCriteria;
    const criteriaDetails = subscriptionDetails.filter((detail) =>
      criteriaDetailIds.includes(Number(detail.VssId)),
    );
    return sortBy(criteriaDetails, (d) => d.Sort);
  }

  /**
   * Returns the unique identifier of a subscription detail.
   */
  private getDetailId(detail: SubscriptionDetail): string {
    return `${detail.Id}_${detail.IdPerson}`;
  }

  private buildDetailId(
    subscriptionDetailId: string,
    vssId: number,
    idPerson: number,
  ): string {
    return `${subscriptionDetailId}_${vssId}_${idPerson}`;
  }

  private getSubscriptionDetailValue(
    values: Dict<WritableSignal<SubscriptionDetail["Value"]>>,
    detail: SubscriptionDetail,
  ): Option<WritableSignal<SubscriptionDetail["Value"]>> {
    return values[this.getDetailId(detail)] ?? null;
  }

  ///// Evaluation columns & entries /////

  private collectColumns(
    columnSubscriptionDetails: ReadonlyArray<SubscriptionDetail>,
  ): ReadonlyArray<EvaluationColumn> {
    return uniqBy(columnSubscriptionDetails, (detail) => detail.VssId).map(
      (detail) => ({
        vssId: detail.VssId,
        title: detail.VssDesignation,
        tooltip: detail.Tooltip,
        sort: detail.Sort,
      }),
    );
  }

  private collectEntries(
    gradingItems: ReadonlyArray<GradingItem>,
    gradingScale: Option<GradingScale>,
    columns: ReadonlyArray<EvaluationColumn>,
    columnSubscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    criteriaSubscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    subscriptionDetailsValues: Dict<
      WritableSignal<SubscriptionDetail["Value"]>
    >,
  ): ReadonlyArray<EvaluationEntry> {
    return gradingItems.map((gradingItem) =>
      this.buildEntry(
        gradingItem,
        gradingScale,
        columns,
        columnSubscriptionDetails,
        criteriaSubscriptionDetails,
        subscriptionDetailsValues,
      ),
    );
  }

  private buildEntry(
    gradingItem: GradingItem,
    gradingScale: Option<GradingScale>,
    columns: ReadonlyArray<EvaluationColumn>,
    columnSubscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    criteriaSubscriptionDetails: ReadonlyArray<SubscriptionDetail>,
    subscriptionDetailsValues: Dict<
      WritableSignal<SubscriptionDetail["Value"]>
    >,
  ): EvaluationEntry {
    const rawColumnDetails = columnSubscriptionDetails.filter(
      (detail) => detail.IdPerson === gradingItem.IdPerson,
    );
    const columnDetails = columns.map(
      // Make sure every entry has the same number of columns, even if some are null
      ({ vssId }) =>
        rawColumnDetails.find((detail) => detail.VssId === vssId) ?? null,
    );
    const criteriaDetails = criteriaSubscriptionDetails.filter(
      (detail) => detail.IdPerson === gradingItem.IdPerson,
    );

    return {
      gradingItem,
      grade: this.findGrade(gradingItem, gradingScale),
      columns: columnDetails.map((detail) =>
        !detail
          ? null
          : {
              detail,
              value: this.getSubscriptionDetailValue(
                subscriptionDetailsValues,
                detail,
              ),
            },
      ),
      criteria: criteriaDetails.map((detail) => ({
        detail,
        value: this.getSubscriptionDetailValue(
          subscriptionDetailsValues,
          detail,
        ),
      })),

      evaluationRequired: this.isEvaluationRequired(
        gradingItem,
        gradingScale,
        columnDetails,
        criteriaDetails,
        subscriptionDetailsValues[
          this.buildDetailId(gradingItem.Id, 3959, gradingItem.IdPerson)
        ] ?? null,
      ),
    };
  }

  isEvaluationRequired(
    gradingItem: GradingItem,
    gradingScale: Option<GradingScale>,
    columnDetails: (SubscriptionDetail | null)[],
    criteriaDetails: ReadonlyArray<SubscriptionDetail>,
    subscriptionValue: Option<WritableSignal<SubscriptionDetail["Value"]>>,
  ): boolean {
    // is a grading event with no grade set
    const grade = gradingScale && this.findGrade(gradingItem, gradingScale);
    if (grade === null) {
      return true;
    }
    // has mandatory column or criteria with no value set
    if (
      [...columnDetails, ...criteriaDetails].some(
        (detail) => detail?.VssInternet === "M" && detail?.Value === null,
      )
    ) {
      return true;
    }
    // has unsufficient grade with subscription detail id 3959 and has no formative criteria set
    if (
      !grade.Sufficient &&
      subscriptionValue !== null &&
      criteriaDetails.filter((detail) => detail?.Value !== null).length === 0
    ) {
      return true;
    }

    return false;
  }

  private findGrade(
    gradingItem: GradingItem,
    gradingScale: Option<GradingScale>,
  ): Option<Grade> {
    const grades = gradingScale?.Grades ?? [];
    if (gradingItem.IdGrade) {
      return grades.find((grade) => grade.Id === gradingItem.IdGrade) ?? null;
    }
    return null;
  }

  private sortEntries(
    entries: ReadonlyArray<EvaluationEntry>,
    sortCriteria: EvaluationSortCriteria,
  ): ReadonlyArray<EvaluationEntry> {
    return [...entries].sort(evaluationEntryComparator(sortCriteria));
  }
}
