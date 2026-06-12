import { ComponentFixture, TestBed } from "@angular/core/testing";
import { firstValueFrom, of } from "rxjs";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
import { TestFormValue } from "../tests-edit-form/tests-edit-form.component";
import { TestsAddComponent } from "./tests-add.component";

describe("TestsAddComponent", () => {
  let component: TestsAddComponent;
  let fixture: ComponentFixture<TestsAddComponent>;
  let stateService: jasmine.SpyObj<TestStateService>;
  let courseService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    stateService = jasmine.createSpyObj("TestStateService", [
      "setCourseId",
      "reload",
    ]);
    stateService.courseId$ = of(1);
    stateService.tests$ = of([
      {
        ...buildTest(1, 10, []),
        IsOwner: true,
        Date: new Date(2001, 0, 23),
        Creation: new Date(2000, 0, 23),
        GradingScaleId: 100,
      },
      {
        ...buildTest(1, 11, []),
        IsOwner: true,
        Date: new Date(2001, 1, 23),
        Creation: new Date(2000, 1, 23),
        GradingScaleId: 101,
      },
      {
        ...buildTest(1, 12, []),
        IsOwner: true,
        Date: new Date(2001, 0, 24),
        Creation: new Date(2000, 0, 24),
        GradingScaleId: 102,
      },
      {
        // Not owner
        ...buildTest(1, 13, []),
        IsOwner: false,
        Date: new Date(2001, 2, 23),
        Creation: new Date(2000, 2, 23),
        GradingScaleId: 103,
      },
    ]);

    courseService = jasmine.createSpyObj("CoursesRestService", ["add"]);
    courseService.add.and.returnValue(of());

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsAddComponent],
        providers: [
          { provide: TestStateService, useValue: stateService },
          { provide: CoursesRestService, useValue: courseService },
        ],
      }),
    ).compileComponents();

    const state = TestBed.inject(TestStateService);
    state.setCourseId(1);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe(".save", () => {
    it("adds new test", () => {
      const value: TestFormValue = {
        designation: "a new test",
        date: new Date(),
        weight: 1,
        isPointGrading: false,
        maxPoints: null,
        maxPointsAdjusted: null,
        gradingScaleId: 100,
      };

      component.save(value);

      expect(courseService.add).toHaveBeenCalledWith({
        courseId: 1,
        date: value.date,
        designation: value.designation,
        weight: value.weight,
        isPointGrading: value.isPointGrading,
        maxPoints: value.maxPoints,
        maxPointsAdjusted: value.maxPointsAdjusted,
        gradingScaleId: 100,
      });
    });
  });

  describe(".defaultGradingScaleId$", () => {
    it("returns the grading scale ID of the newest test owned by the current user", async () => {
      const result = await firstValueFrom(component.defaultGradingScaleId$);
      expect(result).toBe(101);
    });
  });
});
