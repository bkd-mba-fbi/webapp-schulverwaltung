import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TokenPayload } from "../models/token-payload.model";
import { NotificationTypesService } from "./notification-types.service";
import { StorageService } from "./storage.service";

describe("NotificationTypesService", () => {
  let service: NotificationTypesService;
  let storageServiceMock: StorageService;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj("StorageService", ["getPayload"]);
    storageServiceMock.getPayload = () =>
      ({ roles: "StudentRole" }) as TokenPayload;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [{ provide: StorageService, useValue: storageServiceMock }],
      }),
    );
    service = TestBed.inject(NotificationTypesService);
  });

  describe("getNotificationTypes", () => {
    it("returns an array of objects with key and text of the notification types for the user's roles", () => {
      const result = service.getNotificationTypes();
      expect(result.map(({ key }) => key)).toEqual([
        "BM2Student",
        "gradePublish",
      ]);
      expect(result[0].text.de.label).toBe("BM2Student label de");
      expect(result[0].text.de.description).toBe("BM2Student description de");
    });
  });
});
