import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FinalGrading } from "src/app/shared/models/course.model";
import { buildGradingScale } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierGradesCourseHeaderComponent } from "./dossier-grades-course-header.component";

describe("DossierGradesCourseHeaderComponent", () => {
  let component: DossierGradesCourseHeaderComponent;
  let fixture: ComponentFixture<DossierGradesCourseHeaderComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierGradesCourseHeaderComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesCourseHeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should show designation", () => {
    component.designation = "course 1";
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 1",
    );
  });

  it("should show designation and grade", () => {
    component.designation = "course 2";
    component.finalGrade = { Grade: "5.5" } as unknown as FinalGrading;
    component.gradingScale = buildGradingScale(1, [
      { Id: 1, Designation: "5.5", Value: 5.5, Sort: "10", Sufficient: true },
    ]);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 2 (5.5)",
    );
  });

  it("should show designation and average", () => {
    component.designation = "course 3";
    component.average = 5.2555;
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 3 (5.256)",
    );
  });

  it("should show designation and only grade if both average and grade are set", () => {
    component.designation = "course 4";
    component.average = 5.2555;
    component.finalGrade = { Grade: "5.5" } as unknown as FinalGrading;
    component.gradingScale = buildGradingScale(1, [
      { Id: 1, Designation: "5.5", Value: 5.5, Sort: "10", Sufficient: true },
    ]);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 4 (5.5)",
    );
  });

  it("should only show designation if average is 0", () => {
    component.designation = "course 5";
    component.average = 0;

    fixture.detectChanges();
    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 5",
    );
  });
});
