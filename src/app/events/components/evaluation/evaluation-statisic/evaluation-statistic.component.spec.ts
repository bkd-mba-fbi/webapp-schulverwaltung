import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStatisticComponent } from "./evaluation-statistic.component";

describe("EvaluationStatisticComponent", () => {
  let component: EvaluationStatisticComponent;
  let fixture: ComponentFixture<EvaluationStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationStatisticComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
