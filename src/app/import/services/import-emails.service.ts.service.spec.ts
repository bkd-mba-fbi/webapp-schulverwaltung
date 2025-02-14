import { TestBed } from "@angular/core/testing";
import { ImportEmailsServiceTsService } from "./import-emails.service.ts.service";

describe("ImportEmailsServiceTsService", () => {
  let service: ImportEmailsServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportEmailsServiceTsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
