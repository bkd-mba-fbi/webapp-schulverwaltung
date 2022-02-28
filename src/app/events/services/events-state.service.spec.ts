import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as t from 'io-ts/lib/index';
import { Course } from 'src/app/shared/models/course.model';
import { StudyClass } from 'src/app/shared/models/study-class.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { buildCourse, buildStudyClass } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { Event, EventsStateService, EventState } from './events-state.service';

describe('EventsStateService', () => {
  let service: EventsStateService;
  let httpTestingController: HttpTestingController;
  let storageServiceMock: StorageService;

  let courseEvents: Event[];
  let courses: Course[];
  let studyClassEvents: Event[];
  let studyClasses: StudyClass[];

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          EventsStateService,
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj('StorageService', ['getPayload']),
          },
        ],
      })
    );

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EventsStateService);
    storageServiceMock = TestBed.inject(StorageService);

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2022, 2, 3));

    const evaluationStatus = {
      HasEvaluationStarted: false,
      EvaluationUntil: null,
      HasReviewOfEvaluationStarted: false,
      HasTestGrading: false,
      Id: 6980,
    };

    const attendance = {
      Id: 6980,
      StudentCount: 20,
    };

    courses = [
      buildCourse(1, 'Physik-22a', attendance, evaluationStatus),
      buildCourse(2, 'Bio-22a', attendance, {
        ...evaluationStatus,
        HasEvaluationStarted: true,
        EvaluationUntil: new Date(2022, 5, 3),
      }),
      buildCourse(3, 'Zeichnen-22a', attendance, {
        ...evaluationStatus,
        HasEvaluationStarted: true,
      }),
      buildCourse(4, 'Franz-22a', attendance, {
        ...evaluationStatus,
        HasTestGrading: true,
      }),
    ];

    studyClasses = [buildStudyClass(5, '22a')];
    studyClassEvents = [
      {
        id: 5,
        Designation: '22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=5',
        studentCount: 0,
        state: EventState.Rating,
        evaluationLink: 'link-to-evaluation-module.aspx?IDAnlass=5',
      },
    ];

    const courseEvent: Event = {
      id: 1,
      Designation: 'Physik-22a',
      detailLink: 'link-to-event-detail-module.aspx?IDAnlass=1',
      dateFrom: new Date('2022-02-09T00:00:00'),
      dateTo: new Date('2022-06-30T00:00:00'),
      studentCount: 20,
      state: null,
      ratingUntil: null,
      evaluationLink: null,
    };

    courseEvents = [
      {
        ...courseEvent,
        id: 2,
        Designation: 'Bio-22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=2',
        state: EventState.RatingUntil,
        ratingUntil: new Date(2022, 5, 3),
        evaluationLink: 'link-to-evaluation-module.aspx?IDAnlass=2',
      },
      {
        ...courseEvent,
        id: 4,
        Designation: 'Franz-22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=4',
        state: EventState.Tests,
      },
      courseEvent,
      {
        ...courseEvent,
        id: 3,
        Designation: 'Zeichnen-22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=3',
        state: EventState.IntermediateRating,
        evaluationLink: 'link-to-evaluation-module.aspx?IDAnlass=3',
      },
    ];
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    httpTestingController.verify();
  });

  describe('with ClassTeacherRole', () => {
    beforeEach(() => {
      (storageServiceMock.getPayload as jasmine.Spy).and.returnValue({
        roles: 'ClassTeacherRole',
      });
    });

    it('loads events', () => {
      service
        .loadEvents()
        .subscribe((result) =>
          expect(result).toEqual([...studyClassEvents, ...courseEvents])
        );

      expectCoursesRequest();
      expectStudyClassesRequest();
    });
  });

  describe('without ClassTeacherRole', () => {
    beforeEach(() => {
      (storageServiceMock.getPayload as jasmine.Spy).and.returnValue({
        roles: '',
      });
    });

    it('loads events', () => {
      service
        .loadEvents()
        .subscribe((result) => expect(result).toEqual(courseEvents));

      expectCoursesRequest();
    });
  });

  function expectCoursesRequest(response = courses): void {
    const url =
      'https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes';

    httpTestingController
      .expectOne(url)
      .flush(t.array(Course).encode(response));
  }

  function expectStudyClassesRequest(response = studyClasses): void {
    const url = 'https://eventotest.api/StudyClasses/FormativeAssessments';

    httpTestingController
      .expectOne(url)
      .flush(t.array(StudyClass).encode(response));
  }
});
