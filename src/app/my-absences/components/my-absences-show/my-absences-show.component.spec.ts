import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { MyAbsencesShowComponent } from './my-absences-show.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MyAbsencesService } from '../../services/my-absences.service';
import { MyAbsencesReportLinkComponent } from '../my-absences-report-link/my-absences-report-link.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { buildLessonAbsence } from '../../../../spec-builders';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

describe('MyAbsencesShowComponent', () => {
  let component: MyAbsencesShowComponent;
  let fixture: ComponentFixture<MyAbsencesShowComponent>;
  let element: HTMLElement;
  let openLessonAbsences$: BehaviorSubject<any>;

  beforeEach(waitForAsync(() => {
    openLessonAbsences$ = new BehaviorSubject<any>([]);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyAbsencesShowComponent, MyAbsencesReportLinkComponent],
        providers: [
          ConfirmAbsencesSelectionService,
          {
            provide: MyAbsencesService,
            useValue: {
              openLessonAbsences$,
              checkableLessonAbsences$: of([]),
              excusedLessonAbsences$: of([]),
              unexcusedLessonAbsences$: of([]),
              incidentsLessonAbsences$: of([]),
              counts$: of({}),
            },
          },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: '42' };
              },
              getAccessToken(): Option<string> {
                return null;
              },
            },
          },
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesShowComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe('all absences report', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have all absences report disabled', () => {
      const reportLink = element.getElementsByClassName(
        'report'
      )[0] as HTMLElement;
      expect(reportLink?.className.includes('disabled')).toBeTrue();
    });

    it('should have all absences report enabled', () => {
      openLessonAbsences$.next([buildLessonAbsence('12')]);
      fixture.detectChanges();
      const reportLink = element.getElementsByClassName(
        'report'
      )[0] as HTMLElement;
      expect(reportLink?.className.includes('disabled')).toBeFalse();
    });
  });
});
