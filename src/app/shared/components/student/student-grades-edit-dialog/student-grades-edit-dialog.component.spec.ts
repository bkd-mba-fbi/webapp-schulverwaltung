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
    component.test.set(buildTest(1, 1, []));
    component.gradeId.set(1234);
    component.gradeOptions.set([{ Key: 1234, Value: "4.5" }]);
    component.points.set(0);
    component.studentId.set(4321);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
