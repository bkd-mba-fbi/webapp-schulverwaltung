import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { Course } from "src/app/shared/models/course.model";
import {
  StudentGrade,
  StudentGradesSortKey,
} from "src/app/shared/models/student-grades";
import { Test } from "src/app/shared/models/test.model";
import {
  buildCourse,
  buildResult,
  buildStudent,
  buildTest,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  INITIAL_TESTS_FILTER,
  TestStateService,
} from "../../../services/test-state.service";
import { TestsTableComponent } from "./tests-table.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("TestsTableComponent", () => {
  let component: TestsTableComponent;
  let fixture: ComponentFixture<TestsTableComponent>;
  let element: HTMLElement;

  let course: Course;
  let gradeTest: Test;
  let pointsTest: Test;
  let studentGrades: StudentGrade[];
  let testStateServiceMock: jasmine.SpyObj<TestStateService>;

  let tests$: BehaviorSubject<Test[]>;
  let hasTests$: BehaviorSubject<boolean>;
  let canSetFinalGrade$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    const gradeResult = buildResult(12, 1);
    gradeResult.TestId = 12;
    gradeResult.StudentId = 100;
    gradeResult.GradeId = 1005;
    gradeResult.GradeValue = 5.0;
    gradeResult.GradeDesignation = "5.0";
    gradeTest = buildTest(1234, 12, [gradeResult]);

    const pointsResult = buildResult(13, 1);
    pointsResult.TestId = 13;
    pointsResult.StudentId = 100;
    pointsResult.GradeId = 1005;
    pointsResult.GradeValue = 5.0;
    pointsResult.GradeDesignation = "5.0";
    pointsResult.Points = 25;
    pointsTest = buildTest(1234, 13, [pointsResult]);
    pointsTest.IsPointGrading = true;
    pointsTest.MaxPoints = 30;

    testStateServiceMock = jasmine.createSpyObj("TestStateService", [
      "canSetFinalGrade$",
      "gradingOptionsForCourse$",
      "gradingOptionsForTest$",
    ]);
    (testStateServiceMock as any).sortCriteria =
      signal<Option<SortCriteria<StudentGradesSortKey>>>(null);

    course = buildCourse(1234);
    course.EvaluationStatusRef = {
      Id: 1,
      HRef: null,
      HasEvaluationStarted: true,
      EvaluationUntil: null,
      HasReviewOfEvaluationStarted: false,
      HasTestGrading: true,
    };
    testStateServiceMock.course$ = of(course);
    tests$ = new BehaviorSubject([gradeTest, pointsTest]);
    testStateServiceMock.tests$ = tests$;
    testStateServiceMock.filteredTests$ = tests$;
    hasTests$ = new BehaviorSubject(true);
    testStateServiceMock.hasTests$ = hasTests$;
    canSetFinalGrade$ = new BehaviorSubject(true);
    testStateServiceMock.canSetFinalGrade$ = canSetFinalGrade$;
    testStateServiceMock.filter$ = of(INITIAL_TESTS_FILTER);
    testStateServiceMock.expandedHeader$ = of(false);

    const gradingOptions = [
      { Key: 1001, Value: "1.0" },
      { Key: 1002, Value: "2.0" },
      { Key: 1003, Value: "3.0" },
      { Key: 1004, Value: "4.0" },
      { Key: 1005, Value: "5.0" },
      { Key: 1006, Value: "6.0" },
    ];
    testStateServiceMock.gradingOptionsForCourse$.and.returnValue(
      of(gradingOptions),
    );
    testStateServiceMock.gradingOptionsForTest$.and.returnValue(
      of(gradingOptions),
    );

    const student = buildStudent(100);
    studentGrades = [
      {
        student,
        finalGrade: {
          gradingId: 10000,
          average: 5.33,
          gradeId: 1005,
          canGrade: true,
        },
        grades: [
          {
            kind: "grade",
            result: gradeResult,
            test: gradeTest,
          },
          {
            kind: "grade",
            result: pointsResult,
            test: pointsTest,
          },
        ],
      },
    ];
    testStateServiceMock.studentGrades$ = of(studentGrades);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsTableComponent],
        providers: [
          {
            provide: TestStateService,
            useValue: testStateServiceMock,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsTableComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("gradings & final grades", () => {
    describe("with grading that has grade but without final grade", () => {
      beforeEach(async () => {
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it("renders editable final grade select with grade value from grading", () => {
        const finalGradeSelect = queryFinalGradeSelect();
        expect(getSelectValue(finalGradeSelect)).toBe("5.0");
        expect(finalGradeSelect.disabled).toBe(false);
      });

      it("renders average from grading", () => {
        const average = queryStudentAverage();
        expect(average?.textContent?.trim()).toBe("5.33");
      });

      it("renders editable grade grading test result", () => {
        const gradeTestSelect = queryGradeTestSelect();
        expect(gradeTestSelect).not.toBeNull();
        expect(getSelectValue(gradeTestSelect!)).toBe("5.0");
        expect(gradeTestSelect?.disabled).toBe(false);
      });

      it("renders editable points grading test result", () => {
        const pointsTestInput = queryPointsTestInput();
        expect(pointsTestInput).not.toBeNull();
        expect(pointsTestInput?.disabled).toBe(false);

        const pointsTestSelect = queryPointsTestSelect();
        expect(pointsTestSelect).not.toBeNull();
        expect(getSelectValue(pointsTestSelect!)).toBe("5.0");
        expect(pointsTestSelect?.disabled).toBe(true);
      });
    });

    describe("with grading that has no grade but without final grade", () => {
      beforeEach(async () => {
        studentGrades[0].finalGrade.gradeId = undefined;
        testStateServiceMock.studentGrades$ = of(studentGrades);
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it("renders editable final grade select without value selected", () => {
        const finalGradeSelect = queryFinalGradeSelect();
        expect(getSelectValue(finalGradeSelect)).toBe("");
        expect(finalGradeSelect.disabled).toBe(false);
      });

      it("renders average from grading", () => {
        const average = queryStudentAverage();
        expect(average?.textContent?.trim()).toBe("5.33");
      });

      it("renders editable grade grading test result", () => {
        const gradeTestSelect = queryGradeTestSelect();
        expect(gradeTestSelect).not.toBeNull();
        expect(getSelectValue(gradeTestSelect!)).toBe("5.0");
        expect(gradeTestSelect?.disabled).toBe(false);
      });

      it("renders editable points grading test result", () => {
        const pointsTestInput = queryPointsTestInput();
        expect(pointsTestInput).not.toBeNull();
        expect(pointsTestInput?.disabled).toBe(false);

        const pointsTestSelect = queryPointsTestSelect();
        expect(pointsTestSelect).not.toBeNull();
        expect(getSelectValue(pointsTestSelect!)).toBe("5.0");
        expect(pointsTestSelect?.disabled).toBe(true);
      });
    });

    describe("with final grading but without grading", () => {
      beforeEach(async () => {
        studentGrades[0].finalGrade.gradingId = undefined;
        studentGrades[0].finalGrade.gradeId = undefined;
        studentGrades[0].finalGrade.finalGradeValue = "5.4";
        studentGrades[0].finalGrade.canGrade = false;

        testStateServiceMock.studentGrades$ = of(studentGrades);
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it("renders non-editable final grade static value (no select) with grade value from final grade", () => {
        const finalGradeSelect = queryFinalGradeSelect();
        expect(finalGradeSelect).toBeNull();

        const finalGradeCell = element.querySelector(
          "td.student-grade:not(:last-child)",
        );
        expect(finalGradeCell?.textContent?.trim()).toBe("5.4");
      });

      it("renders average from final grade", () => {
        const average = queryStudentAverage();
        expect(average?.textContent?.trim()).toBe("5.33");
      });

      it("renders non-editable grade grading test result", () => {
        const gradeTestSelect = queryGradeTestSelect();
        expect(gradeTestSelect).not.toBeNull();
        expect(getSelectValue(gradeTestSelect!)).toBe("5.0");
        expect(gradeTestSelect?.disabled).toBe(true);
      });

      it("renders non-editable points grading test result", () => {
        const pointsTestInput = queryPointsTestInput();
        expect(pointsTestInput).not.toBeNull();
        expect(pointsTestInput?.disabled).toBe(true);

        const pointsTestSelect = queryPointsTestSelect();
        expect(pointsTestSelect).not.toBeNull();
        expect(getSelectValue(pointsTestSelect!)).toBe("5.0");
        expect(pointsTestSelect?.disabled).toBe(true);
      });
    });
  });

  describe("set average as final grade button", () => {
    describe("can set final grade", () => {
      beforeEach(() => {
        canSetFinalGrade$.next(true);
      });

      it("is present", () => {
        fixture.detectChanges();
        const button = getAverageFinalGradeButton();
        expect(button).toBeTruthy();
      });

      it("is visible on mobile if no test is selected and tests are available", () => {
        component.selectedTest = undefined;
        fixture.detectChanges();

        const button = getAverageFinalGradeButton();
        expect(button).toBeTruthy();
        expect(button?.classList?.contains("visible-on-mobile")).toBe(true);
      });

      it("is visible on mobile if no test is selected and no tests are available", () => {
        component.selectedTest = undefined;
        tests$.next([]);
        hasTests$.next(false);
        fixture.detectChanges();

        const button = getAverageFinalGradeButton();
        expect(button).toBeTruthy();
        expect(button?.classList?.contains("visible-on-mobile")).toBe(true);
      });

      it("is not visible on mobile if test is selected and tests are available", () => {
        fixture.detectChanges();
        component.selectedTest = gradeTest;
        fixture.detectChanges();

        const button = getAverageFinalGradeButton();
        expect(button).toBeTruthy();
        expect(button?.classList?.contains("visible-on-mobile")).toBe(false);
      });
    });

    describe("cannot set final grade", () => {
      beforeEach(() => {
        canSetFinalGrade$.next(false);
      });

      it("is absent", () => {
        fixture.detectChanges();
        const button = getAverageFinalGradeButton();
        expect(button).toBeNull();
      });
    });
  });

  function queryFinalGradeSelect(): HTMLSelectElement {
    return element.querySelector(
      "td.student-grade:not(:last-child) [data-testid='grade-select'] select",
    ) as HTMLSelectElement;
  }

  function getSelectValue(select: HTMLSelectElement): Option<string> {
    return select.selectedOptions[0].text;
  }

  function queryStudentAverage(): Option<HTMLElement> {
    return element.querySelector("tr:not(:last-child) td.student-average");
  }

  function queryGradeTestSelect(): Option<HTMLSelectElement> {
    return queryGradeTestCell()?.querySelector("select") ?? null;
  }

  function queryGradeTestCell(): Option<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(
      "tr:not(:last-child) td.test-grade",
    )[0];
  }

  function queryPointsTestInput(): Option<HTMLInputElement> {
    return queryPointsTestCell()?.querySelector("input") ?? null;
  }
  function queryPointsTestSelect(): Option<HTMLSelectElement> {
    return queryPointsTestCell()?.querySelector("select") ?? null;
  }

  function queryPointsTestCell(): Option<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(
      "tr:not(:last-child) td.test-grade",
    )[1];
  }

  function getAverageFinalGradeButton() {
    return element.querySelector('[data-testid="apply-average-button"]');
  }
});
