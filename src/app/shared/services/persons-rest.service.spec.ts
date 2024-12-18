import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts/lib/index";
import { isEqual } from "lodash-es";
import { buildPerson, buildPersonSummary } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { Person, PersonSummary } from "../models/person.model";
import { PersonsRestService } from "./persons-rest.service";

describe("PersonsRestService", () => {
  let service: PersonsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(PersonsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe(".getListForIds", () => {
    it("requests all the persons in the given list of ids", () => {
      const persons = [buildPerson(38608), buildPerson(38610)];

      service.getListForIds([38608, 38610]).subscribe((result) => {
        expect(result).toEqual(persons);
      });

      const url = "https://eventotest.api/Persons/?filter.Id=;38608;38610";
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(t.array(Person).encode(persons));
    });
  });

  describe(".getSummaries", () => {
    it("should request the student summaries for the given ids", () => {
      const personSummaries: ReadonlyArray<PersonSummary> = [
        buildPersonSummary(54425),
        buildPersonSummary(56200),
      ].map(({ Id, FullName, DisplayEmail, Email }) => ({
        Id,
        FullName,
        DisplayEmail,
        Email,
      }));

      service.getSummaries([54425, 56200]).subscribe((result) => {
        expect(result).toEqual(personSummaries);
      });

      httpTestingController
        .expectOne(
          "https://eventotest.api/Persons/?filter.Id=;54425;56200&fields=Id,FullName,DisplayEmail,Email",
        )
        .flush(personSummaries);
    });
  });

  describe(".getMyself", () => {
    it("requests the current user's person", () => {
      const person = buildPerson(38608);

      service.getMyself().subscribe((result) => {
        expect(result).toEqual(person);
      });

      const url = "https://eventotest.api/Persons/me";
      httpTestingController.expectOne(url).flush(Person.encode(person));
    });
  });

  describe(".update", () => {
    it("updates the phone numbers and email", () => {
      service
        .update(
          38608,
          "+41 31 123 45 67",
          "+41 79 123 45 67",
          "john@example.com",
        )
        .subscribe();

      httpTestingController.match(
        (req) =>
          req.method === "PUT" &&
          req.urlWithParams === "https://eventotest.api/Persons/38608" &&
          isEqual(req.body, {
            PhonePrivate: "+41 31 123 45 67",
            PhoneMobile: "+41 79 123 45 67",
            Email2: "john@example.com",
          }),
      );
      expect().nothing();
    });
  });

  describe(".getByIdWithEmailInfos", () => {
    it("returns the given person with only email information fields", () => {
      service.getByIdWithEmailInfos(4515).subscribe();

      httpTestingController.match(
        (req) =>
          req.method === "GET" &&
          req.urlWithParams ===
            "https://eventotest.api/Persons/?filter.Id==4515&fields=FormOfAddress,Email",
      );
      expect().nothing();
    });
  });
});
