import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { restAuthInterceptor } from "./rest-auth.interceptor";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("restAuthInterceptor", () => {
  let interceptor: HttpInterceptorFn;
  let nextCallback: jasmine.Spy<HttpHandlerFn>;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;
  let accessToken: Option<string>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: AuthService,
            useValue: {
              get accessToken() {
                return accessToken;
              },
            },
          },
        ],
      }),
    );

    nextCallback = jasmine.createSpy("next");
    successCallback = jasmine.createSpy("success");
    errorCallback = jasmine.createSpy("error");

    interceptor = restAuthInterceptor();
  });

  function intercept(url: string) {
    return TestBed.runInInjectionContext(() => {
      nextCallback.and.returnValue(
        of(new HttpResponse({ status: 200, statusText: "Success" })),
      );
      return interceptor(new HttpRequest("GET", url), nextCallback);
    });
  }

  describe("authenticated", () => {
    beforeEach(() => (accessToken = "abcdefghijklmnopqrstuvwxyz"));

    it("adds CLX-Authorization header to request for API requests", () => {
      intercept("https://eventotest.api/foo").subscribe({
        next: successCallback,
        error: errorCallback,
      });
      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(nextCallback).toHaveBeenCalled();

      const req = nextCallback.calls.mostRecent().args[0];
      expect(req.headers.get("CLX-Authorization")).toBe(
        "token_type=urn:ietf:params:oauth:token-type:jwt-bearer, access_token=abcdefghijklmnopqrstuvwxyz",
      );
    });

    it("does not add CLX-Authorization header to request for non-API requests", () => {
      intercept("http://example.com").subscribe({
        next: successCallback,
        error: errorCallback,
      });

      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(nextCallback).toHaveBeenCalled();

      const req = nextCallback.calls.mostRecent().args[0];
      expect(req.headers.has("CLX-Authorization")).toBeFalsy();
    });
  });

  describe("unauthenticated", () => {
    beforeEach(() => (accessToken = null));

    it("does not add CLX-Authorization header to request", () => {
      intercept("https://eventotest.api/foo").subscribe({
        next: successCallback,
        error: errorCallback,
      });

      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(nextCallback).toHaveBeenCalled();

      const req = nextCallback.calls.mostRecent().args[0];
      expect(req.headers.has("CLX-Authorization")).toBeFalsy();
    });
  });
});
