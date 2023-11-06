import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { Course } from "src/app/shared/models/course.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { ReportsService } from "src/app/shared/services/reports.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildCourse, buildResult, buildTest } from "../../../../spec-builders";
import { TestStateService } from "../../services/test-state.service";
import { AverageGradesComponent } from "../grades/average-grades/average-grades.component";
import { TestEditGradesComponent } from "../test-edit-grades/test-edit-grades.component";
import { TestTableHeaderComponent } from "../test-table-header/test-table-header.component";
import { TestsHeaderComponent } from "../tests-header/tests-header.component";
import { TestsListComponent } from "./tests-list.component";

describe("TestsListComponent", () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;
  let element: HTMLElement;
  let testStateServiceMock: TestStateService;
  let result: Result;
  let test: Test;
  let course: Course;
  let tests$: BehaviorSubject<Test[]>;
  let hasTests$: BehaviorSubject<boolean>;
  let canSetFinalGrade$: BehaviorSubject<boolean>;

  beforeEach(waitForAsync(() => {
    result = buildResult(12, 1);
    test = buildTest(1234, 12, [result]);
    course = buildCourse(1234);
    course.EvaluationStatusRef = {
      HasEvaluationStarted: false,
      EvaluationUntil: null,
      HasReviewOfEvaluationStarted: false,
      HasTestGrading: false,
      Id: 6980,
    };

    tests$ = new BehaviorSubject([test]);
    hasTests$ = new BehaviorSubject(true);
    canSetFinalGrade$ = new BehaviorSubject(true);

    testStateServiceMock = {
      getCourse: () => of(course),
      setSorting: () => of({ key: "FullName", ascending: true }),
      getSortingChar$: () => of("FullName"),
      loading$: of(false),
      tests$: tests$.asObservable(),
      hasTests$: hasTests$.asObservable(),
      course$: of(course),
      canSetFinalGrade$: canSetFinalGrade$.asObservable(),
    } as unknown as TestStateService;

    const reportServiceMock = jasmine.createSpyObj("reportService", [
      "getCourseReports",
    ]);
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          TestsListComponent,
          TestsHeaderComponent,
          TestEditGradesComponent,
          TestTableHeaderComponent,
          AverageGradesComponent,
        ],
        providers: [
          { provide: TestStateService, useValue: testStateServiceMock },
          {
            provide: ReportsService,
            useValue: reportServiceMock as ReportsService,
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TestsListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("rating overview external link", () => {
    describe("can set final grade", () => {
      beforeEach(() => {
        canSetFinalGrade$.next(true);
      });

      it("is present with correct link", () => {
        fixture.detectChanges();

        const link = getRatingOverviewLink();
        expect(link).toBeTruthy();
        expect(link?.href).toBe(
          `http://localhost:9876/link-to-evaluation-module/${course.Id}`,
        );
      });

      it("is visible on mobile if no test is selected and tests are available", () => {
        fixture.detectChanges();
        selectTest(0);
        fixture.detectChanges();

        const link = getRatingOverviewLink();
        expect(link).toBeTruthy();
        expect(link?.classList?.contains("visible-on-mobile")).toBe(true);
      });

      it("is visible on mobile if no test is selected and no tests are available", () => {
        fixture.detectChanges();
        selectTest(0);
        tests$.next([]);
        hasTests$.next(false);
        fixture.detectChanges();

        const link = getRatingOverviewLink();
        expect(link).toBeTruthy();
        expect(link?.classList?.contains("visible-on-mobile")).toBe(true);
      });

      it("is not visible on mobile if test is selected and tests are available", () => {
        fixture.detectChanges();
        selectTest(1);
        fixture.detectChanges();

        const link = getRatingOverviewLink();
        expect(link).toBeTruthy();
        expect(link?.classList?.contains("visible-on-mobile")).toBe(false);
      });
    });

    describe("cannot set final grade", () => {
      beforeEach(() => {
        canSetFinalGrade$.next(false);
      });

      it("is absent", () => {
        const link = getRatingOverviewLink();
        expect(link).toBeNull();
      });
    });
  });

  function getRatingOverviewLink() {
    return element.querySelector<HTMLAnchorElement>("a.rating-overview");
  }

  function selectTest(index: number) {
    const testsSelect = element.querySelector<HTMLSelectElement>(
      ".tests-dropdown select",
    );
    expect(testsSelect).toBeTruthy();

    const options = testsSelect!.querySelectorAll<HTMLOptionElement>("option");
    options[index].selected = true;
    testsSelect!.dispatchEvent(new Event("change"));
  }
});
