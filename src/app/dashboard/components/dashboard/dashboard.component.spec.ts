import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let element: HTMLElement;
  let router: Router;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardComponent],
        providers: [
          {
            provide: UserSettingsService,
            useValue: {
              getRolesAndPermissions() {
                return roles$;
              },
            },
          },
        ],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  describe('without roles', () => {
    beforeEach(() => {
      roles$.next([]);
    });

    it('displays placeholder message', () => {
      fixture.detectChanges();
      expect(element.textContent).toContain('dashboard.no-access');
      expect(element.textContent).not.toContain('dashboard.search');
      expect(element.textContent).not.toContain('dashboard.actions');
      expect(element.textContent).not.toContain('dashboard.timetable');
    });
  });

  describe('as lesson teacher', () => {
    beforeEach(() => {
      roles$.next(['LessonTeacherRole']);
    });

    it('displays search, actions & timetable', () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain('dashboard.no-access');
      expect(element.textContent).toContain('dashboard.search');
      expect(element.textContent).toContain('dashboard.actions');
      expect(element.textContent).toContain('dashboard.timetable');
    });

    it('navigates to dossier with given id', () => {
      const key = 12;
      component.navigateToDossier(key);
      expect(router.navigate).toHaveBeenCalledWith([
        'dashboard',
        'student',
        key,
        'addresses',
      ]);
    });
  });

  describe('as class teacher', () => {
    beforeEach(() => {
      roles$.next(['ClassTeacherRole']);
    });

    it('displays search', () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain('dashboard.no-access');
      expect(element.textContent).toContain('dashboard.search');
      expect(element.textContent).not.toContain('dashboard.actions');
      expect(element.textContent).not.toContain('dashboard.timetable');
    });
  });

  describe('as student', () => {
    beforeEach(() => {
      roles$.next(['StudentRole']);
    });

    it('displays actions & timetable', () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain('dashboard.no-access');
      expect(element.textContent).not.toContain('dashboard.search');
      expect(element.textContent).toContain('dashboard.actions');
      expect(element.textContent).toContain('dashboard.timetable');
    });
  });

  describe('as absence administrator', () => {
    beforeEach(() => {
      roles$.next(['AbsenceAdministratorRole']);
    });

    it('displays only search', () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain('dashboard.no-access');
      expect(element.textContent).toContain('dashboard.search');
      expect(element.textContent).not.toContain('dashboard.actions');
      expect(element.textContent).not.toContain('dashboard.timetable');
    });
  });

  describe('as substitute administrator', () => {
    beforeEach(() => {
      roles$.next(['SubstituteAdministratorRole']);
    });

    it('displays actions', () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain('dashboard.no-access');
      expect(element.textContent).not.toContain('dashboard.search');
      expect(element.textContent).toContain('dashboard.actions');
      expect(element.textContent).not.toContain('dashboard.timetable');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      roles$.next(['LessonTeacherRole']);
    });

    it('navigates to dossier with given id', () => {
      const key = 12;
      component.navigateToDossier(key);
      expect(router.navigate).toHaveBeenCalledWith([
        'dashboard',
        'student',
        key,
        'addresses',
      ]);
    });
  });
});
