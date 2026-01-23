import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts/lib/index";
import { Event } from "src/app/shared/models/event.model";
import { Subscription } from "src/app/shared/models/subscription.model";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildSubscription } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventEntry } from "./events-state.service";
import { StudyCoursesStateService } from "./study-courses-state.service";

describe("StudyCoursesStateService", () => {
  let service: StudyCoursesStateService;
  let httpTestingController: HttpTestingController;

  let studyCourses: Event[];
  let studyCoursesEntries: EventEntry[];
  let subscriptions: Subscription[];

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          StudyCoursesStateService,
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
    service = TestBed.inject(StudyCoursesStateService);

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
        detailLink: "/events/10/students?returnlink=%2F",
        state: null,
      },
    ];

    subscriptions = [
      buildSubscription(100, 10, 1),
      buildSubscription(100, 10, 2),
      buildSubscription(100, 10, 3),
    ];
  });

  it("loads events with study courses", () => {
    service.studyCourses$.subscribe((result) => {
      expect(result).toEqual(studyCoursesEntries);
    });

    expectStudyCoursesRequest();
    expectSubscriptionsRequest();

    httpTestingController.verify();
  });

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
});
