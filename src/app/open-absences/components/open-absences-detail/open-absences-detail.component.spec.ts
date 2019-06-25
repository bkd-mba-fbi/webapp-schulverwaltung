import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { buildTestModuleMetadata, ActivatedRouteMock } from 'src/spec-helpers';
import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { OpenAbsencesDetailComponent } from './open-absences-detail.component';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

describe('OpenAbsencesDetailComponent', () => {
  let component: OpenAbsencesDetailComponent;
  let fixture: ComponentFixture<OpenAbsencesDetailComponent>;
  let element: HTMLElement;

  let activatedRouteMock: ActivatedRouteMock;
  let openAbsencesService: OpenAbsencesService;
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;

  beforeEach(async(() => {
    activatedRouteMock = new ActivatedRouteMock({
      date: '2000-01-23',
      personId: 21
    });

    presenceA = buildLessonPresenceWithIds(10, 21, new Date(2000, 0, 23, 12));
    presenceB = buildLessonPresenceWithIds(11, 21, new Date(2000, 0, 23, 13));
    [presenceA, presenceB].forEach(
      p => (p.StudentFullName = 'Einstein Albert')
    );

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesDetailComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          {
            provide: OpenAbsencesService,
            useValue: {
              getUnconfirmedAbsences: jasmine
                .createSpy('getUnconfirmedAbsences')
                .and.returnValue(of([presenceA, presenceB])),
              selected: []
            }
          }
        ]
      })
    ).compileComponents();

    openAbsencesService = TestBed.get(OpenAbsencesService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesDetailComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('renders two entries and the select all row', () => {
    expect(element.querySelectorAll('tbody tr').length).toBe(3);
    expect(element.querySelectorAll('tbody tr')[0].textContent).toBe(
      'open-absences.detail.all'
    );
  });

  it('renders the student name', () => {
    const nameElement = element.querySelector('.back span');
    expect(nameElement && nameElement.textContent).toBe('Einstein Albert');
  });

  describe('selection', () => {
    it('enables edit link if an entry is selected', () => {
      const editLink = element.querySelector('a.edit') as HTMLAnchorElement;
      expect(editLink.classList.contains('disabled')).toBe(true);

      toggleCheckbox(1);
      expect(editLink.classList.contains('disabled')).toBe(false);

      toggleCheckbox(1);
      expect(editLink.classList.contains('disabled')).toBe(true);
    });

    it('updates selected ids', () => {
      expect(openAbsencesService.selected).toEqual([]);

      toggleCheckbox(1);
      expect(openAbsencesService.selected).toEqual([
        { personIds: [21], lessonIds: [10] }
      ]);

      toggleCheckbox(2);
      expect(openAbsencesService.selected).toEqual([
        { personIds: [21], lessonIds: [10, 11] }
      ]);

      toggleCheckbox(1);
      toggleCheckbox(2);
      expect(openAbsencesService.selected).toEqual([]);
    });

    it('toggles all entries', () => {
      const selectAllCheckbox = getCheckbox(0);
      toggleCheckbox(0);
      expect(openAbsencesService.selected).toEqual([
        { personIds: [21], lessonIds: [10, 11] }
      ]);

      toggleCheckbox(0);
      expect(openAbsencesService.selected).toEqual([]);

      toggleCheckbox(1);
      toggleCheckbox(2);
      expect(selectAllCheckbox.checked).toBe(true);

      toggleCheckbox(2);
      expect(selectAllCheckbox.checked).toBe(false);
    });

    function toggleCheckbox(index: number): void {
      getCheckbox(index).click();
      fixture.detectChanges();
    }

    function getCheckbox(index: number): HTMLInputElement {
      return element.querySelectorAll('input[type="checkbox"]')[
        index
      ] as HTMLInputElement;
    }
  });
});
