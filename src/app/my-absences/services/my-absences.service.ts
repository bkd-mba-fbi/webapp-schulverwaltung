import { Inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, combineLatest } from "rxjs";
import {
  filter,
  map,
  share,
  shareReplay,
  startWith,
  switchMap,
  take,
} from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonAbsence } from "src/app/shared/models/lesson-absence.model";
import { LessonIncident } from "src/app/shared/models/lesson-incident.model";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentProfileAbsencesCounts } from "src/app/shared/services/student-profile-absences.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { notNull } from "src/app/shared/utils/filter";
import { spread } from "src/app/shared/utils/function";
import { sortLessonPresencesByDate } from "src/app/shared/utils/lesson-presences";

@Injectable()
export class MyAbsencesService {
  private studentId$ = new ReplaySubject<number>(1);
  private lessonAbsences$ =
    // Includes lesson absences without a corresponding timetable
    // entry (i.e. for which no lesson presence entry will be built)
    this.studentId$.pipe(
      switchMap(this.loadLessonAbsences.bind(this)),
      shareReplay(1),
    );
  private lessonIncidents$ = this.studentId$.pipe(
    switchMap(this.loadLessonIncidents.bind(this)),
    shareReplay(1),
  );
  private lessonPresences$ = this.getLessonPresences();

  checkableAbsences$ = this.getAbsences(this.settings.checkableAbsenceStateId);
  openAbsences$ = this.getAbsences(this.settings.unconfirmedAbsenceStateId);
  excusedAbsences$ = this.getAbsences(this.settings.excusedAbsenceStateId);
  unexcusedAbsences$ = this.getAbsences(this.settings.unexcusedAbsenceStateId);
  incidents$ = this.getAbsences(null);

  // The halfDays are not provided by intention, since there is no
  // reliable method for counting them.

  // The open absences as full lesson absence models
  openLessonAbsences$ = combineLatest([
    this.openAbsences$.pipe(filter(notNull)),
    this.lessonAbsences$,
  ]).pipe(map(spread(this.getLessonAbsences.bind(this))), shareReplay(1));

  // The checkable absences as full lesson absence models
  checkableLessonAbsences$ = combineLatest([
    this.checkableAbsences$.pipe(filter(notNull)),
    this.lessonAbsences$,
  ]).pipe(map(spread(this.getLessonAbsences.bind(this))), shareReplay(1));

  // Excused absences as full lesson absence models
  excusedLessonAbsences$ = combineLatest([
    this.excusedAbsences$.pipe(filter(notNull)),
    this.lessonAbsences$,
  ]).pipe(map(spread(this.getLessonAbsences.bind(this))), shareReplay(1));

  // Unexcused absences as full lesson absence models
  unexcusedLessonAbsences$ = combineLatest([
    this.unexcusedAbsences$.pipe(filter(notNull)),
    this.lessonAbsences$,
  ]).pipe(map(spread(this.getLessonAbsences.bind(this))), shareReplay(1));

  incidentsLessonAbsences$ = combineLatest([
    this.incidents$.pipe(filter(notNull)),
    this.lessonIncidents$,
  ]).pipe(map(spread(this.getLessonIncidents.bind(this))), shareReplay(1));

