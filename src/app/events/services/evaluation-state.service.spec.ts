/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject, of, throwError } from "rxjs";
import { Course } from "src/app/shared/models/course.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { buildCourse, buildStudyClass } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationStateService } from "./evaluation-state.service";

describe("EvaluationStateService", () => {
  let service: EvaluationStateService;
  let activatedRouteMock: ActivatedRoute;
  let coursesServiceMock: jasmine.SpyObj<CoursesRestService>;
  let studyClassesServiceMock: jasmine.SpyObj<StudyClassesRestService>;
  let params: Subject<Params>;
  let course: Course;
  let studyClass: StudyClass;

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
});
