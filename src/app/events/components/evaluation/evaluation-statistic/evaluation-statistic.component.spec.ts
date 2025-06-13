import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationStatisticComponent } from "./evaluation-statistic.component";

describe("EvaluationStatisticComponent", () => {
  let component: EvaluationStatisticComponent;
  let fixture: ComponentFixture<EvaluationStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationStatisticComponent],
        providers: [
          {
            provide: EvaluationStateService,
            useFactory() {
              return jasmine.createSpyObj("EvaluationStateService", [
                "event",
                "loading",
              ]);
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });
});
