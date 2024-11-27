import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  buildApprenticeshipContract,
  buildLegalRepresentative,
  buildStudent,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentSummary } from "../models/student.model";
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

  describe(".getStudentSummaries", () => {
    it("should request the student summaries for the given ids", () => {
      const studentSummaries: ReadonlyArray<StudentSummary> = [
        buildStudent(54425),
        buildStudent(56200),
      ].map(({ Id, FirstName, LastName, DisplayEmail }) => ({
        Id,
        FirstName,
        LastName,
        DisplayEmail,
      }));

      service.getStudentSummaries([54425, 56200]).subscribe((result) => {
        expect(result).toEqual(studentSummaries);
      });

      httpTestingController
        .expectOne(
          "https://eventotest.api/Students/?filter.Id=;54425,56200&fields=Id,FirstName,LastName,DisplayEmail",
        )
        .flush(studentSummaries);
    });
  });
});
