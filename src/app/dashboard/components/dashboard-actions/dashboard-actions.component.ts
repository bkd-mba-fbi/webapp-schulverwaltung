import { Component, Inject } from '@angular/core';
import { Settings, SETTINGS } from '../../../settings';
import { Params } from '@angular/router';
import { UserSettingsService } from '../../../shared/services/user-settings.service';
import {
  map,
  switchMap,
  filter,
  ReplaySubject,
  combineLatest,
  tap,
} from 'rxjs';
import { LessonPresencesRestService } from '../../../shared/services/lesson-presences-rest.service';
import { isTruthy } from '../../../shared/utils/filter';
import { StorageService } from '../../../shared/services/storage.service';
import { StudentsRestService } from '../../../shared/services/students-rest.service';
import { LessonAbsence } from '../../../shared/models/lesson-absence.model';

@Component({
  selector: 'erz-dashboard-actions',
  templateUrl: './dashboard-actions.component.html',
  styleUrls: ['./dashboard-actions.component.scss'],
})
export class DashboardActionsComponent {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();
  private studentId$ = new ReplaySubject<number>(1);

  // TODO move to service?

  // Lesson Teacher
  hasLessonTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole']))
  );
  checkableAbsencesCount$ = this.hasLessonTeacherRole$.pipe(
    filter(isTruthy),
    switchMap((hasRole) => this.lessonPresencesService.checkableAbsencesCount())
  );
  hasLessons$ = this.hasLessonTeacherRole$.pipe(
    filter(isTruthy),
    switchMap((hasRole) =>
      this.lessonPresencesService.hasLessonsLessonTeacher()
    )
  );

  // Class Teacher
  hasClassTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['ClassTeacherRole']))
  );
  unconfirmedCount$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole', 'ClassTeacherRole'])),
    filter(isTruthy),
    switchMap(() => this.lessonPresencesService.getListOfUnconfirmed()),
    map((presences) => presences.length)
  );

  // Teacher
  hasTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['TeacherRole']))
  );

  // Student
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

  // Substitution Admin
  hasSubstituteAdministratorRoleRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['SubstituteAdministratorRole']))
  );

  constructor(
    private settingsService: UserSettingsService,
    private lessonPresencesService: LessonPresencesRestService,
    private studentsService: StudentsRestService,
    private storageService: StorageService,
    @Inject(SETTINGS) public settings: Settings
  ) {
    const studentId = this.storageService.getPayload()?.id_person;
    if (studentId) {
      this.studentId$.next(Number(studentId));
    }
  }

  get editAbsencesParams(): Params {
    return { confirmationStates: this.settings.checkableAbsenceStateId };
  }

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }

  private openAbsencesCount(absences: ReadonlyArray<LessonAbsence>): number {
    return absences.filter(
      (absence) =>
        absence.ConfirmationStateId === this.settings.unconfirmedAbsenceStateId
    ).length;
  }

  // TODO dry up
  private hasRoles(
    requiredRoles: ReadonlyArray<string>
  ): (actualRoles: Option<ReadonlyArray<string>>) => boolean {
    return (actualRoles) =>
      (actualRoles ?? []).some((role) => requiredRoles.includes(role));
  }
}
