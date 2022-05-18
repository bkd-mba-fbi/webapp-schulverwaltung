import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as t from 'io-ts/lib/index';
import { Course } from 'src/app/shared/models/course.model';
import { StudyClass } from 'src/app/shared/models/study-class.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  buildCourse,
  buildFinalGrading,
  buildStudyClass,
} from 'src/spec-builders';
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
  let assessments: StudyClass[];
  let assessmentEvents: Event[];

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

    studyClasses = [buildStudyClass(5, '22a'), buildStudyClass(6, '22b')];
    studyClassEvents = [
      {
        id: 5,
        Designation: '22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=5',
        studentCount: 0,
        state: null,
      },
    ];

    assessments = [studyClasses[1]];
    assessmentEvents = [
      {
        id: 6,
        Designation: '22b',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=6',
        studentCount: 0,
        state: EventState.Rating,
        evaluationText: 'events.state.rating',
        evaluationLink: 'link-to-evaluation-module.aspx?IDAnlass=6',
      },
    ];

    const ratedCourse = Object.assign(
      buildCourse(
        5,
        'Deutsch',
        attendance,
        {
          ...evaluationStatus,
          HasReviewOfEvaluationStarted: true,
        },
        studyClasses
      ),
      {
        FinalGrades: [buildFinalGrading(45)],
      }
    );

    courses = [
      buildCourse(1, 'Physik', attendance, evaluationStatus, studyClasses),
      buildCourse(
        2,
        'Bio',
        attendance,
        {
          ...evaluationStatus,
          HasEvaluationStarted: true,
          EvaluationUntil: new Date(2022, 5, 3),
        },
        [studyClasses[0]]
      ),
      buildCourse(
        3,
        'Zeichnen',
        attendance,
        {
          ...evaluationStatus,
          HasEvaluationStarted: true,
        },
        [studyClasses[1]]
      ),
      buildCourse(
        4,
        'Franz',
        attendance,
        {
          ...evaluationStatus,
          HasTestGrading: true,
        },
        studyClasses
      ),
      ratedCourse,
    ];

    const courseEvent: Event = {
      id: 1,
      Designation: 'Physik, 22a, 22b',
      detailLink: 'link-to-event-detail-module.aspx?IDAnlass=1',
      dateFrom: new Date('2022-02-09T00:00:00'),
      dateTo: new Date('2022-06-30T00:00:00'),
      studentCount: 20,
      state: null,
      evaluationText: '',
      evaluationLink: null,
    };

    courseEvents = [
      {
        ...courseEvent,
        id: 2,
        Designation: 'Bio, 22a',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=2',
        state: EventState.RatingUntil,
        evaluationText: 'events.state.rating-until 03.06.2022',
        evaluationLink: 'link-to-evaluation-module.aspx?IDAnlass=2',
      },
      {
        ...courseEvent,
        id: 4,
        Designation: 'Franz, 22a, 22b',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=4',
        state: EventState.Tests,
        evaluationText: 'events.state.add-tests',
      },
      courseEvent,
      {
        ...courseEvent,
        id: 3,
        Designation: 'Zeichnen, 22b',
        detailLink: 'link-to-event-detail-module.aspx?IDAnlass=3',
        state: EventState.IntermediateRating,
        evaluationText: 'events.state.intermediate-rating',
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
          expect(result).toEqual([
            ...studyClassEvents,
            ...assessmentEvents,
            ...courseEvents,
          ])
        );

      expectCoursesRequest();
      expectFormativeAssessmentsRequest();
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
      'https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300';

    httpTestingController
      .expectOne(url)
      .flush(t.array(Course).encode(response));
  }

  function expectFormativeAssessmentsRequest(response = assessments): void {
    const url =
      'https://eventotest.api/StudyClasses/FormativeAssessments?filter.IsActive==true';

    httpTestingController
      .expectOne(url)
      .flush(t.array(StudyClass).encode(response));
  }

  function expectStudyClassesRequest(response = studyClasses): void {
    const url = 'https://eventotest.api/StudyClasses/?filter.IsActive==true';

    httpTestingController
      .expectOne(url)
      .flush(t.array(StudyClass).encode(response));
  }
});
