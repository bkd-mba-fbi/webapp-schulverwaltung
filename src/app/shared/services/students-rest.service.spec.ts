import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  buildApprenticeshipContract,
  buildLegalRepresentative,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
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
});
