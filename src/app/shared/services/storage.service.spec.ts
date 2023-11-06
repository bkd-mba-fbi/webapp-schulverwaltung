import { TestBed } from "@angular/core/testing";
import { StorageService } from "./storage.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("StorageService", () => {
  let service: StorageService;
  let localStoreMock: any;
  let sessionStoreMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    localStoreMock = {};
    spyOn(localStorage, "getItem").and.callFake(
      (key: string) => localStoreMock[key] || null,
    );
    spyOn(localStorage, "setItem").and.callFake(
      (key: string) => localStoreMock[key] || null,
    );

    sessionStoreMock = {};
    spyOn(sessionStorage, "getItem").and.callFake(
      (key: string) => sessionStoreMock[key] || null,
    );
    spyOn(sessionStorage, "setItem").and.callFake(
      (key: string) => sessionStoreMock[key] || null,
    );
  });

  describe(".getLanguage", () => {
    it("returns null if no value is available", () => {
      expect(service.getLanguage()).toBeNull();
    });

    it("returns value", () => {
      localStoreMock.uiCulture = "de-CH";
      expect(service.getLanguage()).toBe("de-CH");
    });
  });

  describe(".getAccessToken", () => {
    it("returns null if no value is available", () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it("returns value from session storage", () => {
      sessionStoreMock["CLX.LoginToken"] = "asdf";
      expect(service.getAccessToken()).toBe("asdf");
    });

    it("returns value from session storage with local storage value present", () => {
      sessionStoreMock["CLX.LoginToken"] = "asdf";
      localStoreMock["CLX.LoginToken"] = "qwer";
      expect(service.getAccessToken()).toBe("asdf");
    });

    it("returns value from local storage (fallback)", () => {
      sessionStoreMock["CLX.LoginToken"] = "asdf";
      localStoreMock["CLX.LoginToken"] = "qwer";
      expect(service.getAccessToken()).toBe("asdf");
    });

    it("returns value with trailing double quotes removed", () => {
      localStoreMock["CLX.LoginToken"] = '"asdf"';
      expect(service.getAccessToken()).toBe("asdf");
    });
  });

  describe(".getRefreshToken", () => {
    it("returns null if no value is available", () => {
      expect(service.getRefreshToken()).toBeNull();
    });

    it("returns value", () => {
      localStoreMock["CLX.RefreshToken"] = "asdf";
      expect(service.getRefreshToken()).toBe("asdf");
    });
  });

  describe(".getTokenExpire", () => {
    it("returns null if no value is available", () => {
      expect(service.getTokenExpire()).toBeNull();
    });

    it("returns value", () => {
      localStoreMock["CLX.TokenExpire"] = "asdf";
      expect(service.getTokenExpire()).toBe("asdf");
    });
  });
  /*
  describe('.getPayload', () => {
    it('returns payload of login CLX.LoginToken', () => {
      storeMock['CLX.LoginToken'] =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA';
      const tokenPayload = buildPayLoad();
      expect(service.getPayload()).toEqual(tokenPayload);
    });
  });*/
});
