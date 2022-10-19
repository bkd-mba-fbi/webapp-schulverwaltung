import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { buildTestModuleMetadata, settings } from 'src/spec-helpers';
import {
  buildLessonPresence,
  buildLesson,
  buildPresenceType,
} from 'src/spec-builders';
import { PresenceControlListComponent } from './presence-control-list.component';
import { PresenceControlHeaderComponent } from '../presence-control-header/presence-control-header.component';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlEntryComponent } from '../presence-control-entry/presence-control-entry.component';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

describe('PresenceControlListComponent', () => {
  let component: PresenceControlListComponent;
  let fixture: ComponentFixture<PresenceControlListComponent>;
  let element: HTMLElement;

  let lesson: Lesson;
  let bichsel: PresenceControlEntry;
  let frisch: PresenceControlEntry;
  let jenni: PresenceControlEntry;
  let absence: PresenceType;
  let blockLessons: Array<LessonPresence>;

  let selectedPresenceControlEntries$: BehaviorSubject<PresenceControlEntry[]>;
  let selectedPresenceControlEntriesByGroup$: BehaviorSubject<
    PresenceControlEntry[]
  >;
  let stateServiceMock: PresenceControlStateService;
  let lessonPresencesUpdateServiceMock: LessonPresencesUpdateService;

  beforeEach(waitForAsync(() => {
    lesson = buildLesson(
      1,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Dora Durrer'
    );
    bichsel = buildPresenceControlEntry('Bichsel Peter');
    frisch = buildPresenceControlEntry('Frisch Max');
    jenni = buildPresenceControlEntry('Zoë Jenny');
    selectedPresenceControlEntries$ = new BehaviorSubject([
      bichsel,
      frisch,
      jenni,
    ]);

    selectedPresenceControlEntriesByGroup$ = selectedPresenceControlEntries$;

    absence = buildPresenceType(2, true, false);
    blockLessons = [jenni.lessonPresence];

    stateServiceMock = {
      loading$: of(false),
      lessons$: of([lesson]),
      selectedLesson$: of(lesson),
      selectedPresenceControlEntries$,
      selectedPresenceControlEntriesByGroup$,
      getNextPresenceType: jasmine
        .createSpy('getNextPresenceType')
        .and.callFake(() => of(absence)),
      getBlockLessonPresences: jasmine
        .createSpy('getBlockLessonPresences')
        .and.callFake(() => of(blockLessons)),
      hasUnconfirmedAbsences: () => of(false),
      viewMode$: of(),
      loadGroupsAvailability: jasmine
        .createSpy('loadGroupsAvailability')
        .and.callFake(() => of(false)),
    } as unknown as PresenceControlStateService;

    lessonPresencesUpdateServiceMock = {
      updatePresenceTypes: jasmine.createSpy('updatePresenceTypes'),
    } as unknown as LessonPresencesUpdateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlListComponent,
          PresenceControlHeaderComponent,
          PresenceControlEntryComponent,
        ],
        providers: [
          {
            provide: PresenceControlStateService,
            useValue: stateServiceMock,
          },
          {
            provide: LessonPresencesUpdateService,
            useValue: lessonPresencesUpdateServiceMock,
          },
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe('.presenceControlEntries$', () => {
    it('emits all entries initially', () => {
      expect(getRenderedStudentNames()).toEqual([
        'Bichsel Peter',
        'Frisch Max',
        'Zoë Jenny',
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
        jenni,
      ]);
      fixture.detectChanges();
      expect(getRenderedStudentNames()).toEqual(['Frisch Max', 'Frisch Peter']);
    });
  });

  describe('.doTogglePresenceType', () => {
    beforeEach(() => {});

    it('updates given entry without block lesson dialog', () => {
      component.togglePresenceType(bichsel);
      expect(
        lessonPresencesUpdateServiceMock.updatePresenceTypes
      ).toHaveBeenCalledWith([bichsel.lessonPresence], absence.Id);
    });

    it('updates given entry to next presence type', () => {
      component.doTogglePresenceType(bichsel);
      expect(
        lessonPresencesUpdateServiceMock.updatePresenceTypes
      ).toHaveBeenCalledWith([bichsel.lessonPresence], absence.Id);
    });
  });

  function getRenderedStudentNames(): string[] {
    return Array.prototype.slice
      .call(element.querySelectorAll('.default-entries .student-name'))
      .map((e) => e.textContent.trim());
  }

  function buildPresenceControlEntry(
    studentName: string
  ): PresenceControlEntry {
    const presenceControlEntry = new PresenceControlEntry(
      buildLessonPresence(
        lesson.LessonRef.Id,
        lesson.LessonDateTimeFrom,
        lesson.LessonDateTimeTo,
        lesson.EventDesignation,
        studentName
      ),
      null,
      null
    );

    Object.defineProperty(presenceControlEntry, 'settings', {
      get: () => settings,
    });
    return presenceControlEntry;
  }
});
