import { Inject, Injectable } from "@angular/core";
import {
  combineLatest,
  map,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs";
import { Settings, SETTINGS } from "../../settings";
import { UserSettingsService } from "../../shared/services/user-settings.service";
import { LessonPresencesRestService } from "../../shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "../../shared/services/students-rest.service";
import { LessonAbsence } from "../../shared/models/lesson-absence.model";
import { StorageService } from "../../shared/services/storage.service";
import { CoursesRestService } from "../../shared/services/courses-rest.service";
import { LessonIncident } from "../../shared/models/lesson-incident.model";
import { TimetableEntry } from "../../shared/models/timetable-entry.model";
import { notNull } from "../../shared/utils/filter";
import { TeacherSubstitutionsRestService } from "../../shared/services/teacher-substitutions-rest.service";
import { PersonsRestService } from "../../shared/services/persons-rest.service";

const SEARCH_ROLES = [
  "LessonTeacherRole",
  "ClassTeacherRole",
  "TeacherRole",
  "AbsenceAdministratorRole",
];

const ACTIONS_ROLES = [
  "LessonTeacherRole",
  "TeacherRole",
  "StudentRole",
  "SubstituteAdministratorRole",
];

const TIMETABLE_ROLES = ["LessonTeacherRole", "StudentRole"];

@Injectable()
export class DashboardService {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();
  studentId$ = new ReplaySubject<number>(1);
  private lessonAbsences$ = this.studentId$.pipe(
    switchMap((id) => this.studentsService.getLessonAbsences(id)),
    shareReplay(1),
  );
  private lessonIncidents$ = this.studentId$.pipe(
    switchMap((id) => this.studentsService.getLessonIncidents(id)),
    shareReplay(1),
  );

  ///// Dashboard Conditions /////

  loading$ = this.rolesAndPermissions$.pipe(map((roles) => roles == null));
  hasSearch$ = this.rolesAndPermissions$.pipe(map(this.hasRoles(SEARCH_ROLES)));
  hasActions$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(ACTIONS_ROLES)),
  );
  hasTimetable$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(TIMETABLE_ROLES)),
  );

  ///// Roles /////

  hasLessonTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(["LessonTeacherRole"])),
    shareReplay(1),
  );
  hasTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(["TeacherRole"])),
    shareReplay(1),
  );
  hasStudentRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(["StudentRole"])),
    shareReplay(1),
  );
  hasSubstituteAdministratorRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(["SubstituteAdministratorRole"])),
    shareReplay(1),
  );

  ///// Action Counts /////

  editAbsencesCount$ = this.hasLessonTeacherRole$.pipe(
    switchMap((hasRole) =>
      hasRole
        ? this.lessonPresencesService.checkableAbsencesCount()
        : of(false),
    ),
    shareReplay(1),
  );

  openAbsencesCount$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(["LessonTeacherRole", "ClassTeacherRole"])),
    switchMap((hasRoles) =>
      hasRoles ? this.lessonPresencesService.getListOfUnconfirmed() : of([]),
    ),
    map((presences) => presences.length),
    shareReplay(1),
  );

  myAbsencesCount$ = this.hasStudentRole$.pipe(
    switchMap((hasRole) => (hasRole ? this.getMyAbsences() : of([]))),
    map(this.getMyAbsencesCount.bind(this)),
    shareReplay(1),
  );
  coursesToRateCount$ = this.courseService
    .getNumberOfCoursesForRating()
    .pipe(startWith(0), shareReplay(1));

  ///// Action Conditions /////

  hasPresenceControl$ = this.hasLessonTeacherRole$.pipe(
    switchMap((hasRole) =>
      hasRole
        ? this.lessonPresencesService.hasLessonsLessonTeacher()
        : of(false),
    ),
    shareReplay(1),
  );
  hasOpenAbsences$ = this.openAbsencesCount$.pipe(
    map((count) => count > 0),
    shareReplay(1),
  );

  ///// Action Params /////

  editAbsencesParams$ = this.getFullName().pipe(
    map((name) => {
      return {
        confirmationStates: this.settings.checkableAbsenceStateId,
        teacher: name,
      };
    }),
    shareReplay(1),
  );

  constructor(
    private settingsService: UserSettingsService,
    private lessonPresencesService: LessonPresencesRestService,
    private studentsService: StudentsRestService,
    private courseService: CoursesRestService,
    private teacherSubstitutionService: TeacherSubstitutionsRestService,
    private personService: PersonsRestService,
    private storageService: StorageService,
    @Inject(SETTINGS) private settings: Settings,
  ) {
    const studentId = this.storageService.getPayload()?.id_person;
    if (studentId) {
      this.studentId$.next(Number(studentId));
    }
  }

  private hasRoles(
    requiredRoles: ReadonlyArray<string>,
  ): (actualRoles: Option<ReadonlyArray<string>>) => boolean {
    return (actualRoles) =>
      (actualRoles ?? []).some((role) => requiredRoles.includes(role));
  }

  private getMyAbsences(): Observable<
    Option<ReadonlyArray<LessonAbsence | LessonIncident>>
  > {
    return combineLatest([
      this.studentId$,
      this.lessonAbsences$,
      this.lessonIncidents$,
    ]).pipe(
      switchMap(([studentId, absences, incidents]) =>
        this.loadTimetableEntries(studentId, absences, incidents).pipe(
          map((timetableEntries) =>
            [...absences, ...incidents]
              .map((absence) =>
                this.withTimetableEntry(absence, timetableEntries),
              )
              .filter(notNull),
          ),
        ),
      ),
    );
  }

  private getMyAbsencesCount(
    absences: Option<ReadonlyArray<LessonAbsence | LessonIncident>>,
  ): number {
    return (
      absences?.filter(
        (absence) =>
          ("ConfirmationStateId" in absence
            ? absence.ConfirmationStateId
            : null) === this.settings.unconfirmedAbsenceStateId,
      ).length || 0
    );
  }

  private getFullName(): Observable<Maybe<string>> {
    const substitutionId =
      Number(this.storageService.getPayload()?.substitution_id) || null;
    return substitutionId
      ? this.teacherSubstitutionService
          .getTeacherSubstitution(substitutionId)
          .pipe(map((substitute) => substitute?.Holder))
      : this.personService.getMyself().pipe(map((me) => me.FullName));
  }

  private withTimetableEntry(
    absence: LessonAbsence | LessonIncident,
    timetableEntries: ReadonlyArray<TimetableEntry>,
  ): Option<LessonAbsence | LessonIncident> {
    return timetableEntries.find((e) => e.Id === absence.LessonRef.Id)
      ? absence
      : null;
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
}
