import { provideHttpClient, withFetch } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SETTINGS } from "../../../../settings";
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

  const mockSettings = {
    apiUrl: "http://mock-api",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EvaluationDefaultGradeDialogComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        NgbActiveModal,
        provideHttpClient(withFetch()),
        { provide: SETTINGS, useValue: mockSettings },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationDefaultGradeDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("gradingScale", mockGradingScale);
    fixture.componentRef.setInput("event", { id: 1, type: "course" });
    fixture.componentRef.setInput("gradingItems", []);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
