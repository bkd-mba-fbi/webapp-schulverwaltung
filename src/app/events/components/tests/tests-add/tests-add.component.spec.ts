import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
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
    const formGroupValue = {
      designation: "a new test",
      date: new Date(),
      weight: 1,
      isPointGrading: false,
      maxPoints: undefined,
      maxPointsAdjusted: undefined,
    };

    component.save(formGroupValue);

    expect(courseService.add).toHaveBeenCalledWith(
      1,
      formGroupValue.date,
      formGroupValue.designation,
      formGroupValue.weight,
      formGroupValue.isPointGrading,
      formGroupValue.maxPoints,
      formGroupValue.maxPointsAdjusted,
    );
  });
});
