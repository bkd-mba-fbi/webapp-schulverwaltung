import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildCourse } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";

import { TestsHeaderComponent } from "./tests-header.component";
import { ReportsService } from "../../../shared/services/reports.service";

describe("TestsHeaderComponent", () => {
  let component: TestsHeaderComponent;
  let fixture: ComponentFixture<TestsHeaderComponent>;
  let reportsServiceMock: ReportsService;

  const courseId = 123;

  beforeEach(waitForAsync(() => {
    reportsServiceMock = {
      getEventReportUrl: jasmine
        .createSpy("getEventReportUrl")
        .withArgs(courseId)
        .and.returnValue("url"),
    } as unknown as ReportsService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsHeaderComponent],
        providers: [{ provide: ReportsService, useValue: reportsServiceMock }],
      }),
    ).compileComponents();
  }));

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
