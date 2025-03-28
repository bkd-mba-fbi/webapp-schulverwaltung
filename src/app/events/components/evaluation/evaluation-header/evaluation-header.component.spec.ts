import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ReportsService } from "src/app/shared/services/reports.service";
import { buildEvent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationHeaderComponent } from "./evaluation-header.component";

describe("EvaluationHeaderComponent", () => {
  let component: EvaluationHeaderComponent;
  let fixture: ComponentFixture<EvaluationHeaderComponent>;
  let reportsServiceMock: jasmine.SpyObj<ReportsService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationHeaderComponent],
        providers: [
          {
            provide: ReportsService,
            useFactory() {
              reportsServiceMock = jasmine.createSpyObj("ReportsService", [
                "getEvaluationReports",
              ]);

              reportsServiceMock.getEvaluationReports
                .withArgs(1)
                .and.returnValue(
                  of([{ type: "crystal", id: 290045, title: "", url: "" }]),
                );

              return reportsServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("event", buildEvent(1));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
