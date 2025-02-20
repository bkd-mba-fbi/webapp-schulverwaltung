import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportUploadSubscriptionDetailsService } from "./import-upload-subscription-details.service";

describe("ImportUploadSubscriptionDetailsService", () => {
  let service: ImportUploadSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ImportUploadSubscriptionDetailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
