import { HttpClient } from "@angular/common/http";
import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AuthService } from "./shared/services/auth.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("RestAuthInterceptor", () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let authServiceMock: AuthService;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata());

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService);

    successCallback = jasmine.createSpy("success");
    errorCallback = jasmine.createSpy("error");
  });

  describe(".intercept", () => {
    describe("authenticated", () => {
      afterEach(() => {
        httpTestingController.verify();
      });
      it("adds CLX-Authorization header to request for API requests", () => {
        http
          .get("https://eventotest.api/foo")
          .subscribe({ next: successCallback, error: errorCallback });
        httpTestingController
          .expectOne(
            (req) =>
              req.url === "https://eventotest.api/foo" &&
              req.headers.get("CLX-Authorization") ===
                "token_type=urn:ietf:params:oauth:token-type:jwt-bearer, access_token=abcdefghijklmnopqrstuvwxyz",
          )
          .flush("hello", { status: 200, statusText: "Success" });

        expect(successCallback).toHaveBeenCalledWith("hello");
        expect(errorCallback).not.toHaveBeenCalled();
      });

      it("does not add CLX-Authorization header to request for non-API requests", () => {
        http
          .get("http://example.com")
          .subscribe({ next: successCallback, error: errorCallback });
        httpTestingController
          .expectOne(
            (req) =>
              req.url === "http://example.com" &&
              !req.headers.has("CLX-Authorization"),
          )
          .flush("hello", { status: 200, statusText: "Success" });

        expect(successCallback).toHaveBeenCalledWith("hello");
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });

    describe("unauthenticated", () => {
      beforeEach(() => {
        (authServiceMock as any).isAuthenticated = false;
        (authServiceMock as any).accessToken = null;
      });

      afterEach(() => {
        httpTestingController.verify();
        (authServiceMock as any).isAuthenticated = true;
        (authServiceMock as any).accessToken = "abcdefghijklmnopqrstuvwxyz";
      });

      it("does not add CLX-Authorization header to request", () => {
        http
          .get("https://eventotest.api/foo")
          .subscribe({ next: successCallback, error: errorCallback });
        httpTestingController
          .expectOne(
            (req) =>
              req.url === "https://eventotest.api/foo" &&
              !req.headers.has("CLX-Authorization"),
          )
          .flush("hello", { status: 200, statusText: "Success" });

        expect(successCallback).toHaveBeenCalledWith("hello");
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });
  });
});
