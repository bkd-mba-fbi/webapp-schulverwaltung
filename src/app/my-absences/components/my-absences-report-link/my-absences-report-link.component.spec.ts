import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyAbsencesReportLinkComponent } from "../my-absences-report-link/my-absences-report-link.component";

describe("MyAbsencesEditLinkComponent", () => {
  let component: MyAbsencesReportLinkComponent;
  let fixture: ComponentFixture<MyAbsencesReportLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata(
        buildTestModuleMetadata({
          imports: [MyAbsencesReportLinkComponent],
        }),
      ),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
