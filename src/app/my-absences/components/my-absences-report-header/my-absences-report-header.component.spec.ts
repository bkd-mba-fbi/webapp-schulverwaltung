import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyAbsencesReportHeaderComponent } from "./my-absences-report-header.component";

describe("MyAbsencesReportHeaderComponent", () => {
  let component: MyAbsencesReportHeaderComponent;
  let fixture: ComponentFixture<MyAbsencesReportHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyAbsencesReportHeaderComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
