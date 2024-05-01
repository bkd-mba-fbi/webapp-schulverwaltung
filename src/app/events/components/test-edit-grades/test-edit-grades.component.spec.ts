import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { Test } from "src/app/shared/models/test.model";
import { buildCourse, buildResult, buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  INITIAL_TESTS_FILTER,
  TestStateService,
} from "../../services/test-state.service";
import { TestEditGradesComponent } from "./test-edit-grades.component";

describe("TestEditGradesComponent", () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;
  let element: HTMLElement;

  let test: Test;
  let testStateServiceMock: jasmine.SpyObj<TestStateService>;

  let tests$: BehaviorSubject<Test[]>;
  let hasTests$: BehaviorSubject<boolean>;
  let canSetFinalGrade$: BehaviorSubject<boolean>;

  beforeEach(waitForAsync(() => {
    test = buildTest(1234, 12, [buildResult(12, 1)]);
    testStateServiceMock = jasmine.createSpyObj("TestStateService", [
      "canSetFinalGrade$",
      "setSorting",
      "getSortingChar$",
      "course$",
    ]);

    testStateServiceMock.course$ = of(buildCourse(1234));
    tests$ = new BehaviorSubject([test]);
    testStateServiceMock.tests$ = tests$;
    hasTests$ = new BehaviorSubject(true);
    testStateServiceMock.hasTests$ = hasTests$;
    canSetFinalGrade$ = new BehaviorSubject(true);
    testStateServiceMock.canSetFinalGrade$ = canSetFinalGrade$;
    testStateServiceMock.filter$ = of(INITIAL_TESTS_FILTER);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestEditGradesComponent],
        providers: [
          {
            provide: TestStateService,
            useValue: testStateServiceMock,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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
        component.selectedTest = test;
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

  function getAverageFinalGradeButton() {
    return element.querySelector('[data-testid="apply-average-button"]');
  }
});
