import { HttpClient } from "@angular/common/http";
import { HttpTestingController } from "@angular/common/http/testing";
import { Injectable, inject as inject_1 } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts";
import { SETTINGS, Settings } from "src/app/settings";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DecodeError } from "../utils/decode";
import { RestService } from "./rest.service";

describe("RestService", () => {
  let service: FooService;
  let httpTestingController: HttpTestingController;
  const Foo = t.type({
    foo: t.string,
  });

  @Injectable()
  class FooService extends RestService<typeof Foo> {
    constructor() {
      const http = inject_1(HttpClient);
      const settings = inject_1<Settings>(SETTINGS);

      super(http, settings, Foo, "Foo");
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [FooService],
      }),
    );
    service = TestBed.inject(FooService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe(".get", () => {
    it("requests single instance with given id", () => {
      service.get(123).subscribe((result) => {
        expect(result).toEqual({ foo: "bar" });
      });

      httpTestingController
        .expectOne("https://eventotest.api/Foo/123")
        .flush({ foo: "bar" });
    });

    it("throws an error if JSON from server is not compliant", () => {
      const success = jasmine.createSpy("success");
      const error = jasmine.createSpy("error");
      service.get(123).subscribe({ next: success, error });

      httpTestingController
        .expectOne("https://eventotest.api/Foo/123")
        .flush({ foo: 123 });

      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();

      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          "Invalid value 123 supplied to : { foo: string }/foo: string",
        ),
      );
    });
  });

  describe(".getList", () => {
    it("requests multiple instances", () => {
      service.getList().subscribe((result) => {
        expect(result).toEqual([{ foo: "bar" }, { foo: "baz" }]);
      });

      httpTestingController
        .expectOne("https://eventotest.api/Foo/")
        .flush([{ foo: "bar" }, { foo: "baz" }]);
    });

    it("throws an error if JSON from server is not compliant", () => {
      const success = jasmine.createSpy("success");
      const error = jasmine.createSpy("error");
      service.getList().subscribe({ next: success, error });

      httpTestingController
        .expectOne("https://eventotest.api/Foo/")
        .flush([{ foo: 123 }, { foo: "baz" }]);

      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();

      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          "Invalid value 123 supplied to : Array<{ foo: string }>/0: { foo: string }/foo: string",
        ),
      );
    });
  });
});
