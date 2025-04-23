/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from "@angular/common/http";
import { Signal, runInInjectionContext } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject, of, take, throwError } from "rxjs";
import { SubscriptionDetailsDisplay } from "src/app/shared/models/configurations.model";
import { Course } from "src/app/shared/models/course.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { ConfigurationsRestService } from "src/app/shared/services/configurations-rest.service";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { GradingItemsRestService } from "src/app/shared/services/grading-items-rest.service";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import {
  buildCourse,
  buildGradingItem,
  buildGradingScale,
  buildStudyClass,
  buildSubscriptionDetail,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationStateService } from "./evaluation-state.service";

describe("EvaluationStateService", () => {
  let service: EvaluationStateService;
  let activatedRouteMock: ActivatedRoute;
  let coursesServiceMock: jasmine.SpyObj<CoursesRestService>;
  let studyClassesServiceMock: jasmine.SpyObj<StudyClassesRestService>;
  let gradingItemsServiceMock: jasmine.SpyObj<GradingItemsRestService>;
  let gradingScalesServiceMock: jasmine.SpyObj<GradingScalesRestService>;
  let configurationsServiceMock: jasmine.SpyObj<ConfigurationsRestService>;
  let subscriptionDetailsServiceMock: jasmine.SpyObj<SubscriptionDetailsRestService>;

  let params: Subject<Params>;
  let course: Course;
  let studyClass: StudyClass;
  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let gradingScale: GradingScale;
  let grade1: Grade;
  let grade2: Grade;
  let detail1: SubscriptionDetail;
  let detail2: SubscriptionDetail;
  let detail3: SubscriptionDetail;
  let detail4: SubscriptionDetail;
  let display: SubscriptionDetailsDisplay;

  beforeEach(() => {
    studyClass = buildStudyClass(2000);
    studyClass.Designation = "Berufsvorbereitendes Schuljahr 2024a";
    studyClass.Number = "BVS2024a";
    studyClass.StudentCount = 23;

    course = buildCourse(1000);
    course.Designation = "Mathematik";
    course.AttendanceRef.StudentCount = 24;
    course.Classes = [studyClass];
    course.GradingScaleId = 10000;

    gradingItem1 = buildGradingItem(10001, 100001);
    gradingItem1.IdPerson = 1001;
    gradingItem1.PersonFullname = "Paul McCartney";

    gradingItem2 = buildGradingItem(10002, 100002);
    gradingItem2.IdPerson = 1002;
    gradingItem2.PersonFullname = "John Lennon";

    grade1 = { Id: 100001, Designation: "4.0", Value: 4.0, Sort: "10" };
    grade2 = { Id: 100002, Designation: "4.5", Value: 4.5, Sort: "11" };
    gradingScale = buildGradingScale(10000, [grade1, grade2]);

    detail1 = buildSubscriptionDetail(3902);
    detail1.VssDesignation = "Anforderungen";
    detail1.Tooltip = "Art der Anforderungen";
    detail1.IdPerson = gradingItem1.IdPerson;
    detail1.Sort = "10";

    detail2 = buildSubscriptionDetail(3902);
    detail2.VssDesignation = "Anforderungen";
    detail2.Tooltip = "Art der Anforderungen";
    detail2.IdPerson = gradingItem2.IdPerson;
    detail2.Sort = "11";

    detail3 = buildSubscriptionDetail(3936);
    detail3.VssDesignation = "Pünktlichkeit";
    detail3.IdPerson = gradingItem1.IdPerson;
    detail3.Sort = "20";

    detail4 = buildSubscriptionDetail(3936);
    detail4.VssDesignation = "Pünktlichkeit";
    detail4.IdPerson = gradingItem2.IdPerson;
    detail4.Sort = "21";

    display = {
      adAsColumns: [detail1.VssId, detail2.VssId],
      adAsCriteria: [detail3.VssId, detail4.VssId],
    };

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          EvaluationStateService,
          {
            provide: ActivatedRoute,
            useFactory() {
              params = new Subject();
              activatedRouteMock = {
                parent: {
                  params,
                },
              } as any;

              return activatedRouteMock;
            },
          },
          {
            provide: CoursesRestService,
            useFactory() {
              coursesServiceMock = jasmine.createSpyObj("CoursesRestService", [
                "getCourseWithStudentCount",
              ]);

              coursesServiceMock.getCourseWithStudentCount.and.returnValue(
                of(course),
              );

              return coursesServiceMock;
            },
          },
          {
            provide: StudyClassesRestService,
            useFactory() {
              studyClassesServiceMock = jasmine.createSpyObj(
                "StudyClassesRestService",
                ["get"],
              );

              studyClassesServiceMock.get.and.returnValue(of(studyClass));

              return studyClassesServiceMock;
            },
          },
          {
            provide: GradingItemsRestService,
            useFactory() {
              gradingItemsServiceMock = jasmine.createSpyObj(
                "GradingItemsRestService",
                ["getListForEvent"],
              );

              gradingItemsServiceMock.getListForEvent.and.returnValue(
                of([gradingItem1, gradingItem2]),
              );

              return gradingItemsServiceMock;
            },
          },
          {
            provide: GradingScalesRestService,
            useFactory() {
              gradingScalesServiceMock = jasmine.createSpyObj(
                "GradingScalesRestService",
                ["get"],
              );

              gradingScalesServiceMock.get.and.returnValue(of(gradingScale));

              return gradingScalesServiceMock;
            },
          },
          {
            provide: ConfigurationsRestService,
            useFactory() {
              configurationsServiceMock = jasmine.createSpyObj(
                "ConfigurationsRestService",
                ["getSubscriptionDetailsDisplay"],
              );

              configurationsServiceMock.getSubscriptionDetailsDisplay.and.returnValue(
                of(display),
              );

              return configurationsServiceMock;
            },
          },
          {
            provide: SubscriptionDetailsRestService,
            useFactory() {
              subscriptionDetailsServiceMock = jasmine.createSpyObj(
                "SubscriptionDetailsRestService",
                ["getListForEvent"],
              );

              subscriptionDetailsServiceMock.getListForEvent.and.returnValue(
                of([detail1, detail2, detail3, detail4]),
              );

              return subscriptionDetailsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(EvaluationStateService);
  });

  describe("event", () => {
    it("returns course if available", fakeAsync(async () => {
      params.next({ id: "1000" });

      await expectSignalValue(service.event, (result) => {
        expect(result).toEqual({
          id: 1000,
          designation: "Mathematik, BVS2024a",
          type: "course",
          studentCount: 24,
          gradingScaleId: 10000,
        });
      });
    }));

    it("returns study class if available", fakeAsync(async () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      params.next({ id: "2000" });

      await expectSignalValue(service.event, (result) => {
        expect(result).toEqual({
          id: 2000,
          designation: "Berufsvorbereitendes Schuljahr 2024a",
          type: "study-class",
          studentCount: 23,
          gradingScaleId: null,
        });
      });
    }));

    it("returns null if both course & study class are not available", fakeAsync(async () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      studyClassesServiceMock.get.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      params.next({ id: "2000" });

      await expectSignalValue(service.event, (result) => {
        expect(result).toBeNull();
      });
    }));

    it("returns module event without class (special case of course)", fakeAsync(async () => {
      course.Classes = null;
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(of(course));
      params.next({ id: "1000" });

      await expectSignalValue(service.event, (result) => {
        expect(result).toEqual({
          id: 1000,
          designation: "Mathematik",
          type: "course",
          studentCount: 24,
          gradingScaleId: 10000,
        });
      });
    }));
  });

  describe("columns", () => {
    it("returns an empty array if subscription details are available", fakeAsync(async () => {
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(of([]));
      params.next({ id: "1000" });

      await expectSignalValue(service.columns, (result) => {
        expect(result).toEqual([]);
      });
    }));

    it("returns an array of all relevant columns", fakeAsync(async () => {
      params.next({ id: "1000" });

      await expectSignalValue(service.columns, (result) => {
        expect(result).toEqual([
          {
            vssId: 3902,
            title: "Anforderungen",
            tooltip: "Art der Anforderungen",
            sort: "10",
          },
        ]);
      });
    }));
  });

  describe("entries", () => {
    it("returns an empty array if no grading items are available", fakeAsync(async () => {
      gradingItemsServiceMock.getListForEvent.and.returnValue(of([]));
      params.next({ id: "1000" });

      await expectSignalValue(service.entries, (result) => {
        expect(result).toEqual([]);
      });
    }));

    it("returns entries with corresponding grading item, grade from grading scale and column/criteria subscription details", fakeAsync(async () => {
      params.next({ id: "1000" });

      await expectSignalValue(service.entries, (result) => {
        expect(result).toEqual([
          {
            gradingItem: gradingItem2,
            grade: grade2,
            columns: [detail2],
            criteria: [detail4],
          },
          {
            gradingItem: gradingItem1,
            grade: grade1,
            columns: [detail1],
            criteria: [detail3],
          },
        ]);
      });
    }));
  });

  describe("noEvaluation", () => {
    it("returns true if no grading scale, no columns & no criteria are available", fakeAsync(async () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(of([]));
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(true);
      });
    }));

    it("returns false if grading scale, columns & criteria are available", fakeAsync(async () => {
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(false);
      });
    }));

    it("returns false if grading scale but no columns/criteria are available", fakeAsync(async () => {
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(of([]));
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(false);
      });
    }));

    it("returns false if no grading scale but columns are available", fakeAsync(async () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(
        of([detail1, detail2]),
      );
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(false);
      });
    }));

    it("returns false if grading scale & columns are available", fakeAsync(async () => {
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(
        of([detail1, detail2]),
      );
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(false);
      });
    }));

    it("returns false if grading scale & criteria are available", fakeAsync(async () => {
      subscriptionDetailsServiceMock.getListForEvent.and.returnValue(
        of([detail3, detail4]),
      );
      params.next({ id: "1000" });

      await expectSignalValue(service.noEvaluation, (result) => {
        expect(result).toBe(false);
      });
    }));
  });

  describe("updateGradingItems", () => {
    it("updates grading items when called", fakeAsync(async () => {
      params.next({ id: "1000" });

      const newGradeId = 1234;
      const updated1 = { ...gradingItem1, IdGrade: newGradeId };
      const updated2 = { ...gradingItem2, IdGrade: newGradeId };
      service.updateGradingItems([updated1, updated2]);

      await expectSignalValue(service.gradingItems, (updatedResult) => {
        expect(updatedResult).toEqual([updated1, updated2]);
        expect(updatedResult.every((g) => g.IdGrade === newGradeId)).toBeTrue();
      });
    }));
  });

  /**
   * When toObservable is involved, it uses a ReplaySubject internally. That
   * means the first value comes synchronously and the rest asynchronously. So
   * we use `tick()` to be able to assert the "async result".
   *
   * Must be used within a `fakeAsync` context.
   */
  function expectSignalValue<T>(
    signal: Signal<T>,
    expectation: (result: T) => void,
  ): Promise<void> {
    return new Promise((resolve: () => void) => {
      const result = runInInjectionContext(TestBed, () => toObservable(signal));

      tick();

      result.pipe(take(1)).subscribe((result) => {
        expectation(result);
        resolve();
      });
    });
  }
});
