import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { GradingScale } from "../../../../shared/models/grading-scale.model";
import { EvaluationDefaultGradeDialogComponent } from "./evaluation-default-grade-dialog.component";

describe("EvaluationDialogComponent", () => {
  let component: EvaluationDefaultGradeDialogComponent;
  let fixture: ComponentFixture<EvaluationDefaultGradeDialogComponent>;

  const mockGradingScale: GradingScale = {
    Id: 1,
    Grades: [
      {
        Id: 1,
        Designation: "1.0",
        Value: 1.0,
        Sort: null,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EvaluationDefaultGradeDialogComponent,
        TranslateModule.forRoot(),
      ],
      providers: [NgbActiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationDefaultGradeDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("gradingScale", mockGradingScale);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
