import { TestBed } from "@angular/core/testing";
import { ImportParseEmailsService } from "./import-parse-emails.service";

describe("ImportParseEmailsService", () => {
  let service: ImportParseEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportParseEmailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
