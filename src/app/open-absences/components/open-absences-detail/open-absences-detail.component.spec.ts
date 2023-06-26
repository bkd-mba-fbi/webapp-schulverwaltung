import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { buildTestModuleMetadata, ActivatedRouteMock } from 'src/spec-helpers';
import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { OpenAbsencesDetailComponent } from './open-absences-detail.component';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { take } from 'rxjs/operators';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('OpenAbsencesDetailComponent', () => {
  let component: OpenAbsencesDetailComponent;
  let fixture: ComponentFixture<OpenAbsencesDetailComponent>;
  let element: HTMLElement;

  let activatedRouteMock: ActivatedRouteMock;
  let router: Router;
  let openAbsencesService: OpenAbsencesService;
  let selectionService: ConfirmAbsencesSelectionService;
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;

  beforeEach(waitForAsync(() => {
    activatedRouteMock = new ActivatedRouteMock({
      date: '2000-01-23',
      personId: 21,
    });

    presenceA = buildLessonPresenceWithIds(
      10,
      21,
      11,
      new Date(2000, 0, 23, 12),
    );
    presenceB = buildLessonPresenceWithIds(
      11,
      21,
      11,
      new Date(2000, 0, 23, 13),
    );
    presenceC = buildLessonPresenceWithIds(
      11,
      21,
      11,
      new Date(2000, 0, 24, 13),
    );
    [presenceA, presenceB, presenceC].forEach(
      (p) => (p.StudentFullName = 'Einstein Albert'),
    );

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesDetailComponent],
        providers: [
          ConfirmAbsencesSelectionService,
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          {
            provide: OpenAbsencesService,
            useValue: {
              getUnconfirmedAbsences: jasmine
                .createSpy('getUnconfirmedAbsences')
                .and.returnValue(of([presenceA, presenceB])),
              getAllUnconfirmedAbsencesForStudent: jasmine
                .createSpy('getAllUnconfirmedAbsencesForStudent')
                .and.returnValue(of([presenceA, presenceB, presenceC])),
            },
          },
        ],
      }),
    ).compileComponents();

    openAbsencesService = TestBed.inject(OpenAbsencesService);
    selectionService = TestBed.inject(ConfirmAbsencesSelectionService);

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesDetailComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('renders two entries and the select all row', () => {
    expect(element.querySelectorAll('div.absence-entry').length).toBe(2);
    expect(element.querySelectorAll('div.absence-all').length).toBe(1);
    expect(element.querySelectorAll('div.all')[0].textContent).toBe(
      'open-absences.detail.all',
    );
  });

  it('renders the student name', () => {
    const headingElement = element.querySelector('h1');
    expect(headingElement?.textContent?.trim()).toBe('Einstein Albert');
  });

  describe('redirection', () => {
    it('does not redirect to main list if entries are available', () => {
      component.ngOnInit();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('redirects to main list if no entries are available', () => {
      openAbsencesService.getUnconfirmedAbsences = () => of([]);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/open-absences']);
    });
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
      expectSelection([]);

      toggleCheckbox(1);
      expectSelection([{ personId: 21, presenceTypeId: 11, lessonIds: [10] }]);

      toggleCheckbox(2);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);

      toggleCheckbox(1);
      toggleCheckbox(2);
      expectSelection([]);
    });

    it('toggles all entries', () => {
      const selectAllCheckbox = getCheckbox(0);
      toggleCheckbox(0);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);

      toggleCheckbox(0);
      expectSelection([]);

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

    function expectSelection(expected: any): void {
      selectionService.selectedIds$
        .pipe(take(1))
        .subscribe((selection) => expect(selection).toEqual(expected));
    }
  });
});
