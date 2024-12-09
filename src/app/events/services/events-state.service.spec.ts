import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts/lib/index";
import { Course } from "src/app/shared/models/course.model";
import { Event } from "src/app/shared/models/event.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { Subscription } from "src/app/shared/models/subscription.model";
import { StorageService } from "src/app/shared/services/storage.service";
import {
  buildCourse,
  buildFinalGrading,
  buildStudyClass,
  buildSubscription,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EventEntry,
  EventState,
  EventsStateService,
} from "./events-state.service";

describe("EventsStateService", () => {
  let service: EventsStateService;
  let httpTestingController: HttpTestingController;

  let courses: Course[];
  let courseEntries: EventEntry[];
  let studyCourses: Event[];
  let studyCoursesEntries: EventEntry[];
  let subscriptions: Subscription[];
  let studyClasses: StudyClass[];
  let studyClassEntries: EventEntry[];
  let assessments: StudyClass[];
  let assessmentEntries: EventEntry[];

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload() {
                return {
                  culture_info: "de_CH",
                  fullname: "Jane Doe",
                  id_person: "123",
                  holder_id: "456",
                  instance_id: "678",
                  roles: "",
                  substitution_id: undefined,
                };
              },
            },
          },
        ],
      }),
    );

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EventsStateService);

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

    studyClasses = [buildStudyClass(5, "22a"), buildStudyClass(6, "22b")];
    studyClassEntries = [
      {
        id: 5,
        designation: "22a",
        detailLink: "/events/students/5?returnlink=%2F",
        studentCount: 0,
        state: null,
      },
    ];

    assessments = [studyClasses[1]];
    assessmentEntries = [
      {
        id: 6,
        designation: "22b",
        detailLink: "/events/students/6?returnlink=%2F",
        studentCount: 0,
        state: EventState.Rating,
        evaluationText: "events.state.rating",
        evaluationLink: "link-to-evaluation-module/6",
      },
    ];

    const ratedCourse = Object.assign(
      buildCourse(
        5,
        "Deutsch",
        attendance,
        {
          ...evaluationStatus,
          HasReviewOfEvaluationStarted: true,
        },
        studyClasses,
      ),
      {
        FinalGrades: [buildFinalGrading(45)],
      },
    );

    courses = [
      buildCourse(1, "Physik", attendance, evaluationStatus, studyClasses),
      buildCourse(
        2,
        "Bio",
        attendance,
        {
          ...evaluationStatus,
          HasEvaluationStarted: true,
          EvaluationUntil: new Date(2022, 5, 3),
        },
        [studyClasses[0]],
      ),
      buildCourse(
        3,
        "Zeichnen",
        attendance,
        {
          ...evaluationStatus,
          HasEvaluationStarted: true,
        },
        [studyClasses[1]],
        10300,
      ),
      buildCourse(
        4,
        "Franz",
        attendance,
        {
          ...evaluationStatus,
          HasTestGrading: true,
        },
        studyClasses,
      ),
      ratedCourse,
    ];

    const courseEvent: EventEntry = {
      id: 1,
      designation: "Physik, 22a, 22b",
      detailLink: "/events/students/1?returnlink=%2F",
      dateFrom: new Date("2022-02-09T00:00:00"),
      dateTo: new Date("2022-06-30T00:00:00"),
      studentCount: 20,
      state: null,
      evaluationText: "",
      evaluationLink: null,
    };

    courseEntries = [
      {
        ...courseEvent,
        id: 2,
        designation: "Bio, 22a",
        detailLink: "/events/students/2?returnlink=%2F",
        state: EventState.RatingUntil,
        evaluationText: "events.state.rating-until 03.06.2022",
        evaluationLink: "link-to-evaluation-module/2",
      },
      {
        ...courseEvent,
        id: 4,
        designation: "Franz, 22a, 22b",
        detailLink: "/events/students/4?returnlink=%2F",
        state: EventState.Tests,
        evaluationText: "events.state.add-tests",
      },
      courseEvent,
      {
        ...courseEvent,
        id: 3,
        designation: "Zeichnen, 22b",
        detailLink: "/events/students/3?returnlink=%2F",
        state: EventState.IntermediateRating,
        evaluationText: "events.state.intermediate-rating",
        evaluationLink: "link-to-evaluation-module/3",
      },
    ];

    studyCourses = [
      {
        Id: 10,
        Designation: "Zentraler Gymnasialer Bildungsgang",
        Leadership: "Jane Doe",
        StudentCount: 2, // Wrong count, has to be determined via subscriptions
      },
      {
        Id: 20,
        Designation: "Berufsmaturität",
        Leadership: "John Doe", // Other leader (study course is ignored)
        StudentCount: 10,
      },
    ];
    studyCoursesEntries = [
      {
        id: 10,
        designation: "Zentraler Gymnasialer Bildungsgang",
        studentCount: 3,
        detailLink: "/events/students/10?returnlink=%2F",
        state: null,
      },
    ];

    subscriptions = [
      buildSubscription(100, 10, 1),
      buildSubscription(100, 10, 2),
      buildSubscription(100, 10, 3),
    ];
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe("with ClassTeacherRole", () => {
    beforeEach(() => {
      service.setRoles("ClassTeacherRole;TeacherRole");
    });

    it("loads events", () => {
      service.getEntries().subscribe((result) => {
        expect(result).toEqual([
          ...studyClassEntries,
          ...assessmentEntries,
          ...courseEntries,
        ]);
      });

      expectCoursesRequest();
      expectFormativeAssessmentsRequest();
      expectStudyClassesRequest();

      httpTestingController.verify();
    });

    it("loads events with study courses", () => {
      service.setWithStudyCourses(true);

      service.getEntries().subscribe((result) => {
        expect(result).toEqual([
          ...studyClassEntries,
          ...assessmentEntries,
          ...courseEntries,
          ...studyCoursesEntries,
        ]);
      });

      expectCoursesRequest();
      expectStudyCoursesRequest();
      expectSubscriptionsRequest();
      expectFormativeAssessmentsRequest();
      expectStudyClassesRequest();

      httpTestingController.verify();
    });
  });

  describe("without ClassTeacherRole", () => {
    beforeEach(() => {
      service.setRoles("TeacherRole");
    });

    it("loads events", () => {
      service
        .getEntries()
        .subscribe((result) =>
          expect(result.map((r) => r.id)).toEqual([2, 4, 1, 3]),
        );

      expectCoursesRequest();

      httpTestingController.verify();
    });

    it("loads events with ratings", () => {
      service
        .getEntries(true)
        .subscribe((result) =>
          expect(result.map((r) => r.id)).toEqual([2, 4, 3]),
        );

      expectCoursesRequest();

      httpTestingController.verify();
    });
  });

  function expectCoursesRequest(response = courses): void {
    const url =
      "https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300";

    httpTestingController
      .expectOne(url)
      .flush(t.array(Course).encode(response));
  }

  function expectStudyCoursesRequest(response = studyCourses): void {
    const url = "https://eventotest.api/Events/?filter.EventTypeId==1";

    httpTestingController.expectOne(url).flush(t.array(Event).encode(response));
  }

  function expectSubscriptionsRequest(response = subscriptions): void {
    const url =
      "https://eventotest.api/Subscriptions/?filter.EventId=;10&fields=Id,EventId";

    httpTestingController
      .expectOne(url)
      .flush(t.array(Subscription).encode(response));
  }

  function expectFormativeAssessmentsRequest(response = assessments): void {
    const url =
      "https://eventotest.api/StudyClasses/FormativeAssessments?filter.IsActive==true";

    httpTestingController
      .expectOne(url)
      .flush(t.array(StudyClass).encode(response));
  }

  function expectStudyClassesRequest(response = studyClasses): void {
    const url = "https://eventotest.api/StudyClasses/?filter.IsActive==true";

    httpTestingController
      .expectOne(url)
      .flush(t.array(StudyClass).encode(response));
  }
});
