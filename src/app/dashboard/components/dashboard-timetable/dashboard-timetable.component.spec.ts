import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTimetableComponent } from './dashboard-timetable.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  buildLesson,
  buildLessonAbsence,
  buildLessonIncident,
  buildTimetableEntry,
} from 'src/spec-builders';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardTimetableTableComponent } from '../dashboard-timetable-table/dashboard-timetable-table.component';

describe('DashboardTimetableComponent', () => {
  let component: DashboardTimetableComponent;
  let fixture: ComponentFixture<DashboardTimetableComponent>;
  let element: HTMLElement;
  let lessonPresencesServiceMock: jasmine.SpyObj<LessonPresencesRestService>;
  let studentsServiceMock: jasmine.SpyObj<StudentsRestService>;
  let mockSettings: Record<string, any>;
  let dashboardSearchMock: {
    studentId$: Observable<number>;
    hasLessonTeacherRole$: BehaviorSubject<boolean>;
    hasStudentRole$: BehaviorSubject<boolean>;
  };

  beforeEach(async () => {
    jasmine.clock().mockDate(new Date(2000, 0, 23));
    mockSettings = {};

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          DashboardTimetableComponent,
          DashboardTimetableTableComponent,
        ],
        providers: [
          {
            provide: DashboardService,
            useFactory() {
              dashboardSearchMock = {
                studentId$: of(123),
                hasLessonTeacherRole$: new BehaviorSubject(false),
                hasStudentRole$: new BehaviorSubject(false),
              };
              return dashboardSearchMock;
            },
          },
          {
            provide: LessonPresencesRestService,
            useFactory() {
              lessonPresencesServiceMock = jasmine.createSpyObj(
                'LessonPresencesRestService',
                ['getLessonsByDate']
              );
              lessonPresencesServiceMock.getLessonsByDate.and.returnValue(
                of([])
              );
              return lessonPresencesServiceMock;
            },
          },
          {
            provide: StudentsRestService,
            useFactory() {
              studentsServiceMock = jasmine.createSpyObj(
                'StudentsRestService',
                [
                  'getTimetableEntries',
                  'getLessonAbsences',
                  'getLessonIncidents',
                ]
              );
              studentsServiceMock.getTimetableEntries.and.returnValue(of([]));
              studentsServiceMock.getLessonAbsences.and.returnValue(
                of([buildLessonAbsence('1')])
              );
              studentsServiceMock.getLessonIncidents.and.returnValue(
                of([buildLessonIncident()])
              );
              return studentsServiceMock;
            },
          },
          {
            provide: UserSettingsService,
            useValue: {
              getSetting(key: string) {
                return of(mockSettings[key] ?? null);
              },
            },
          },
        ],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardTimetableComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe('LessonTeacherRole', () => {
    beforeEach(() => {
      dashboardSearchMock.hasLessonTeacherRole$.next(true);
    });

    it('renders timetable for today', () => {
      lessonPresencesServiceMock.getLessonsByDate.and.returnValue(
        of([
          buildLesson(
            1,
            new Date(2000, 0, 23, 8, 0),
            new Date(2000, 0, 23, 9, 0),
            'Mathematik',
            'Leonhard Euler',
            '9a',
            10
          ),
          buildLesson(
            2,
            new Date(2000, 0, 23, 9, 0),
            new Date(2000, 0, 23, 10, 0),
            'Zeichnen',
            'Pablo Picasso',
            '9a',
            20
          ),
        ])
      );

      fixture.detectChanges();
      expect(element.textContent).toContain('Sun, 23. January 2000');
      expect(lessonPresencesServiceMock.getLessonsByDate).toHaveBeenCalledWith(
        new Date(2000, 0, 23, 0, 0, 0)
      );
      expect(studentsServiceMock.getTimetableEntries).not.toHaveBeenCalled();

      const rows = element.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);

      // First row
      expect(
        rows[0].querySelector('td:nth-child(1)')?.textContent?.trim()
      ).toBe('08:00–09:00');

      let link = rows[0].querySelector('td:nth-child(2) a');
      expect(link?.textContent?.trim()).toBe('Mathematik, 9a');
      expect(link?.getAttribute('href')).toBe('link-to-event-detail-module/10');

      expect(
        rows[0].querySelector('td:nth-child(3)')?.textContent?.trim()
      ).toBe('dashboard.timetable.table.study-class: 9a'); // Only visible on mobile

      expect(rows[0].querySelector('td:nth-child(4)')).toBeNull(); // No teacher column for teachers

      expect(rows[0].querySelector('td:nth-child(5)')).toBeNull(); // No room column for teachers

      // Second row
      expect(
        rows[1].querySelector('td:nth-child(1)')?.textContent?.trim()
      ).toBe('09:00–10:00');

      link = rows[1].querySelector('td:nth-child(2) a');
      expect(link?.textContent?.trim()).toBe('Zeichnen, 9a');
      expect(link?.getAttribute('href')).toBe('link-to-event-detail-module/20');

      expect(
        rows[1].querySelector('td:nth-child(3)')?.textContent?.trim()
      ).toBe('dashboard.timetable.table.study-class: 9a'); // Only visible on mobile

      expect(rows[1].querySelector('td:nth-child(4)')).toBeNull(); // No teacher column for teachers

      expect(rows[1].querySelector('td:nth-child(5)')).toBeNull(); // No room column for teachers
    });

    it('switches to next day and back to today', () => {
      fixture.detectChanges();
      expect(element.textContent).toContain('Sun, 23. January 2000');
      lessonPresencesServiceMock.getLessonsByDate.calls.reset();

      getNextButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain('Mon, 24. January 2000');
      expect(lessonPresencesServiceMock.getLessonsByDate).toHaveBeenCalledWith(
        new Date(2000, 0, 24, 0, 0, 0)
      );
      lessonPresencesServiceMock.getLessonsByDate.calls.reset();

      getTodayButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain('Sun, 23. January 2000');
      expect(lessonPresencesServiceMock.getLessonsByDate).toHaveBeenCalledWith(
        new Date(2000, 0, 23, 0, 0, 0)
      );
    });

    it('switches to previous day', () => {
      fixture.detectChanges();
      expect(element.textContent).toContain('Sun, 23. January 2000');
      lessonPresencesServiceMock.getLessonsByDate.calls.reset();

      getPreviousButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain('Sat, 22. January 2000');
      expect(lessonPresencesServiceMock.getLessonsByDate).toHaveBeenCalledWith(
        new Date(2000, 0, 22, 0, 0, 0)
      );
    });

    it('does not render calendar subscribe button without user setting', () => {
      fixture.detectChanges();
      const subscribeButton = document.querySelector(
        '.subscribe-calendar-header'
      );
      expect(subscribeButton).toBeNull();
    });

    it('renders calendar subscribe button with user setting', () => {
      mockSettings['cal'] = 'https://subscribe/calendar';
      fixture.detectChanges();

      const subscribeButton = document.querySelector(
        '.subscribe-calendar-header'
      );
      expect(subscribeButton?.textContent?.trim()).toBe(
        'dashboard.timetable.subscribe-calendar'
      );
      expect(subscribeButton?.getAttribute('href')).toBe(
        'https://subscribe/calendar'
      );
    });
  });

  describe('StudentRole', () => {
    beforeEach(() => {
      dashboardSearchMock.hasStudentRole$.next(true);
    });

    it('renders timetable for today', () => {
      const entry1 = buildTimetableEntry(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0)
      );
      entry1.EventId = 10;
      entry1.EventDesignation = 'Mathematik';
      entry1.EventManagerInformation = 'Leonhard Euler';
      entry1.EventLocation = '109';

      const entry2 = buildTimetableEntry(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0)
      );
      entry2.EventId = 20;
      entry2.EventDesignation = 'Zeichnen';
      entry2.EventManagerInformation = 'Pablo Picasso';
      entry2.EventLocation = '502';

      studentsServiceMock.getTimetableEntries.and.returnValue(
        of([entry1, entry2])
      );

      fixture.detectChanges();
      expect(element.textContent).toContain('Sun, 23. January 2000');
      expect(studentsServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        studentsServiceMock.getTimetableEntries.calls.mostRecent().args[0]
      ).toEqual(123);
      const params =
        studentsServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)['filter.From']).toEqual('=2000-01-23');
      expect(
        lessonPresencesServiceMock.getLessonsByDate
      ).not.toHaveBeenCalled();

      const rows = element.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);

      // First row
      expect(
        rows[0].querySelector('td:nth-child(1)')?.textContent?.trim()
      ).toBe('08:00–09:00');

      let label = rows[0].querySelector('td:nth-child(2)');
      expect(label?.textContent?.trim()).toBe('Mathematik');

      expect(
        rows[0].querySelector('td:nth-child(3)')?.textContent?.trim()
      ).toBe('Leonhard Euler');

      expect(
        rows[0].querySelector('td:nth-child(4)')?.textContent?.trim()
      ).toBe('dashboard.timetable.table.room 109');

      // Second row
      expect(
        rows[1].querySelector('td:nth-child(1)')?.textContent?.trim()
      ).toBe('09:00–10:00');

      label = rows[1].querySelector('td:nth-child(2)');
      expect(label?.textContent?.trim()).toBe('Zeichnen');

      expect(
        rows[1].querySelector('td:nth-child(3)')?.textContent?.trim()
      ).toBe('Pablo Picasso');

      expect(
        rows[1].querySelector('td:nth-child(4)')?.textContent?.trim()
      ).toBe('dashboard.timetable.table.room 502');
    });
  });

  function getNextButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>('.btn.next-day');
    expect(button).not.toBeNull();
    return button!;
  }

  function getPreviousButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>('.btn.previous-day');
    expect(button).not.toBeNull();
    return button!;
  }

  function getTodayButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>('.btn.today');
    expect(button).not.toBeNull();
    return button!;
  }
});
