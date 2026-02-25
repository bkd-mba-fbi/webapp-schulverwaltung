import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationVerifyComponent } from "./evaluation-verify.component";

describe("EvaluationVerifyComponent", () => {
  let component: EvaluationVerifyComponent;
  let fixture: ComponentFixture<EvaluationVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationVerifyComponent],
        providers: [
          {
            provide: EvaluationStateService,
            useFactory() {
              const stateMock = jasmine.createSpyObj("EvaluationStateService", [
                "reload",
              ]);
              stateMock.loading = signal(false);
              stateMock.event = signal(null);
              stateMock.gradingScale = signal(null);
              stateMock.entries = signal([]);
              return stateMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
