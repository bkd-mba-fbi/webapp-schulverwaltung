import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildCourse } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ReportsService } from "../../../shared/services/reports.service";
import { TestsHeaderComponent } from "./tests-header.component";

describe("TestsHeaderComponent", () => {
  let component: TestsHeaderComponent;
  let fixture: ComponentFixture<TestsHeaderComponent>;
  let reportsServiceMock: ReportsService;

  const courseId = 123;

  beforeEach(async () => {
    reportsServiceMock = {
      getCourseReports: jasmine
        .createSpy("getCourseReports")
        .withArgs(courseId)
        .and.returnValue(
          of([{ type: "crystal", id: 290044, title: "", url: "" }]),
        ),
    } as unknown as ReportsService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsHeaderComponent],
        providers: [{ provide: ReportsService, useValue: reportsServiceMock }],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsHeaderComponent);
    component = fixture.componentInstance;
    component.course = buildCourse(123);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
