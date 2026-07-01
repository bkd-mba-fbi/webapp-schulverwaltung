import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildCourse } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ReportsService } from "../../../../shared/services/reports.service";
import { TestsHeaderComponent } from "./tests-header.component";

describe("TestsHeaderComponent", () => {
  let component: TestsHeaderComponent;
  let fixture: ComponentFixture<TestsHeaderComponent>;
  let reportsServiceMock: ReportsService;
  let courseId: number;

  beforeEach(async () => {
    courseId = 123;
    reportsServiceMock = {
      getCourseTestsReports: jasmine
        .createSpy("getCourseTestsReports")
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
    fixture.componentRef.setInput("course", buildCourse(courseId));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
