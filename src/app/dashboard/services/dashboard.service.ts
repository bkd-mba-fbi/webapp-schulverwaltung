import { Inject, Injectable } from '@angular/core';
import { combineLatest, filter, map, ReplaySubject, switchMap } from 'rxjs';
import { Settings, SETTINGS } from '../../settings';
import { UserSettingsService } from '../../shared/services/user-settings.service';
import { isTruthy } from '../../shared/utils/filter';
import { LessonPresencesRestService } from '../../shared/services/lesson-presences-rest.service';
import { StudentsRestService } from '../../shared/services/students-rest.service';
import { LessonAbsence } from '../../shared/models/lesson-absence.model';
import { StorageService } from '../../shared/services/storage.service';

const SEARCH_ROLES = [
  'LessonTeacherRole',
  'ClassTeacherRole',
  'TeacherRole',
  'AbsenceAdministratorRole',
];

const ACTIONS_ROLES = [
  'LessonTeacherRole',
  'TeacherRole',
  'StudentRole',
  'SubstituteAdministratorRole',
];

const TIMETABLE_ROLES = ['LessonTeacherRole', 'StudentRole'];

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();
  private studentId$ = new ReplaySubject<number>(1);

  loading$ = this.rolesAndPermissions$.pipe(map((roles) => roles == null));
  hasSearch$ = this.rolesAndPermissions$.pipe(map(this.hasRoles(SEARCH_ROLES)));
  hasActions$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(ACTIONS_ROLES))
  );
  hasTimetable$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(TIMETABLE_ROLES))
  );

  hasLessonTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole']))
  );

  // Presence control
  hasPresenceControl$ = this.hasLessonTeacherRole$.pipe(
    filter(isTruthy),
    switchMap((hasRole) =>
      this.lessonPresencesService.hasLessonsLessonTeacher()
    )
  );

  // Edit absences
  checkableAbsencesCount$ = this.hasLessonTeacherRole$.pipe(
    filter(isTruthy),
    switchMap((hasRole) => this.lessonPresencesService.checkableAbsencesCount())
  );

  // Open absences
  unconfirmedCount$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole', 'ClassTeacherRole'])),
    filter(isTruthy),
    switchMap(() => this.lessonPresencesService.getListOfUnconfirmed()),
    map((presences) => presences.length)
  );
  hasOpenAbsences$ = this.unconfirmedCount$.pipe(map((count) => count > 0));

  // Tests
  hasTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['TeacherRole']))
  );

  // My absences
  hasStudentRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['StudentRole']))
  );
  openAbsencesCount$ = combineLatest([
    this.studentId$,
    this.hasStudentRole$.pipe(filter(isTruthy)),
  ]).pipe(
    switchMap(([id]) => this.studentsService.getLessonAbsences(id)),
    map(this.openAbsencesCount.bind(this))
  );

  // Substitutions
  hasSubstituteAdministratorRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['SubstituteAdministratorRole']))
  );

  constructor(
    private settingsService: UserSettingsService,
    private lessonPresencesService: LessonPresencesRestService,
    private studentsService: StudentsRestService,
    private storageService: StorageService,
    @Inject(SETTINGS) private settings: Settings
  ) {
    const studentId = this.storageService.getPayload()?.id_person;
    if (studentId) {
      this.studentId$.next(Number(studentId));
    }
  }

  private hasRoles(
    requiredRoles: ReadonlyArray<string>
  ): (actualRoles: Option<ReadonlyArray<string>>) => boolean {
    return (actualRoles) =>
      (actualRoles ?? []).some((role) => requiredRoles.includes(role));
  }

  private openAbsencesCount(absences: ReadonlyArray<LessonAbsence>): number {
    return absences.filter(
      (absence) =>
        absence.ConfirmationStateId === this.settings.unconfirmedAbsenceStateId
    ).length;
  }
}