  counts$ = this.getCounts();

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService,
    private studentsService: StudentsRestService,
  ) {
    const studentId = this.storageService.getPayload()?.id_person;
    if (studentId) {
      this.studentId$.next(Number(studentId));
    }
  }

  reset(): void {
    this.studentId$
      .pipe(take(1))
      .subscribe((studentId) => this.studentId$.next(studentId));
  }

  private getLessonPresences(): Observable<
    Option<ReadonlyArray<LessonPresence>>
  > {
    return this.getCached(
      combineLatest([
        this.studentId$,
        this.lessonAbsences$,
        this.lessonIncidents$,
      ]).pipe(
        switchMap(([studentId, absences, incidents]) =>
          this.loadTimetableEntries(studentId, absences, incidents).pipe(
            map((timetableEntries) =>
              this.buildLessonPresences(absences, incidents, timetableEntries),
            ),
          ),
        ),
        map(sortLessonPresencesByDate),
      ),
    );
  }

  private getAbsences(
    confirmationStateId: Option<number>,
  ): Observable<Option<ReadonlyArray<LessonPresence>>> {
    return this.getCached(
      this.lessonPresences$.pipe(
        map(
          (presences) =>
            presences?.filter(
              (p) => p.ConfirmationStateId === confirmationStateId,
            ) || null,
        ),
      ),
    );
  }

  private getLessonAbsences(
    absences: ReadonlyArray<LessonPresence>,
    lessonAbsences: ReadonlyArray<LessonAbsence>,
  ): ReadonlyArray<LessonAbsence> {
    const lessonIds = absences.map((a) => a.LessonRef.Id);
    return lessonAbsences.filter((a) => lessonIds.includes(a.LessonRef.Id));
  }

  private getLessonIncidents(
    absences: ReadonlyArray<LessonPresence>,
    lessonIncidents: ReadonlyArray<LessonIncident>,
  ): ReadonlyArray<LessonIncident> {
    const incidentIds = absences.map((a) => a.LessonRef.Id);
    return lessonIncidents.filter((i) => incidentIds.includes(i.LessonRef.Id));
  }

  private getCounts(): Observable<StudentProfileAbsencesCounts> {
    return combineLatest([
      this.getCount(this.checkableAbsences$),
      this.getCount(this.openAbsences$),
      this.getCount(this.excusedAbsences$),
      this.getCount(this.unexcusedAbsences$),
      this.getCount(this.incidents$),
    ]).pipe(
      map(
        ([
          checkableAbsences,
          openAbsences,
          excusedAbsences,
          unexcusedAbsences,
          incidents,
        ]) => ({
          checkableAbsences,
          openAbsences,
          excusedAbsences,
          unexcusedAbsences,
          incidents,
          halfDays: null,
        }),
      ),
    );
  }

  private getCached<T>(source$: Observable<T>): Observable<Option<T>> {
    return source$.pipe(
      startWith(null),
      // Clear the cache if all subscribers disconnect (don't replay the previous value)
      share({ connector: () => new ReplaySubject<Option<T>>(1) }),
    );
  }

  private getCount(
    source$: Observable<Option<ReadonlyArray<unknown>>>,
  ): Observable<Option<number>> {
    return source$.pipe(map((absences) => absences?.length ?? null));
  }

  private loadLessonAbsences(
    studentId: number,
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.studentsService.getLessonAbsences(studentId);
  }

  private loadLessonIncidents(
    studentId: number,
  ): Observable<ReadonlyArray<LessonIncident>> {
    return this.studentsService.getLessonIncidents(studentId);
  }

  private loadTimetableEntries(
    studentId: number,
    absences: ReadonlyArray<LessonAbsence>,
    incidents: ReadonlyArray<LessonIncident>,
  ): Observable<ReadonlyArray<TimetableEntry>> {
    return this.studentsService.getTimetableEntries(studentId, {
      "filter.Id": `;${[...absences, ...incidents]
        .map((e) => e.LessonRef.Id)
        .join(";")}`,
    });
  }

  private buildLessonPresences(
    absences: ReadonlyArray<LessonAbsence>,
    incidents: ReadonlyArray<LessonIncident>,
    timetableEntries: ReadonlyArray<TimetableEntry>,
  ): ReadonlyArray<LessonPresence> {
    return [...absences, ...incidents]
      .map((absence) => this.buildLessonPresence(absence, timetableEntries))
      .filter(notNull);
  }

  /**
   * Construct a lesson presence object for the given absence/incident
   * using the data from the corresponding timetable entry.
   */
  private buildLessonPresence(
    absence: LessonAbsence | LessonIncident,
    timetableEntries: ReadonlyArray<TimetableEntry>,
  ): Option<LessonPresence> {
    const entry = timetableEntries.find((e) => e.Id === absence.LessonRef.Id);
    if (!entry) {
      // Ignore absences without corresponding timetable entry
      return null;
    }

    return {
      Id: "",
      LessonRef: {
        Id: absence.LessonRef.Id,
        HRef: absence.LessonRef.HRef ? absence.LessonRef.HRef : null,
      },
      StudentRef: absence.StudentRef,
      EventRef: { Id: 0, HRef: null },
      TypeRef: absence.TypeRef,
      RegistrationRef: { Id: 0, HRef: null },
      StudyClassRef: { Id: 0, HRef: null },
      ConfirmationStateId:
        "ConfirmationStateId" in absence ? absence.ConfirmationStateId : null,
      EventDesignation: entry.EventDesignation,
      HasStudyCourseConfirmationCode: false,
      LessonDateTimeFrom: entry.From,
      LessonDateTimeTo: entry.To,
      Comment: null,
      Date: entry.From,
      Type: absence.Type,
      StudentFullName: absence.StudentFullName,
      StudyClassNumber: "", // Currently not available on timetable entry
      TeacherInformation: entry.EventManagerInformation,
    };
  }
}
