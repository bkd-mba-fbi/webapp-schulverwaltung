import { Inject, Injectable } from '@angular/core';
import { map, of, ReplaySubject, shareReplay, switchMap } from 'rxjs';
import { Settings, SETTINGS } from '../../settings';
import { UserSettingsService } from '../../shared/services/user-settings.service';
import { LessonPresencesRestService } from '../../shared/services/lesson-presences-rest.service';
import { StudentsRestService } from '../../shared/services/students-rest.service';
import { LessonAbsence } from '../../shared/models/lesson-absence.model';
import { StorageService } from '../../shared/services/storage.service';
import { CoursesRestService } from '../../shared/services/courses-rest.service';

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

@Injectable()
export class DashboardService {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();
  studentId$ = new ReplaySubject<number>(1);

  ///// Dashboard Conditions /////

  loading$ = this.rolesAndPermissions$.pipe(map((roles) => roles == null));
  hasSearch$ = this.rolesAndPermissions$.pipe(map(this.hasRoles(SEARCH_ROLES)));
  hasActions$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(ACTIONS_ROLES))
  );
  hasTimetable$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(TIMETABLE_ROLES))
  );

  ///// Roles /////

  hasLessonTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole'])),
    shareReplay(1)
  );
  hasTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['TeacherRole'])),
    shareReplay(1)
  );
  hasStudentRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['StudentRole'])),
    shareReplay(1)
  );
  hasSubstituteAdministratorRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['SubstituteAdministratorRole'])),
    shareReplay(1)
  );

  ///// Action Counts /////

  editAbsencesCount$ = this.hasLessonTeacherRole$.pipe(
    switchMap((hasRole) =>
      hasRole ? this.lessonPresencesService.checkableAbsencesCount() : of(false)
    ),
    shareReplay(1)
  );

  openAbsencesCount$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole', 'ClassTeacherRole'])),
    switchMap((hasRoles) =>
      hasRoles ? this.lessonPresencesService.getListOfUnconfirmed() : of([])
    ),
    map((presences) => presences.length),
    shareReplay(1)
  );

  myAbsencesCount$ = this.hasStudentRole$.pipe(
    switchMap((hasRole) =>
      hasRole
        ? this.studentId$.pipe(
            switchMap((id) => this.studentsService.getLessonAbsences(id))
          )
        : of([])
    ),
    map(this.getMyAbsencesCount.bind(this)),
    shareReplay(1)
  );
  coursesToRateCount$ = this.courseService.getNumberOfCoursesForRating();

  ///// Action Conditions /////

  hasPresenceControl$ = this.hasLessonTeacherRole$.pipe(
    switchMap((hasRole) =>
      hasRole
        ? this.lessonPresencesService.hasLessonsLessonTeacher()
        : of(false)
    ),
    shareReplay(1)
  );
  hasOpenAbsences$ = this.openAbsencesCount$.pipe(
    map((count) => count > 0),
    shareReplay(1)
  );

  constructor(
    private settingsService: UserSettingsService,
    private lessonPresencesService: LessonPresencesRestService,
    private studentsService: StudentsRestService,
    private courseService: CoursesRestService,
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

  private getMyAbsencesCount(absences: ReadonlyArray<LessonAbsence>): number {
    return absences.filter(
      (absence) =>
        absence.ConfirmationStateId === this.settings.unconfirmedAbsenceStateId
    ).length;
  }
}
