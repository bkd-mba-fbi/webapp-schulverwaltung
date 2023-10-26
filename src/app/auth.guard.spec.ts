import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Component } from "@angular/core";
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { authGuard } from "./auth.guard";
import { AuthService } from "./shared/services/auth.service";
import { buildTestModuleMetadata } from "src/spec-helpers";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("authGuard", () => {
  let router: Router;
  let authServiceMock: AuthService;
  let activatedRouteSnapshotMock: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let routerStateSnapshotMock: jasmine.SpyObj<RouterStateSnapshot>;

  @Component({
    template: "",
  })
  class DummyComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [
          RouterTestingModule.withRoutes([
            { path: "unauthenticated", component: DummyComponent },
          ]),
        ],
        providers: [
          {
            provide: AuthService,
            useValue: {
              isAuthenticated: true,
              accessToken: "abcdefghijklmnopqrstuvwxyz",
            },
          },
        ],
        declarations: [DummyComponent],
      }),
    );
    router = TestBed.inject(Router);
    authServiceMock = TestBed.inject(AuthService);

    activatedRouteSnapshotMock = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      "ActivatedRouteSnapshot",
      ["toString"],
    );
    routerStateSnapshotMock = jasmine.createSpyObj<RouterStateSnapshot>(
      "RouterStateSnapshot",
      ["toString"],
    );
  });

  describe("authenticated", () => {
    it("allows to activate", fakeAsync(() => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard()(activatedRouteSnapshotMock, routerStateSnapshotMock),
      );
      expect(result).toBe(true);
      tick();
      expect(router.url).not.toBe("/unauthenticated");
    }));
  });

  describe("unauthenticated", () => {
    beforeEach(() => {
      (authServiceMock as any).isAuthenticated = false;
      (authServiceMock as any).accessToken = null;
    });

    it("does not allow to activate and redirects to /unauthenticated", fakeAsync(() => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard()(activatedRouteSnapshotMock, routerStateSnapshotMock),
      );
      expect(result).toBe(false);
      tick();
      expect(router.url).toBe("/unauthenticated");
    }));
  });
});
