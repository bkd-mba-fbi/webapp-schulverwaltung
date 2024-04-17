import {
  HttpContext,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { ToastService } from "src/app/shared/services/toast.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  RestErrorInterceptorOptions,
  restErrorInterceptor,
} from "./rest-error.interceptor";

describe("restErrorInterceptor", () => {
  let interceptor: HttpInterceptorFn;
  let routerMock: Router;
  let toastServiceMock: ToastService;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);
    toastServiceMock = jasmine.createSpyObj("ToastService", ["error"]);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          { provide: Router, useValue: routerMock },
          {
            provide: ToastService,
            useValue: toastServiceMock,
          },
        ],
      }),
    );

    successCallback = jasmine.createSpy("success");
    errorCallback = jasmine.createSpy("error");

    interceptor = restErrorInterceptor();
  });

  function intercept(
    response: HttpEvent<unknown> | HttpErrorResponse,
    context?: HttpContext,
  ) {
    return TestBed.runInInjectionContext(() => {
      const req = new HttpRequest("GET", "/", { context });
      const next: HttpHandlerFn = (_req) =>
        response instanceof HttpErrorResponse
          ? throwError(() => response)
          : of(response);
      return interceptor(req, next);
    });
  }

  it("does nothing if request is successful", () => {
    intercept(
      new HttpResponse({ body: "hello", status: 200, statusText: "Success" }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectNoToast();
  });

  it("catches unknown error and displays notification", () => {
    intercept(
      new HttpErrorResponse({ status: 0, statusText: "Unknown" }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("unavailable");
  });

  it("catches unauthorized error, displays notification & redirects to /unauthenticated", () => {
    intercept(
      new HttpErrorResponse({
        status: 401,
        statusText: "Unauthorized",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/unauthenticated"]);
    expectToast("noaccess");
  });

  it("catches forbidden error, displays notification & redirects to /dashboard", () => {
    intercept(
      new HttpErrorResponse({ status: 403, statusText: "Forbidden" }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/dashboard"]);
    expectToast("noaccess");
  });

  it("catches not found error and displays notification", () => {
    intercept(
      new HttpErrorResponse({ status: 404, statusText: "Not found" }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("notfound");
  });

  it("catches service unavailable error and displays notification", () => {
    intercept(
      new HttpErrorResponse({
        status: 503,
        statusText: "Service unavailable",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("unavailable");
  });

  it("catches gateway timeout error and displays notification", () => {
    intercept(
      new HttpErrorResponse({
        status: 504,
        statusText: "Gateway timeout",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("unavailable");
  });

  it("catches server error and displays notification", () => {
    intercept(
      new HttpErrorResponse({
        status: 500,
        statusText: "Internal server error",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("server");
  });

  it("catches conflict error without issues body and displays notification", () => {
    intercept(
      new HttpErrorResponse({ status: 409, statusText: "Conflict" }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("conflict");
  });

  it("catches conflict error with issues body and displays notification", () => {
    intercept(
      new HttpErrorResponse({
        error: {
          HasErrors: true,
          HasQuestions: false,
          Issues: [
            {
              ConflictDetail: null,
              ConflictingKey: null,
              ConflictingObject: null,
              ConflictingObjectType: null,
              Id: null,
              Message:
                "Person ist bereits angemeldet: Die Anmeldung kann nicht erstellt werden.",
              MessageId: null,
              MessageType: "Error",
              Property: null,
            },
            {
              ConflictDetail: null,
              ConflictingKey: null,
              ConflictingObject: null,
              ConflictingObjectType: null,
              Id: null,
              Message: "Ein weiteres Problem bla bla.",
              MessageId: null,
              MessageType: "Error",
              Property: null,
            },
          ],
        },
        status: 409,
        statusText: "Conflict",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      "Person ist bereits angemeldet: Die Anmeldung kann nicht erstellt werden.\nEin weiteres Problem bla bla.",
      `global.rest-errors.conflict-title`,
    );
  });

  it("oh lovely, let's have a cup of 🍵, shall we?", () => {
    intercept(
      new HttpErrorResponse({
        status: 418,
        statusText: "I'm a teapot",
      }),
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("server");
  });

  it('allows to disable error handling for "all" codes', () => {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandling: true,
    });
    intercept(
      new HttpErrorResponse({
        status: 502,
        statusText: "Bad Gateway",
      }),
      context,
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectNoToast();
  });

  it("allows to disable error handling for certain status codes", () => {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingForStatus: [403, 404],
    });
    intercept(
      new HttpErrorResponse({ status: 403, statusText: "Forbidden" }),
      context,
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectNoToast();
  });

  it("handles non-skipped errors codes", () => {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingForStatus: [403, 404],
    });
    intercept(
      new HttpErrorResponse({
        status: 500,
        statusText: "Internal server error",
      }),
      context,
    ).subscribe({ next: successCallback, error: errorCallback });

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expectToast("server");
  });

  function expectNoToast(): void {
    expect(toastServiceMock.error).not.toHaveBeenCalled();
  }

  function expectToast(messageKey: string): void {
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      `global.rest-errors.${messageKey}-message`,
      `global.rest-errors.${messageKey}-title`,
    );
  }
});
