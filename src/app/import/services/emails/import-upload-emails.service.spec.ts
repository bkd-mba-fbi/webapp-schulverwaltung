import { TestBed } from "@angular/core/testing";
import { ImportUploadEmailsService } from "./import-upload-emails.service";

describe("ImportUploadEmailsService", () => {
  let service: ImportUploadEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportUploadEmailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
