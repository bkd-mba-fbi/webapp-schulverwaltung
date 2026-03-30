import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts";
import {
  buildApprenticeshipContract,
  buildLegalRepresentative,
  buildTimetableEntry,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TimetableEntry } from "../models/timetable-entry.model";
import { StudentsRestService } from "./students-rest.service";

describe("StudentsRestService", () => {
  let service: StudentsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(StudentsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe(".getLegalRepresentatives", () => {
    it("should request the legal representatives of a given student", () => {
      service.getLegalRepresentatives(39361).subscribe((result) => {
        expect(result).toEqual([
          buildLegalRepresentative(54425),
          buildLegalRepresentative(56200),
        ]);
      });

      httpTestingController
        .expectOne("https://eventotest.api/Students/39361/LegalRepresentatives")
        .flush([
          buildLegalRepresentative(54425),
          buildLegalRepresentative(56200),
        ]);
    });
  });

  describe(".getCurrentApprenticeshipContracts", () => {
    it("should request the current apprenticeship contracts of a given student", () => {
      service.getCurrentApprenticeshipContracts(39361).subscribe((result) => {
        expect(result).toEqual([
          buildApprenticeshipContract(55905),
          buildApprenticeshipContract(55906),
        ]);
      });

      httpTestingController
        .expectOne(
          "https://eventotest.api/Students/39361/ApprenticeshipContracts/Current",
        )
        .flush([
          buildApprenticeshipContract(55905),
          buildApprenticeshipContract(55906),
        ]);
    });
  });

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
          "https://eventotest.api/Students/39361/TimetableEntries/CurrentSemester?fields=Id,From,To,EventId,EventNumber,EventDesignation,EventLocation,Rooms,EventManagerInformation&expand=Rooms",
        )
        .flush(t.array(TimetableEntry).encode([entry1, entry2]));
    });
  });
});
