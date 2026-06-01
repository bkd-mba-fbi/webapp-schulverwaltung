import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
import { TestFormValue } from "../tests-edit-form/tests-edit-form.component";
import { TestsAddComponent } from "./tests-add.component";

describe("TestsAddComponent", () => {
  let component: TestsAddComponent;
  let fixture: ComponentFixture<TestsAddComponent>;
  let courseService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    courseService = jasmine.createSpyObj("CoursesRestService", ["add"]);
    courseService.add.and.returnValue(of());

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsAddComponent],
        providers: [
          TestStateService,
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

  it("should save new test", () => {
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
