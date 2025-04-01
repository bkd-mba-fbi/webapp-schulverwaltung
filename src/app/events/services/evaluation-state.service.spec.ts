/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject, of, throwError } from "rxjs";
import { Course } from "src/app/shared/models/course.model";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade } from "src/app/shared/models/grading-scale.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { GradingItemsRestService } from "src/app/shared/services/grading-items-rest.service";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import {
  buildCourse,
  buildGradingItem,
  buildGradingScale,
  buildStudyClass,
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

  let params: Subject<Params>;
  let course: Course;
  let studyClass: StudyClass;
  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let grade1: Grade;
  let grade2: Grade;

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

    grade1 = { Id: 100001, Designation: "4.0" };
    grade2 = { Id: 100002, Designation: "4.5" };

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

              console.log("mock", buildGradingScale(10000, [grade1, grade2]));
              gradingScalesServiceMock.get.and.returnValue(
                of(buildGradingScale(10000, [grade1, grade2])),
              );

              return gradingScalesServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(EvaluationStateService);
  });

  describe("event", () => {
    beforeEach(() => {
      // Since we use toLazySignal, trigger the fetch first
      service.event();
    });

    it("returns course if available", () => {
      params.next({ id: "1000" });
      expect(service.event()).toEqual({
        id: 1000,
        designation: "Mathematik, BVS2024a",
        type: "course",
        studentCount: 24,
        gradingScaleId: 10000,
      });
    });

    it("returns study class if course is not available", () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      params.next({ id: "2000" });
      expect(service.event()).toEqual({
        id: 2000,
        designation: "Berufsvorbereitendes Schuljahr 2024a",
        type: "study-class",
        studentCount: 23,
        gradingScaleId: null,
      });
    });

    it("returns study class if course and study class are not available", () => {
      coursesServiceMock.getCourseWithStudentCount.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      studyClassesServiceMock.get.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 })),
      );
      params.next({ id: "2000" });
      expect(service.event()).toBeNull();
    });
  });

  describe("entries", () => {
    beforeEach(() => {
      // Since we use toLazySignal, trigger the fetch first
      service.event();
      service.entries();
      params.next({ id: "1000" });
    });

    it("returns an empty array if no grading items are available", () => {
      gradingItemsServiceMock.getListForEvent.and.returnValue(of([]));

      expect(service.entries()).toEqual([]);
    });

    fit("returns an entries with corresponding grading item & grade from grading scale", () => {
      // gradingItemsServiceMock.getListForEvent.and.returnValue(
      //   of([gradingItem1, gradingItem2]),
      // );

      expect(service.entries()).toEqual([
        { gradingItem: gradingItem1, grade: grade1 },
        { gradingItem: gradingItem2, grade: grade2 },
      ]);
    });
  });
});
