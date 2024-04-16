import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { restRoleInterceptor } from "./rest-role.interceptor";

describe("restRoleInterceptor", () => {
  let interceptor: HttpInterceptorFn;
  let nextCallback: jasmine.Spy<HttpHandlerFn>;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  const mockRouter = { url: "" };

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [{ provide: Router, useValue: mockRouter }],
      }),
    );

    nextCallback = jasmine.createSpy("next");
    successCallback = jasmine.createSpy("success");
    errorCallback = jasmine.createSpy("error");

    interceptor = restRoleInterceptor();
  });

  function intercept() {
    return TestBed.runInInjectionContext(() => {
      nextCallback.and.returnValue(
        of(new HttpResponse({ status: 200, statusText: "Success" })),
      );
      return interceptor(new HttpRequest("GET", "/"), nextCallback);
    });
  }

  it("should not add header on root module", () => {
    mockRouter.url = "/";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.has("X-Role-Restriction")).toBeFalse();
  });

  it("should add header on presence control module", () => {
    mockRouter.url = "/presence-control";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.get("X-Role-Restriction")).toBe("LessonTeacherRole");
  });

  it("should add header on my absences module", () => {
    mockRouter.url = "/my-absences";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.get("X-Role-Restriction")).toBe("StudentRole");
  });

  it("should add header on open absences module", () => {
    mockRouter.url = "/open-absences";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.get("X-Role-Restriction")).toBe(
      "LessonTeacherRole;ClassTeacherRole",
    );
  });

  it("should add header on edit absences module", () => {
    mockRouter.url = "/edit-absences";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.get("X-Role-Restriction")).toBe(
      "LessonTeacherRole;ClassTeacherRole",
    );
  });

  it("should not add header on evaluate absences module", () => {
    mockRouter.url = "/evaluate-absences";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.has("X-Role-Restriction")).toBeFalse();
  });

  it("should not add header on my profile module", () => {
    mockRouter.url = "/my-profile";
    intercept().subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();

    const req = nextCallback.calls.mostRecent().args[0];
    expect(req.headers.has("X-Role-Restriction")).toBeFalse();
  });
});
