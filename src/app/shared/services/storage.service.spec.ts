import { TestBed } from "@angular/core/testing";
import { buildPayLoad } from "../../../spec-builders";
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

  describe(".getPayload", () => {
    it("returns payload of login CLX.LoginToken", () => {
      localStoreMock["CLX.LoginToken"] =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbnN0YW5jZV9pZCI6IkdZbVRFU1QiLCJjdWx0dXJlX2luZm8iOiJkZS1DSCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInVzZXJuYW1lIjoidGVzdCIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsImhvbGRlcl9pZCI6IiIsInN1YnN0aXR1dGlvbl9pZCI6bnVsbH0.E0l6LvsLOitm2OKTLEdEZzj9wTn08NOXBMuCJzvO07I";
      const tokenPayload = buildPayLoad();
      expect(service.getPayload()).toEqual(tokenPayload);
    });

    it("returns payload of login CLX.LoginToken with UTF-8 character in fullname", () => {
      localStoreMock["CLX.LoginToken"] =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbnN0YW5jZV9pZCI6IkdZbVRFU1QiLCJjdWx0dXJlX2luZm8iOiJkZS1DSCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IkxlaXR1bmcgQW5hw69zIiwidXNlcm5hbWUiOiJ0ZXN0Iiwicm9sZXMiOiJMZXNzb25UZWFjaGVyUm9sZTtDbGFzc1RlYWNoZXJSb2xlIiwiaG9sZGVyX2lkIjoiIiwic3Vic3RpdHV0aW9uX2lkIjpudWxsfQ.jxhNQtfL3mpF7ck26E1FWV4o6Ta1C-dvAGPZczA_ErQ";
      const tokenPayload = { ...buildPayLoad(), fullname: "Leitung Anaïs" };
      expect(service.getPayload()).toEqual(tokenPayload);
    });

    it("returns payload of login CLX.LoginToken with holder_id if a substitution is active", () => {
      localStoreMock["CLX.LoginToken"] =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbnN0YW5jZV9pZCI6IkdZbVRFU1QiLCJjdWx0dXJlX2luZm8iOiJkZS1DSCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInVzZXJuYW1lIjoidGVzdCIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsImhvbGRlcl9pZCI6IjEyMzQiLCJzdWJzdGl0dXRpb25faWQiOm51bGx9.J1rM7i6e-vz3gUP6DYIBgFkCm_KqY_NaQhBUjph25Rg";
      const tokenPayload = {
        ...buildPayLoad(),
        holder_id: "1234",
        id_person: "1234",
      };
      expect(service.getPayload()).toEqual(tokenPayload);
    });
  });
});
