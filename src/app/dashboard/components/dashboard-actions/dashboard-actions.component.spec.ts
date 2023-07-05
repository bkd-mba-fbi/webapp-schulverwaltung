import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActionsComponent } from './dashboard-actions.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { UserSettingsService } from '../../../shared/services/user-settings.service';
import { BehaviorSubject, of } from 'rxjs';
import { LessonPresencesRestService } from '../../../shared/services/lesson-presences-rest.service';

describe('DashboardActionsComponent', () => {
  let component: DashboardActionsComponent;
  let fixture: ComponentFixture<DashboardActionsComponent>;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardActionsComponent],
        providers: [
          {
            provide: UserSettingsService,
            useValue: {
              getRolesAndPermissions() {
                return roles$;
              },
            },
          },
          {
            provide: LessonPresencesRestService,
            useValue: {
              hasLessonsLessonTeacher() {
                return of(true);
              },
              checkableAbsencesCount() {
                return of(6);
              },
            },
          },
        ],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardActionsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe('without roles', () => {
    beforeEach(() => {
      roles$.next([]);
    });

    it('displays no actions', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).toBeNull();
      expect(getAction('dashboard.actions.open-absences')).toBeNull();
      expect(getAction('dashboard.actions.tests')).toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).toBeNull();
      expect(getAction('dashboard.actions.my-absences')).toBeNull();
      expect(getAction('dashboard.actions.substitutions')).toBeNull();
    });
  });

  describe('as lesson teacher', () => {
    beforeEach(() => {
      roles$.next(['LessonTeacherRole']);
    });

    it('displays presence control, edit and open absences', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).not.toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).not.toBeNull();
      expect(getAction('dashboard.actions.open-absences')).not.toBeNull();
      expect(getAction('dashboard.actions.tests')).toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).toBeNull();
      expect(getAction('dashboard.actions.my-absences')).toBeNull();
      expect(getAction('dashboard.actions.substitutions')).toBeNull();
    });
  });

  describe('as class teacher', () => {
    beforeEach(() => {
      roles$.next(['ClassTeacherRole']);
    });

    it('displays open absences', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).toBeNull();
      expect(getAction('dashboard.actions.open-absences')).not.toBeNull();
      expect(getAction('dashboard.actions.tests')).toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).toBeNull();
      expect(getAction('dashboard.actions.my-absences')).toBeNull();
      expect(getAction('dashboard.actions.substitutions')).toBeNull();
    });
  });

  describe('as teacher', () => {
    beforeEach(() => {
      roles$.next(['TeacherRole']);
    });

    it('displays tests', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).toBeNull();
      expect(getAction('dashboard.actions.open-absences')).toBeNull();
      expect(getAction('dashboard.actions.tests')).not.toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).toBeNull();
      expect(getAction('dashboard.actions.my-absences')).toBeNull();
      expect(getAction('dashboard.actions.substitutions')).toBeNull();
    });
  });

  describe('as student', () => {
    beforeEach(() => {
      roles$.next(['StudentRole']);
    });

    it('displays my absences, my absences report', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).toBeNull();
      expect(getAction('dashboard.actions.open-absences')).toBeNull();
      expect(getAction('dashboard.actions.tests')).toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).not.toBeNull();
      expect(getAction('dashboard.actions.my-absences')).not.toBeNull();
      expect(getAction('dashboard.actions.substitutions')).toBeNull();
    });
  });

  describe('as substitution admin', () => {
    beforeEach(() => {
      roles$.next(['SubstituteAdministratorRole']);
    });

    it('displays substitutions', () => {
      fixture.detectChanges();
      expect(getAction('dashboard.actions.presence-control')).toBeNull();
      expect(getAction('dashboard.actions.edit-absences')).toBeNull();
      expect(getAction('dashboard.actions.open-absences')).toBeNull();
      expect(getAction('dashboard.actions.tests')).toBeNull();
      expect(getAction('dashboard.actions.my-absences-report')).toBeNull();
      expect(getAction('dashboard.actions.my-absences')).toBeNull();
      expect(getAction('dashboard.actions.substitutions')).not.toBeNull();
    });
  });

  function getAction(title: string) {
    return element.querySelector(`erz-action[title="${title}"]`);
  }
});
