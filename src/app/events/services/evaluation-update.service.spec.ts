import { provideHttpClient, withFetch } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { SETTINGS } from "../../settings";
import { EvaluationUpdateService } from "./evaluation-update.service";

describe("EvaluationUpdateService", () => {
  let service: EvaluationUpdateService;

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
    service = TestBed.inject(EvaluationUpdateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
