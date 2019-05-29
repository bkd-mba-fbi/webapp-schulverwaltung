import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  buildLessonPresence,
  buildLesson,
  buildPresenceType
} from 'src/spec-builders';
import { PresenceControlListComponent } from './presence-control-list.component';
import { PresenceControlHeaderComponent } from '../presence-control-header/presence-control-header.component';
import { PresenceControlStateService } from '../presence-control-state.service';
import { PresenceControlEntryComponent } from '../presence-control-entry/presence-control-entry.component';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { PresenceType } from 'src/app/shared/models/presence-type.model';

describe('PresenceControlListComponent', () => {
  let component: PresenceControlListComponent;
  let fixture: ComponentFixture<PresenceControlListComponent>;
  let element: HTMLElement;

  let presenceControlEntriesCb: jasmine.Spy;
  let lesson: Lesson;
  let bichsel: PresenceControlEntry;
  let frisch: PresenceControlEntry;
  let jenni: PresenceControlEntry;
  let absence: PresenceType;

  let selectedPresenceControlEntries$: BehaviorSubject<PresenceControlEntry[]>;
  let stateServiceMock: PresenceControlStateService;
  let lessonPresencesUpdateServiceMock: LessonPresencesUpdateService;

  beforeEach(async(() => {
    lesson = buildLesson(
      1,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch'
    );
    bichsel = buildPresenceControlEntry('Bichsel Peter');
    frisch = buildPresenceControlEntry('Frisch Max');
    jenni = buildPresenceControlEntry('Zoë Jenny');
    selectedPresenceControlEntries$ = new BehaviorSubject([
      bichsel,
      frisch,
      jenni
    ]);

    absence = buildPresenceType(2, 20, 1, 0);

    stateServiceMock = ({
      loading$: of(false),
      selectedLesson$: of(lesson),
      selectedPresenceControlEntries$,
      isFirstLesson$: of(true),
      isLastLesson$: of(true),
      getNextPresenceType: jasmine
        .createSpy('getNextPresenceType')
        .and.callFake(() => of(absence))
    } as unknown) as PresenceControlStateService;

    lessonPresencesUpdateServiceMock = ({
      updatePresenceTypes: jasmine.createSpy('updatePresenceTypes')
    } as unknown) as LessonPresencesUpdateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlListComponent,
          PresenceControlHeaderComponent,
          PresenceControlEntryComponent
        ],
        providers: [
          {
            provide: PresenceControlStateService,
            useValue: stateServiceMock
          },
          {
            provide: LessonPresencesUpdateService,
            useValue: lessonPresencesUpdateServiceMock
          }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    presenceControlEntriesCb = jasmine.createSpy('presenceControlEntries$');
    component.presenceControlEntries$.subscribe(presenceControlEntriesCb);

    fixture.detectChanges();
  });

  describe('.presenceControlEntries$', () => {
    it('emits all entries initially', () => {
      expect(getRenderedStudentNames()).toEqual([
        'Bichsel Peter',
        'Frisch Max',
        'Zoë Jenny'
      ]);
    });

    it('renders matching entries after search and applies search to new entries', () => {
      component.search$.next('fri');
      fixture.detectChanges();
      expect(getRenderedStudentNames()).toEqual(['Frisch Max']);

      selectedPresenceControlEntries$.next([
        bichsel,
        frisch,
        buildPresenceControlEntry('Frisch Peter'),
        jenni
      ]);
      fixture.detectChanges();
      expect(getRenderedStudentNames()).toEqual(['Frisch Max', 'Frisch Peter']);
    });
  });

  describe('.togglePresenceType', () => {
    beforeEach(() => {});

    it('updates given entry to next presence type', () => {
      component.togglePresenceType(bichsel);
      expect(
        lessonPresencesUpdateServiceMock.updatePresenceTypes
      ).toHaveBeenCalledWith([bichsel.lessonPresence], absence.Id);
    });
  });

  function getRenderedStudentNames(): string[] {
    return Array.prototype.slice
      .call(element.querySelectorAll('.student-name'))
      .map(e => e.textContent.trim());
  }

  function buildPresenceControlEntry(
    studentName: string
  ): PresenceControlEntry {
    return new PresenceControlEntry(
      buildLessonPresence(
        lesson.LessonRef.Id,
        lesson.LessonDateTimeFrom,
        lesson.LessonDateTimeTo,
        lesson.EventDesignation,
        studentName
      ),
      null
    );
  }
});
