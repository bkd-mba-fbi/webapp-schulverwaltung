import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentGradesActionsComponent } from "./student-grades-actions.component";

describe("StudentGradesActionsComponent", () => {
  let component: StudentGradesActionsComponent;
  let fixture: ComponentFixture<StudentGradesActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGradesActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentGradesActionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("reports", []);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
