import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationDialogComponent } from "./evaluation-dialog.component";

describe("EvaluationDialogComponent", () => {
  let component: EvaluationDialogComponent;
  let fixture: ComponentFixture<EvaluationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
