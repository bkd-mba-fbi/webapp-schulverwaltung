import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { RestErrorNotificationService } from "./rest-error-notification.service";

describe("RestErrorNotificationService", () => {
  let service: RestErrorNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(RestErrorNotificationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
