import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { OpenAbsencesListComponent } from './open-absences-list.component';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { OpenAbsencesEntry } from '../../models/open-absences-entry.model';
import { OpenAbsencesEntriesSelectionService } from '../../services/open-absences-entries-selection.service';

describe('OpenAbsencesListComponent', () => {
  let component: OpenAbsencesListComponent;
  let fixture: ComponentFixture<OpenAbsencesListComponent>;
  let element: HTMLElement;

  let openAbsencesService: OpenAbsencesService;
  let entryA: OpenAbsencesEntry;
  let entryB: OpenAbsencesEntry;
  let storeMock: any;

  beforeEach(async(() => {
    entryA = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 21),
      buildLessonPresenceWithIds(11, 21),
    ]);
    entryB = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 22),
      buildLessonPresenceWithIds(12, 22),
    ]);

    storeMock = {};
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => storeMock[key] || null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string) => storeMock[key] || null
    );

    storeMock['CLX.LoginToken'] =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA';

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesListComponent],
        providers: [
          {
            provide: OpenAbsencesService,
            useValue: {
              sortCriteria$: of({ primarySortKey: 'name', ascending: true }),
              toggleSort: jasmine.createSpy('toggleSort'),
              sortedEntries$: of([entryA, entryB]),
              filteredEntries$: of([entryA, entryB]),
              selected: [],
            },
          },
          OpenAbsencesEntriesSelectionService,
        ],
      })
    ).compileComponents();

    openAbsencesService = TestBed.inject(OpenAbsencesService);
  }));

  afterEach(() => jasmine.clock().uninstall());

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));

    fixture = TestBed.createComponent(OpenAbsencesListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('renders two entries', () => {
    expect(element.querySelectorAll('div.absence-entry').length).toBe(2);
  });

  describe('selection', () => {
    it('enables edit link if an entry is selected', () => {
      const editLink = element.querySelector('a.edit') as HTMLAnchorElement;
      expect(editLink.classList.contains('disabled')).toBe(true);

      toggleCheckbox(0);
      expect(editLink.classList.contains('disabled')).toBe(false);

      toggleCheckbox(0);
      expect(editLink.classList.contains('disabled')).toBe(true);
    });

    it('updates selected ids', () => {
      expect(openAbsencesService.selected).toEqual([]);

      toggleCheckbox(0);
      expect(openAbsencesService.selected).toEqual([
        { personIds: [21], lessonIds: [10, 11] },
      ]);

      toggleCheckbox(1);
      expect(openAbsencesService.selected).toEqual([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10, 12] },
      ]);

      toggleCheckbox(0);
      toggleCheckbox(1);
      expect(openAbsencesService.selected).toEqual([]);
    });

    function toggleCheckbox(index: number): void {
      (element.querySelectorAll('input[type="checkbox"]')[
        index
      ] as HTMLInputElement).click();
      fixture.detectChanges();
    }
  });

  describe('.getDaysDifferenceKey', () => {
    it('it returns key for today', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 23)),
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.today');
    });

    it('it returns key for tomorrow', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 24)),
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.tomorrow');
    });

    it('it returns key for yesterday', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 22)),
        ])
      );
      expect(result).toBe(
        'open-absences.list.content.daysDifference.yesterday'
      );
    });

    it('it returns key for past date', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 1)),
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.ago');
    });

    it('it returns key for future date', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 31)),
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.in');
    });
  });
});
