import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { GradingScale } from "../../../../shared/models/grading-scale.model";
import { EvaluationDialogComponent } from "./evaluation-dialog.component";

describe("EvaluationDialogComponent", () => {
  let component: EvaluationDialogComponent;
  let fixture: ComponentFixture<EvaluationDialogComponent>;

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
      imports: [EvaluationDialogComponent, TranslateModule.forRoot()],
      providers: [NgbActiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("gradingScale", mockGradingScale);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
