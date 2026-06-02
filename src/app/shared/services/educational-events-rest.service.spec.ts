import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DropDownItem } from "../models/drop-down-item.model";
import { EducationalEventsRestService } from "./educational-events-rest.service";

describe("EducationalEventsRestService", () => {
  let service: EducationalEventsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EducationalEventsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("getTypeaheadItems", () => {
    it("returns dropdown items grouped by designation", () => {
      const data = [
        { Id: 1, Designation: "Englisch", Number: "26c" },
        { Id: 2, Designation: "Englisch", Number: "26d" },
        { Id: 3, Designation: "Englisch", Number: "26e" },
        { Id: 4, Designation: "Deutsch", Number: "26c" },
      ];

      let result: ReadonlyArray<DropDownItem> = [];
      service.getTypeaheadItems("sch").subscribe((items) => {
        result = items;
      });

      const url =
        "https://eventotest.api/EducationalEvents/CurrentSemester?fields=Id,Designation,Number&filter.Designation=~*sch*";
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);

      expect(result).toEqual([
        { Key: "4", Value: "Deutsch" },
        { Key: "1;2;3", Value: "Englisch" },
      ]);
    });
  });
});
