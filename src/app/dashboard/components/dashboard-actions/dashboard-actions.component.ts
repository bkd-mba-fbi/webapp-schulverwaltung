import { Component, Inject } from '@angular/core';
import { Settings, SETTINGS } from '../../../settings';
import { Params } from '@angular/router';
import { UserSettingsService } from '../../../shared/services/user-settings.service';
import { map } from 'rxjs';
import { LessonPresencesRestService } from '../../../shared/services/lesson-presences-rest.service';

@Component({
  selector: 'erz-dashboard-actions',
  templateUrl: './dashboard-actions.component.html',
  styleUrls: ['./dashboard-actions.component.scss'],
})
export class DashboardActionsComponent {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();

  hasLessons$ = this.lessonPresencesRestService.hasLessonsLessonTeacher();
  checkableAbsencesCount$ =
    this.lessonPresencesRestService.checkableAbsencesCount();
  hasLessonTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['LessonTeacherRole']))
  );
  hasClassTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['ClassTeacherRole']))
  );
  hasTeacherRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['TeacherRole']))
  );
  hasStudentRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['StudentRole']))
  );
  hasSubstituteAdministratorRoleRole$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(['SubstituteAdministratorRole']))
  );

  constructor(
    private settingsService: UserSettingsService,
    private lessonPresencesRestService: LessonPresencesRestService,
    @Inject(SETTINGS) public settings: Settings
  ) {}

  get editAbsencesParams(): Params {
    return { confirmationStates: this.settings.checkableAbsenceStateId };
  }

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }

  // TODO dry up
  private hasRoles(
    requiredRoles: ReadonlyArray<string>
  ): (actualRoles: Option<ReadonlyArray<string>>) => boolean {
    return (actualRoles) =>
      (actualRoles ?? []).some((role) => requiredRoles.includes(role));
  }
}
