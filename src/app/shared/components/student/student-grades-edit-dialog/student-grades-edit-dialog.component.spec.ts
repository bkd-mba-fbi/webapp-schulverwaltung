import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentGradesEditDialogComponent } from "./student-grades-edit-dialog.component";

describe("StudentGradesEditDialogComponent", () => {
  let component: StudentGradesEditDialogComponent;
  let fixture: ComponentFixture<StudentGradesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesEditDialogComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("test", buildTest(1, 1, []));
    fixture.componentRef.setInput("gradeId", 1234);
    fixture.componentRef.setInput("gradeOptions", [
      { Key: 1234, Value: "4.5" },
    ]);
    fixture.componentRef.setInput("points", 0);
    fixture.componentRef.setInput("studentId", 4321);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
