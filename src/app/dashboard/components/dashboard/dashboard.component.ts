import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { StudentsRestService } from '../../../shared/services/students-rest.service';
import { DropDownItem } from '../../../shared/models/drop-down-item.model';
import { Router } from '@angular/router';

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

@Component({
  selector: 'erz-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private rolesAndPermissions$ = this.settingsService.getRolesAndPermissions();

  loading$ = this.rolesAndPermissions$.pipe(map((roles) => roles == null));
  hasSearch$ = this.rolesAndPermissions$.pipe(map(this.hasRoles(SEARCH_ROLES)));
  hasActions$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(ACTIONS_ROLES))
  );
  hasTimetable$ = this.rolesAndPermissions$.pipe(
    map(this.hasRoles(TIMETABLE_ROLES))
  );

  constructor(
    public studentsRestService: StudentsRestService,
    private settingsService: UserSettingsService,
    private router: Router
  ) {}

  navigateToDossier(key: DropDownItem['Key']) {
    const id = Number(key);
    this.router.navigate(['dashboard', 'student', id, 'addresses']);
  }

  private hasRoles(
    requiredRoles: ReadonlyArray<string>
  ): (actualRoles: Option<ReadonlyArray<string>>) => boolean {
    return (actualRoles) =>
      (actualRoles ?? []).some((role) => requiredRoles.includes(role));
  }
}
