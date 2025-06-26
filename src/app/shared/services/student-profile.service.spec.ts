import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import * as t from "io-ts/lib/index";
import { ApprenticeshipContract } from "src/app/shared/models/apprenticeship-contract.model";
import { LegalRepresentative } from "src/app/shared/models/legal-representative.model";
import { Person } from "src/app/shared/models/person.model";
import { Student } from "src/app/shared/models/student.model";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManagerWithEmails,
  buildJobTrainerWithEmails,
  buildLegalRepresentative,
  buildPerson,
  buildPersonWithEmails,
  buildStudent,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentProfileService } from "../../shared/services/student-profile.service";
import { ApprenticeshipManager } from "../models/apprenticeship-manager.model";
import { DropDownItem } from "../models/drop-down-item.model";
import { JobTrainer } from "../models/job-trainer.model";
import { StorageService } from "./storage.service";

describe("StudentProfileService", () => {
  let httpTestingController: HttpTestingController;
  let service: StudentProfileService;

  let student: Student;
  let myself: Person;
  let legalRepresentatives: LegalRepresentative[];
  let apprenticeshipContract: ApprenticeshipContract;
  let jobTrainer: JobTrainer;
  let apprenticeshipManager: ApprenticeshipManager;
  let legalRepresentative1: Person;
  let legalRepresentative2: Person;
  let persons: Person[];
  let dropDownItems: DropDownItem[];
  let roles: string;

  beforeEach(() => {
    roles = "StudentRole";

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload: () => ({
                roles,
              }),
            },
          },
        ],
      }),
    );
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StudentProfileService);

    student = buildStudent(39405);
    student.Birthdate = new Date(new Date().getFullYear() - 10, 0, 1);

    myself = buildPerson(39405);
    myself.Birthdate = new Date(new Date().getFullYear() - 10, 0, 1);
    myself.StayPermit = 123456798;

    legalRepresentatives = [
      buildLegalRepresentative(56248, 22080),
      buildLegalRepresentative(56249, 39403),
    ];
    apprenticeshipContract = buildApprenticeshipContract(
      student.Id,
      35468,
      38223,
    );

    legalRepresentative1 = buildPerson(
      legalRepresentatives[0].RepresentativeId,
    );
    legalRepresentative2 = buildPersonWithEmails(
      legalRepresentatives[1].RepresentativeId,
      "display@email.ch",
    );
    jobTrainer = buildJobTrainerWithEmails(35468, "email1@email.ch");
    apprenticeshipManager = buildApprenticeshipManagerWithEmails(
      38223,
      "email1@email.ch",
      "email2@email.ch",
    );
    persons = [legalRepresentative1, legalRepresentative2];

    dropDownItems = [{ Key: myself.StayPermit, Value: "Permit Value" }];
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe(".getStudent", () => {
    it("emits the student for the given ID", () => {
      service.getStudent(student.Id).subscribe((result) => {
        expect(result).toEqual(student);
      });
      httpTestingController
        .expectOne(`https://eventotest.api/Students/${student.Id}`)
        .flush(Student.encode(student));
    });

    it("emits null when both student and person service return 404", () => {
      service.getStudent(student.Id).subscribe((result) => {
        expect(result).toBeNull();
      });

      httpTestingController
        .expectOne(`https://eventotest.api/Students/${student.Id}`)
        .flush(null, { status: 404, statusText: "Not Found" });

      httpTestingController
        .expectOne(`https://eventotest.api/Persons/${student.Id}`)
        .flush(null, { status: 404, statusText: "Not Found" });
    });
  });

  describe(".getMyself", () => {
    it("emits the current logged in person", () => {
      service.getMyself().subscribe((result) => {
        expect(result).toEqual(myself);
      });
      httpTestingController
        .expectOne("https://eventotest.api/Persons/me")
        .flush(Person.encode(myself));
    });
  });

  describe(".getLegalRepresentatives", () => {
    describe("student", () => {
      it("emits the legal representatives of given student", () => {
        service.getLegalRepresentatives(student).subscribe((result) => {
          expect(result).toEqual([legalRepresentative1, legalRepresentative2]);
        });

        expectLegalRepresentativesRequest(student.Id);
        expectPersonsRequest(persons.map((person) => person.Id));
      });

      it("emits no legal representatives for adult student", () => {
        student.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
        service.getLegalRepresentatives(student).subscribe((result) => {
          expect(result).toEqual([]);
        });

        expectLegalRepresentativesRequest(student.Id);
      });

      it("emits only legal representatives with flag for adult student", () => {
        student.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
        legalRepresentatives[0].RepresentativeAfterMajority = true;

        service.getLegalRepresentatives(student).subscribe((result) => {
          expect(result).toEqual([legalRepresentative1]);
        });
        expectLegalRepresentativesRequest(student.Id);
        expectPersonsRequest([legalRepresentatives[0].RepresentativeId]);
      });
    });

    describe("myself", () => {
      it("emits the legal representatives of given student", () => {
        service.getLegalRepresentatives(myself).subscribe((result) => {
          expect(result).toEqual([legalRepresentative1, legalRepresentative2]);
        });

        expectLegalRepresentativesRequest(myself.Id);
        expectPersonsRequest(persons.map((person) => person.Id));
      });

      it("emits no legal representatives for adult student", () => {
        myself.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
        service.getLegalRepresentatives(myself).subscribe((result) => {
          expect(result).toEqual([]);
        });

        expectLegalRepresentativesRequest(myself.Id);
      });

      it("emits only legal representatives with flag for adult student", () => {
        myself.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
        legalRepresentatives[0].RepresentativeAfterMajority = true;

        service.getLegalRepresentatives(myself).subscribe((result) => {
          expect(result).toEqual([legalRepresentative1]);
        });
        expectLegalRepresentativesRequest(myself.Id);
        expectPersonsRequest([legalRepresentatives[0].RepresentativeId]);
      });
    });
  });

  describe(".getApprenticeships", () => {
    it("emits apprenticeships of given student", () => {
      service.getApprenticeships(student.Id).subscribe((result) => {
        expect(result).toEqual([
          {
            apprenticeshipContract,
            jobTrainer,
            apprenticeshipManager,
          },
        ]);
      });

      expectApprenticeshipContractRequest(student.Id);
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("emits apprenticeships of myself", () => {
      service.getApprenticeships(myself.Id).subscribe((result) => {
        expect(result).toEqual([
          {
            apprenticeshipContract,
            jobTrainer,
            apprenticeshipManager,
          },
        ]);
      });

      expectApprenticeshipContractRequest(myself.Id);
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });
  });

  describe(".getStayPermitValue", () => {
    it("emits stay permit value of given person", () => {
      service.getStayPermitValue(myself.StayPermit).subscribe((result) => {
        expect(result).toBe("Permit Value");
      });

      expectLoadStayPermitValueRequest();
    });
  });

  function expectLegalRepresentativesRequest(
    id: number,
    response = legalRepresentatives,
  ): void {
    const url = `https://eventotest.api/Students/${id}/LegalRepresentatives`;
    httpTestingController
      .expectOne(url)
      .flush(t.array(LegalRepresentative).encode(response));
  }

  function expectApprenticeshipContractRequest(id: number): void {
    const url = `https://eventotest.api/Students/${id}/ApprenticeshipContracts/Current`;
    httpTestingController.expectOne(url).flush([apprenticeshipContract]);
  }

  function expectApprenticeshipManagerRequest(id: number): void {
    const url = `https://eventotest.api/ApprenticeshipManagers/${id}`;
    httpTestingController.expectOne(url).flush(apprenticeshipManager);
  }

  function expectJobTrainerRequest(id: number): void {
    const url = `https://eventotest.api/JobTrainers/${id}`;
    httpTestingController.expectOne(url).flush(jobTrainer);
  }

  function expectPersonsRequest(personIds: number[], response = persons): void {
    const url = `https://eventotest.api/Persons/?filter.Id=;${personIds.join(
      ";",
    )}`;

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(Person).encode(response));
  }

  function expectLoadStayPermitValueRequest(response = dropDownItems): void {
    const url = "https://eventotest.api/DropDownItems/StayPermits";
    httpTestingController
      .expectOne(url)
      .flush(t.array(DropDownItem).encode(response));
  }
});
