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
import {
  Profile,
  StudentProfileService,
} from "../../shared/services/student-profile.service";
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

  describe(".getProfile", () => {
    it("returns the profile for the given student", () => {
      service
        .getProfile(student.Id)
        .subscribe((result: Option<Profile<Student>>) => {
          expect(result).toEqual({
            student,
            stayPermitValue: undefined,
            legalRepresentativePersons: [
              legalRepresentative1,
              legalRepresentative2,
            ],
            apprenticeshipCompanies: [
              {
                apprenticeshipContract,
                jobTrainer,
                apprenticeshipManager,
              },
            ],
          });
        });
      expectStudentRequest(student.Id);
      expectLegalRepresentativesRequest(student.Id);
      expectApprenticeshipContractRequest(student.Id);
      expectPersonsRequest(persons.map((person) => person.Id));
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("returns the profile without legal representatives for adult student", () => {
      student.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);

      service
        .getProfile(student.Id)
        .subscribe((result: Option<Profile<Student>>) => {
          expect(result?.legalRepresentativePersons).toEqual([]);
        });
      expectStudentRequest(student.Id);
      expectLegalRepresentativesRequest(student.Id);
      expectApprenticeshipContractRequest(student.Id);
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("returns the profile only with legal representatives with flag for adult student", () => {
      student.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
      legalRepresentatives[0].RepresentativeAfterMajority = true;

      service
        .getProfile(student.Id)
        .subscribe((result: Option<Profile<Student>>) => {
          expect(result?.legalRepresentativePersons).toEqual([
            legalRepresentative1,
          ]);
        });
      expectStudentRequest(student.Id);
      expectLegalRepresentativesRequest(student.Id);
      expectApprenticeshipContractRequest(student.Id);
      expectPersonsRequest([legalRepresentatives[0].RepresentativeId]);
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });
  });

  describe(".getMyProfile", () => {
    it("returns the profile for the current user", () => {
      service.getMyProfile().subscribe((result: Profile<Person>) => {
        expect(result).toEqual({
          student: myself,
          stayPermitValue: "Permit Value",
          legalRepresentativePersons: [
            legalRepresentative1,
            legalRepresentative2,
          ],
          apprenticeshipCompanies: [
            {
              apprenticeshipContract,
              jobTrainer,
              apprenticeshipManager,
            },
          ],
        });
      });
      expectMyPersonRequest();
      expectLegalRepresentativesRequest(myself.Id);
      expectApprenticeshipContractRequest(myself.Id);
      expectLoadStayPermitValueRequest();
      expectPersonsRequest(persons.map((person) => person.Id));
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("returns the profile without legal representatives for adult user", () => {
      myself.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);

      service.getMyProfile().subscribe((result: Profile<Person>) => {
        expect(result.legalRepresentativePersons).toEqual([]);
      });
      expectMyPersonRequest();
      expectLegalRepresentativesRequest(myself.Id);
      expectApprenticeshipContractRequest(myself.Id);
      expectLoadStayPermitValueRequest();
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("returns the profile only with legal representatives with flag for adult", () => {
      myself.Birthdate = new Date(new Date().getFullYear() - 18, 0, 1);
      legalRepresentatives[0].RepresentativeAfterMajority = true;

      service.getMyProfile().subscribe((result: Profile<Person>) => {
        expect(result.legalRepresentativePersons).toEqual([
          legalRepresentative1,
        ]);
      });
      expectMyPersonRequest();
      expectLegalRepresentativesRequest(myself.Id);
      expectApprenticeshipContractRequest(myself.Id);
      expectLoadStayPermitValueRequest();
      expectPersonsRequest([legalRepresentatives[0].RepresentativeId]);
      expectApprenticeshipManagerRequest(
        apprenticeshipContract.ApprenticeshipManagerId,
      );
      if (apprenticeshipContract.JobTrainer) {
        expectJobTrainerRequest(apprenticeshipContract.JobTrainer);
      }
    });

    it("does not load legal representatives & apprenticeship contracts for non-student", () => {
      roles = "TeacherRole";
      service.getMyProfile().subscribe((result: Profile<Person>) => {
        expect(result).toEqual({
          student: myself,
          stayPermitValue: "Permit Value",
          legalRepresentativePersons: [],
          apprenticeshipCompanies: [],
        });
      });
      expectMyPersonRequest();
      expectLoadStayPermitValueRequest();
    });
  });

  function expectStudentRequest(id: number, response = student): void {
    const url = `https://eventotest.api/Students/${id}`;
    httpTestingController.expectOne(url).flush(Student.encode(response));
  }

  function expectMyPersonRequest(response = myself): void {
    const url = "https://eventotest.api/Persons/me";
    httpTestingController.expectOne(url).flush(Person.encode(response));
  }

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
