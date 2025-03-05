import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportUploadService } from "./import-upload-service";

describe("ImportUploadService", () => {
  let service: ImportUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ImportUploadService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
