import { HttpTestingController } from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { isEqual } from "lodash-es";
import { buildUserSettings } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { UserSettings, AccessInfo } from "../models/user-settings.model";
import { UserSettingsRestService } from "./user-settings-rest.service";
import {
  REFETCH_DEBOUNCE_TIME,
  UserSettingsService,
} from "./user-settings.service";

describe("UserSettingsService", () => {
  let service: UserSettingsService;
  let httpTestingController: HttpTestingController;
  let callback: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [UserSettingsRestService],
      }),
    );
    service = TestBed.inject(UserSettingsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    callback = jasmine.createSpy("callback");
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("refetch", () => {
    it("reloads the settings", fakeAsync(() => {
      service.getSetting("foo").subscribe(callback);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([{ Key: "foo", Value: "123" }]);
      expect(callback).toHaveBeenCalledWith("123");

      service.refetch();
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([{ Key: "foo", Value: "456" }]);
      expect(callback).toHaveBeenCalledWith("456");
    }));
  });

  describe("getSetting", () => {
    it("returns setting value for given key", fakeAsync(() => {
      service.getSetting("foo").subscribe(callback);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([{ Key: "foo", Value: "123" }]);
      expect(callback).toHaveBeenCalledWith("123");
    }));

    it("returns null if no setting for given key exists", fakeAsync(() => {
      service.getSetting("foo").subscribe(callback);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([]);
      expect(callback).toHaveBeenCalledWith(null);
    }));

    it("only loads settings once (caching)", fakeAsync(() => {
      const callback2 = jasmine.createSpy("callback2");
      service.getSetting("foo").subscribe(callback);
      service.getSetting("bar").subscribe(callback2);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([
        { Key: "foo", Value: "123" },
        { Key: "bar", Value: "456" },
      ]);
      expect(callback).toHaveBeenCalledWith("123");
      expect(callback2).toHaveBeenCalledWith("456");
    }));
  });

  describe("saveSetting", () => {
    it("stores setting and refetches data", fakeAsync(() => {
      service.getSetting("foo").subscribe(callback);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([{ Key: "foo", Value: "123" }]);
      expect(callback).toHaveBeenCalledWith("123");

      callback.calls.reset();
      service.saveSetting("foo", "456").subscribe();
      tick(REFETCH_DEBOUNCE_TIME);
      expectWriteRequest([{ Key: "foo", Value: "456" }]);
      tick(REFETCH_DEBOUNCE_TIME);
      expectReadRequest([{ Key: "foo", Value: "456" }]);
      expect(callback).toHaveBeenCalledWith("456");
    }));
  });

  describe("getRolesAndPermissions", () => {
    it("returns and array with the user's roles & permissions", () => {
      const accessInfo: AccessInfo = {
        AccessInfo: {
          Roles: ["TeacherRole", "ClassTeacherRole"],
          Permissions: ["PersonRight"],
        },
      };

      service.getRolesAndPermissions().subscribe(callback);

      const url = "https://eventotest.api/UserSettings/?expand=AccessInfo";
      httpTestingController
        .expectOne({ url, method: "GET" })
        .flush(AccessInfo.encode(accessInfo));

      expect(callback).toHaveBeenCalledWith([
        "TeacherRole",
        "ClassTeacherRole",
        "PersonRight",
      ]);
    });
  });

  function expectReadRequest(
    mockResponse: UserSettings["Settings"] = [],
  ): void {
    const url = "https://eventotest.api/UserSettings/Cst";
    httpTestingController
      .expectOne({ url, method: "GET" })
      .flush(UserSettings.encode(buildUserSettings(mockResponse)));
  }

  function expectWriteRequest(
    expectedRequest: UserSettings["Settings"] = [],
  ): void {
    const url = "https://eventotest.api/UserSettings/Cst";
    httpTestingController
      .expectOne(
        (req) =>
          req.url === url &&
          req.method === "PATCH" &&
          isEqual(req.body, buildUserSettings(expectedRequest)),
      )
      .flush("{}");
  }
});
