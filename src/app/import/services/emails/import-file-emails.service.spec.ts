import { TestBed } from "@angular/core/testing";
import { ImportFileEmailsService } from "./import-file-emails.service";

describe("ImportFileEmailsService", () => {
  let service: ImportFileEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportFileEmailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
