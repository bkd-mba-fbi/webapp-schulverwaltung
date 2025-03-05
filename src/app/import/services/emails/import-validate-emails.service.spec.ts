import { TestBed } from "@angular/core/testing";
import { ImportValidateEmailsService } from "./import-validate-emails.service";

describe("ImportValidateEmailsService", () => {
  let service: ImportValidateEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidateEmailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
