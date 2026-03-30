import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts";
import { buildTimetableEntry } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TimetableEntry } from "../models/timetable-entry.model";
import { TeachersRestService } from "./teachers-rest.service";

describe("TeachersRestService", () => {
  let service: TeachersRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(TeachersRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe(".getTimetableEntries", () => {
    it("requests the timetable entries of a given student", () => {
      const entry1 = buildTimetableEntry(
        1,
        new Date("2000-01-23"),
        new Date("2000-01-24"),
      );
      const entry2 = buildTimetableEntry(
        2,
        new Date("2000-01-23"),
        new Date("2000-01-24"),
      );

      service.getTimetableEntries(39361).subscribe((result) => {
        expect(result).toEqual([entry1, entry2]);
      });

      httpTestingController
        .expectOne(
          "https://eventotest.api/Teachers/39361/TimetableEntries/CurrentSemester?fields=Id,From,To,EventId,EventNumber,EventDesignation,EventLocation,Rooms&expand=Rooms",
        )
        .flush(t.array(TimetableEntry).encode([entry1, entry2]));
    });
  });
});
