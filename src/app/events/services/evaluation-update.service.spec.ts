import { provideHttpClient, withFetch } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { SETTINGS } from "../../settings";
import { EvaluationDefaultGradeUpdateService } from "./evaluation-default-grade-update.service";

describe("EvaluationDefaultGradeUpdateService", () => {
  let service: EvaluationDefaultGradeUpdateService;

  const mockSettings = {
    apiUrl: "http://mock-api",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        { provide: SETTINGS, useValue: mockSettings },
      ],
    });
    service = TestBed.inject(EvaluationDefaultGradeUpdateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
