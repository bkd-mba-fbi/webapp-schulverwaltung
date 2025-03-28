import { DebugElement } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { TestStateService } from "src/app/events/services/test-state.service";
import { GradeKind, NoResult } from "src/app/shared/models/student-grades";
import { Student } from "src/app/shared/models/student.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { buildResult, buildStudent, buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradeComponent } from "./grade.component";

describe("GradeComponent", () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;
  let debugElement: DebugElement;

  let mockTestService: jasmine.SpyObj<TestStateService>;
  let result: Result;
  let test: Test;
  let student: Student;

  beforeEach(() => {
    result = buildResult(120, 140);
    test = buildTest(100, 120, [buildResult(120, 140)]);
    student = buildStudent(5);
    mockTestService = jasmine.createSpyObj("TestStateService", [
      "optimisticallyUpdateGrade",
      "saveGrade",
    ]);
    mockTestService.optimisticallyUpdateGrade.and.returnValue(
      of(test.Results![0]),
    );

    void TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [GradeComponent],
        providers: [{ provide: TestStateService, useValue: mockTestService }],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
    component.student = student;
    debugElement = fixture.debugElement;

    component.gradeOptions = [
      { Key: 1, Value: "1.0" },
      { Key: 2, Value: "2.0" },
      { Key: 3, Value: "3.0" },
      { Key: 4, Value: "4.0" },
      { Key: 5, Value: "5.0" },
      { Key: 6, Value: "6.0" },
    ];
  });

  describe("grade grading test", () => {
    let grade: GradeKind;

    beforeEach(() => {
      grade = {
        kind: "grade",
        result,
        test,
      };
      grade.test.IsPointGrading = false;
      grade.result.Points = null;
      grade.result.GradeId = 4;
    });

    it("renders grade select with grading options and grade selected", async () => {
      component.grade = grade;
      fixture.detectChanges();

      const select = await queryGradeSelect();
      expect(select).not.toBeNull();
      expect(select!.options.length).toBe(7);
      expect(select!.options[0].textContent?.trim()).toBe("");
      expect(select!.options[1].textContent?.trim()).toBe("1.0");
      expect(select!.options[2].textContent?.trim()).toBe("2.0");
      expect(select!.options[3].textContent?.trim()).toBe("3.0");
      expect(select!.options[4].textContent?.trim()).toBe("4.0");
      expect(select!.options[5].textContent?.trim()).toBe("5.0");
      expect(select!.options[6].textContent?.trim()).toBe("6.0");
      expect(select!.selectedIndex).toBe(4);
    });

    it("renders grade select with grading options and no value selected for a 'no-result' grade", async () => {
      const noResult: NoResult = {
        kind: "no-result",
        test,
      };
      component.grade = noResult;
      fixture.detectChanges();

      const select = await queryGradeSelect();
      expect(select).not.toBeNull();
      expect(select!.options.length).toBe(7);
      expect(select!.options[0].textContent?.trim()).toBe("");
      expect(select!.options[1].textContent?.trim()).toBe("1.0");
      expect(select!.options[2].textContent?.trim()).toBe("2.0");
      expect(select!.options[3].textContent?.trim()).toBe("3.0");
      expect(select!.options[4].textContent?.trim()).toBe("4.0");
      expect(select!.options[5].textContent?.trim()).toBe("5.0");
      expect(select!.options[6].textContent?.trim()).toBe("6.0");
      expect(select!.selectedIndex).toBe(0);
    });

    it("does not render points input", async () => {
      component.grade = grade;
      fixture.detectChanges();

      const input = await queryPointsInput();
      expect(input).toBeNull();
    });

    it("saves grade on change", fakeAsync(async () => {
      component.grade = grade;
      component.ngOnInit();
      fixture.detectChanges();

      tick(1250);
      expect(mockTestService.optimisticallyUpdateGrade).not.toHaveBeenCalled();
      expect(mockTestService.saveGrade).not.toHaveBeenCalled();

      const select = await queryGradeSelect();
      expect(select).not.toBeNull();
      select!.selectedIndex = 3;
      select!.dispatchEvent(new Event("change"));
      fixture.detectChanges();
      expect(mockTestService.optimisticallyUpdateGrade).toHaveBeenCalled();
      expect(mockTestService.saveGrade).not.toHaveBeenCalled();

      tick(1250);
      expect(mockTestService.saveGrade).toHaveBeenCalled();
      const args = mockTestService.saveGrade.calls.mostRecent().args[0];
      expect("gradeId" in args && args.gradeId).toBe(3);
    }));

    describe("grade select disabled state", () => {
      beforeEach(() => {
        component.grade = grade;
      });

      it("is enabled for non-published test without final grade", async () => {
        grade.test.IsPublished = false;
        component.hasFinalGrade = false;
        fixture.detectChanges();

        const select = await queryGradeSelect();
        expect(select?.disabled).toBe(false);
      });

      it("is disabled for published test without final grade", async () => {
        grade.test.IsPublished = true;
        component.hasFinalGrade = false;
        fixture.detectChanges();

        const select = await queryGradeSelect();
        expect(select?.disabled).toBe(true);
      });

      it("is disabled for non-published test with final grade", async () => {
        grade.test.IsPublished = false;
        component.hasFinalGrade = true;
        fixture.detectChanges();

        const select = await queryGradeSelect();
        expect(select?.disabled).toBe(true);
      });

      it("is disabled for published test with final grade", async () => {
        grade.test.IsPublished = true;
        component.hasFinalGrade = true;
        fixture.detectChanges();

        const select = await queryGradeSelect();
        expect(select?.disabled).toBe(true);
      });
    });
  });

  describe("points grading test", () => {
    let grade: GradeKind;

    beforeEach(() => {
      grade = {
        kind: "grade",
        result,
        test,
      };
      test.IsPointGrading = true;
    });

    it("renders points input with empty value for 'no-result' grade", async () => {
      const noResult: NoResult = {
        kind: "no-result",
        test,
      };
      component.grade = noResult;
      fixture.detectChanges();

      const input = await queryPointsInput();
      expect(input?.value).toBe("");
    });

    it("renders points input with points value from result", async () => {
      grade.result.Points = 11;
      component.grade = grade;
      fixture.detectChanges();

      const input = await queryPointsInput();
      expect(input?.value).toBe("11");
    });

    it("saves points on change", fakeAsync(async () => {
      grade.result.Points = 11;
      component.grade = grade;
      component.ngOnInit();
      fixture.detectChanges();

      tick(1250);
      expect(mockTestService.optimisticallyUpdateGrade).not.toHaveBeenCalled();
      expect(mockTestService.saveGrade).not.toHaveBeenCalled();

      const input = await queryPointsInput();
      expect(input).not.toBeNull();
      input!.value = "13";
      input!.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      expect(mockTestService.optimisticallyUpdateGrade).toHaveBeenCalled();
      expect(mockTestService.saveGrade).not.toHaveBeenCalled();

      tick(1250);
      expect(mockTestService.saveGrade).toHaveBeenCalled();
      const args = mockTestService.saveGrade.calls.mostRecent().args[0];
      expect("points" in args && args.points).toBe(13);
    }));

    describe("points input disabled state", () => {
      beforeEach(() => {
        component.grade = grade;
      });

      it("is enabled for non-published test without final grade", async () => {
        grade.test.IsPublished = false;
        component.hasFinalGrade = false;
        fixture.detectChanges();

        const input = await queryPointsInput();
        expect(input?.disabled).toBe(false);
      });

      it("is disabled for published test without final grade", async () => {
        grade.test.IsPublished = true;
        component.hasFinalGrade = false;
        fixture.detectChanges();

        const input = await queryPointsInput();
        expect(input?.disabled).toBe(true);
      });

      it("is disabled for non-published test with final grade", async () => {
        grade.test.IsPublished = false;
        component.hasFinalGrade = true;
        fixture.detectChanges();

        const input = await queryPointsInput();
        expect(input?.disabled).toBe(true);
      });

      it("is disabled for published test with final grade", async () => {
        grade.test.IsPublished = true;
        component.hasFinalGrade = true;
        fixture.detectChanges();

        const input = await queryPointsInput();
        expect(input?.disabled).toBe(true);
      });
    });

    describe("grade select disabled state", () => {
      beforeEach(() => {
        component.grade = grade;
      });

      describe("with points defined", () => {
        beforeEach(() => {
          grade.result.Points = null;
        });

        it("is enabled for non-published test without final grade", async () => {
          grade.test.IsPublished = false;
          component.hasFinalGrade = false;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(false);
        });

        it("is disabled for published test without final grade", async () => {
          grade.test.IsPublished = true;
          component.hasFinalGrade = false;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });

        it("is disabled for non-published test with final grade", async () => {
          grade.test.IsPublished = false;
          component.hasFinalGrade = true;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });

        it("is disabled for published test with final grade", async () => {
          grade.test.IsPublished = true;
          component.hasFinalGrade = true;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });
      });

      describe("without points defined", () => {
        beforeEach(() => {
          grade.result.Points = 1;
        });

        it("is disabled for non-published test without final grade", async () => {
          grade.test.IsPublished = false;
          component.hasFinalGrade = false;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });

        it("is disabled for published test without final grade", async () => {
          grade.test.IsPublished = true;
          component.hasFinalGrade = false;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });

        it("is disabled for non-published test with final grade", async () => {
          grade.test.IsPublished = false;
          component.hasFinalGrade = true;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });

        it("is disabled for published test with final grade", async () => {
          grade.test.IsPublished = true;
          component.hasFinalGrade = true;
          fixture.detectChanges();

          const select = await queryGradeSelect();
          expect(select?.disabled).toBe(true);
        });
      });
    });
  });

  async function queryGradeSelect(): Promise<Option<HTMLSelectElement>> {
    return query("select");
  }

  async function queryPointsInput(): Promise<Option<HTMLInputElement>> {
    return query("input");
  }

  async function query<T>(selector: string): Promise<Option<T>> {
    await fixture.whenStable();
    return debugElement.query(By.css(selector))?.nativeElement ?? null;
  }
});
