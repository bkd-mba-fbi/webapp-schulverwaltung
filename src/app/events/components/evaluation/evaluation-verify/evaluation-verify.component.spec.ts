import { WritableSignal, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { ReportsService } from "src/app/shared/services/reports.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationVerifyComponent } from "./evaluation-verify.component";

describe("EvaluationVerifyComponent", () => {
  let fixture: ComponentFixture<EvaluationVerifyComponent>;
  let element: HTMLElement;
  let stateMock: jasmine.SpyObj<EvaluationStateService>;
  let hasReviewStarted: WritableSignal<boolean>;
  let blobUrl: string;

  beforeEach(async () => {
    hasReviewStarted = signal(false);
    stateMock = jasmine.createSpyObj("EvaluationStateService", ["reload"], {
      loading: signal(false),
      event: signal({
        id: 1,
        designation: "English",
        type: "course",
        studentCount: 10,
        gradingScaleId: null,
        hasReviewOfEvaluationStarted: false,
        hasEvaluationStarted: false,
      }),
      gradingScale: signal(null),
      entries: signal([]),
      hasReviewStarted,
    });

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationVerifyComponent],
        providers: [
          {
            provide: EvaluationStateService,
            useValue: stateMock,
          },
          {
            provide: ReportsService,
            useValue: {
              getEvaluationVerifyReportUrl: () =>
                "https://eventotest.api/reports/evaluation-verify",
            },
          },
        ],
      }),
    ).compileComponents();

    await mockPdfResponse();

    fixture = TestBed.createComponent(EvaluationVerifyComponent);
    element = fixture.debugElement.nativeElement;
  });

  afterEach(() => {
    URL.revokeObjectURL(blobUrl);
  });

  it("renders verify page with finalize button", () => {
    fixture.detectChanges();
    console.log(element.innerHTML);
    expect(element.textContent).not.toContain("evaluation.review-started");
    expect(getButtonWithText("download")).not.toBeNull();
    expect(getButtonWithText("print")).not.toBeNull();
    expect(getButtonWithText("evaluation.finalise")).not.toBeNull();
    expect(document.querySelector("#evaluation-verify-pdf")).not.toBeNull();
  });

  it("renders message if evaluation is already closed", () => {
    hasReviewStarted.set(true);
    fixture.detectChanges();
    expect(element.textContent).toContain("evaluation.review-started");
    expect(getButtonWithText("download")).toBeNull();
    expect(getButtonWithText("print")).toBeNull();
    expect(getButtonWithText("evaluation.finalise")).toBeNull();
    expect(document.querySelector("#evaluation-verify-pdf")).toBeNull();
  });

  function getButtonWithText(text: string): Option<HTMLButtonElement> {
    const buttons = Array.from(element.querySelectorAll("button"));
    const button = buttons.find((btn) =>
      btn.textContent?.trim().includes(text),
    );
    return button ?? null;
  }

  async function mockPdfResponse(): Promise<void> {
    const dataUri = "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKCg==";
    const blob = await fetch(dataUri).then((res) => res.blob());
    blobUrl = URL.createObjectURL(blob);
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve(
        new Response(blob, {
          status: 200,
          statusText: "OK",
        }),
      ),
    );
  }
});
