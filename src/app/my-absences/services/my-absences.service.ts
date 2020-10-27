import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import {
  switchMap,
  startWith,
  multicast,
  refCount,
  map,
  take,
  shareReplay,
  filter,
} from 'rxjs/operators';

import { SETTINGS, Settings } from 'src/app/settings';
import { StudentProfileAbsencesCounts } from 'src/app/shared/services/student-profile-absences.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { LessonAbsence } from 'src/app/shared/models/lesson-absence.model';
import { LessonIncident } from 'src/app/shared/models/lesson-incident.model';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { TimetableEntry } from 'src/app/shared/models/timetable-entry.model';
import { sortLessonPresencesByDate } from 'src/app/shared/utils/lesson-presences';
import { notNull } from 'src/app/shared/utils/filter';
import { spread } from 'src/app/shared/utils/function';

@Injectable()
export class MyAbsencesService {
  private studentId$ = new ReplaySubject<number>(1);
  private rawLessonAbsences$ =
    // Includes lesson absences without a corresponding timetable
    // entry (i.e. for which no lesson presence entry will be built)
    this.studentId$.pipe(
      switchMap(this.loadLessonAbsences.bind(this)),
      shareReplay(1)
    );
  private lessonIncidents$ = this.studentId$.pipe(
    switchMap(this.loadLessonIncidents.bind(this)),
    shareReplay(1)
  );
  private lessonPresences$ = this.getLessonPresences();

  openAbsences$ = this.getAbsences(this.settings.unconfirmedAbsenceStateId);
  excusedAbsences$ = this.getAbsences(this.settings.excusedAbsenceStateId);
  unexcusedAbsences$ = this.getAbsences(this.settings.unexcusedAbsenceStateId);
  incidents$ = this.getAbsences(null);

  // The halfDays are not provided by intention, since there is no
  // reliable method for counting them.

  // Only lesson absences with a corresponding timetable entry
  lessonAbsences$ = combineLatest([
    this.rawLessonAbsences$,
    this.openAbsences$.pipe(filter(notNull)),
    this.excusedAbsences$.pipe(filter(notNull)),
    this.unexcusedAbsences$.pipe(filter(notNull)),
  ]).pipe(
    map(spread(this.getLessonAbsencesWithTimetableEntry.bind(this))),
    shareReplay(1)
  );

  counts$ = this.getCounts();

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService,
    private studentsService: StudentsRestService
  ) {
    const studentId = this.storageService.getPayload()?.id_person || null;
    if (studentId) {
      this.studentId$.next(studentId);
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
        this.rawLessonAbsences$,
        this.lessonIncidents$,
      ]).pipe(
        switchMap(([studentId, absences, incidents]) =>
          this.loadTimetableEntries(studentId, absences, incidents).pipe(
            map((timetableEntries) =>
              this.buildLessonPresences(absences, incidents, timetableEntries)
            )
          )
        ),
        map(sortLessonPresencesByDate)
      )
    );
  }

  private getAbsences(
    confirmationStateId: Option<number>
  ): Observable<Option<ReadonlyArray<LessonPresence>>> {
    return this.getCached(
      this.lessonPresences$.pipe(
        map(
          (presences) =>
            presences?.filter(
              (p) => p.ConfirmationStateId === confirmationStateId
            ) || null
        )
      )
    );
  }

  private getCounts(): Observable<StudentProfileAbsencesCounts> {
    return combineLatest([
      this.getCount(this.openAbsences$),
      this.getCount(this.excusedAbsences$),
      this.getCount(this.unexcusedAbsences$),
      this.getCount(this.incidents$),
    ]).pipe(
      map(([openAbsences, excusedAbsences, unexcusedAbsences, incidents]) => ({
        openAbsences,
        excusedAbsences,
        unexcusedAbsences,
        incidents,
        halfDays: null,
      }))
    );
  }

  private getCached<T>(source$: Observable<T>): Observable<Option<T>> {
    return source$.pipe(
      startWith(null),
      // Clear the cache if all subscribers disconnect (don't replay the previous value)
      multicast(() => new ReplaySubject<Option<T>>(1)),
      refCount()
    );
  }

  private getCount(
    source$: Observable<Option<ReadonlyArray<any>>>
  ): Observable<Option<number>> {
    return source$.pipe(map((absences) => absences?.length ?? null));
  }

  private loadLessonAbsences(
    studentId: number
  ): Observable<ReadonlyArray<LessonAbsence>> {
    return this.studentsService.getLessonAbsences(studentId);
  }

  private loadLessonIncidents(
    studentId: number
  ): Observable<ReadonlyArray<LessonIncident>> {
    return this.studentsService.getLessonIncidents(studentId);
  }

  private loadTimetableEntries(
    studentId: number,
    absences: ReadonlyArray<LessonAbsence>,
    incidents: ReadonlyArray<LessonIncident>
  ): Observable<ReadonlyArray<TimetableEntry>> {
    return this.studentsService.getTimetableEntries(studentId, {
      'filter.Id': `;${[...absences, ...incidents]
        .map((e) => e.LessonRef.Id)
        .join(';')}`,
      fields: 'Id,From,To,EventNumber,EventDesignation,EventManagerInformation',
    });
  }

  private buildLessonPresences(
    absences: ReadonlyArray<LessonAbsence>,
    incidents: ReadonlyArray<LessonIncident>,
    timetableEntries: ReadonlyArray<TimetableEntry>
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
    timetableEntries: ReadonlyArray<TimetableEntry>
  ): Option<LessonPresence> {
    const entry = timetableEntries.find((e) => e.Id === absence.LessonRef.Id);
    if (!entry) {
      // Ignore absences without corresponding timetable entry
      return null;
    }

    return {
      Id: '',
      LessonRef: absence.LessonRef,
      StudentRef: absence.StudentRef,
      EventRef: { Id: 0, HRef: null },
      TypeRef: absence.TypeRef,
      ConfirmationStateId:
        'ConfirmationStateId' in absence ? absence.ConfirmationStateId : null,
      EventDesignation: entry.EventDesignation,
      HasStudyCourseConfirmationCode: false,
      LessonDateTimeFrom: entry.From,
      LessonDateTimeTo: entry.To,
      Comment: null,
      Date: entry.From,
      Type: absence.Type,
      StudentFullName: absence.StudentFullName,
      StudyClassNumber: '', // Currently not available on timetable entry
      TeacherInformation: entry.EventManagerInformation,
      WasAbsentInPrecedingLesson: false,
    };
  }

  /**
   * To not have to cache the timetable entries, we use the lesson
   * presences to get only the lesson presences that have a corresponding
   * timetable entry.
   */
  private getLessonAbsencesWithTimetableEntry(
    lessonAbsences: ReadonlyArray<LessonAbsence>,
    openAbsences: ReadonlyArray<LessonPresence>,
    excusedAbsences: ReadonlyArray<LessonPresence>,
    unexcusedAbsences: ReadonlyArray<LessonPresence>
  ): ReadonlyArray<LessonAbsence> {
    const presenceIds = [
      ...openAbsences,
      ...excusedAbsences,
      ...unexcusedAbsences,
    ].map((p) => p.LessonRef.Id);
    return lessonAbsences.filter((a) => presenceIds.includes(a.LessonRef.Id));
  }
}
