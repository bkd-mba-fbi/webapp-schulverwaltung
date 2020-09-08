import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as t from 'io-ts/lib/index';
import { ApprenticeshipContract } from 'src/app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from 'src/app/shared/models/legal-representative.model';
import { Person } from 'src/app/shared/models/person.model';
import { Student } from 'src/app/shared/models/student.model';
import {
  buildApprenticeshipContract,
  buildLegalRepresentative,
  buildPerson,
  buildStudent,
  buildPersonWithEmails,
} from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  StudentProfileService,
  Profile,
} from '../../shared/services/student-profile.service';
import { DropDownItem } from '../models/drop-down-item.model';

describe('StudentProfileService', () => {
  let httpTestingController: HttpTestingController;
  let service: StudentProfileService;

  let student: Student;
  let myself: Person;
  let legalRepresentatives: LegalRepresentative[];
  let apprenticeshipContract: ApprenticeshipContract;
  let jobTrainer: Person;
  let apprenticeshipManager: Person;
  let legalRepresentative1: Person;
  let legalRepresentative2: Person;
  let persons: Person[];
  let profile: Profile<Student>;
  let myProfile: Profile<Person>;
  let dropDownItems: DropDownItem[];

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StudentProfileService);

    student = buildStudent(39405);
    myself = buildPerson(39405);
    myself.StayPermit = 123456798;

    legalRepresentatives = [
      buildLegalRepresentative(56248, 22080),
      buildLegalRepresentative(56249, 39403),
    ];
    apprenticeshipContract = buildApprenticeshipContract(
      student.Id,
      35468,
      38223
    );

    legalRepresentative1 = buildPerson(
      legalRepresentatives[0].RepresentativeId
    );
    legalRepresentative2 = buildPersonWithEmails(
      legalRepresentatives[1].RepresentativeId,
      'display@email.ch'
    );
    jobTrainer = buildPersonWithEmails(35468, undefined, 'email1@email.ch');
    apprenticeshipManager = buildPersonWithEmails(
      38223,
      undefined,
      'email1@email.ch',
      'email2@email.ch'
    );
    persons = [
      legalRepresentative1,
      legalRepresentative2,
      jobTrainer,
      apprenticeshipManager,
    ];

    profile = {
      student,
      stayPermitValue: undefined,
      legalRepresentativePersons: [legalRepresentative1, legalRepresentative2],
      apprenticeshipCompanies: [
        {
          apprenticeshipContract,
          jobTrainerPerson: jobTrainer,
          apprenticeshipManagerPerson: apprenticeshipManager,
        },
      ],
    };
    myProfile = {
      student: myself,
      stayPermitValue: 'Permit Value',
      legalRepresentativePersons: [legalRepresentative1, legalRepresentative2],
      apprenticeshipCompanies: [
        {
          apprenticeshipContract,
          jobTrainerPerson: jobTrainer,
          apprenticeshipManagerPerson: apprenticeshipManager,
        },
      ],
    };

    dropDownItems = [{ Key: myself.StayPermit, Value: 'Permit Value' }];
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('.getProfile', () => {
    it('gets the profile for the given student', () => {
      service
        .getProfile(student.Id)
        .subscribe((result: Option<Profile<Student>>) => {
          expect(result).toEqual(profile);
        });
      expectStudentRequest(student.Id);
      expectLegalRepresentativesRequest(student.Id);
      expectApprenticeshipContractRequest(student.Id);
      expectPersonsRequest(persons.map((person) => person.Id));
    });
  });

  describe('.getMyProfile', () => {
    it('gets the profile for the current user', () => {
      service.getMyProfile().subscribe((result: Profile<Person>) => {
        expect(result).toEqual(myProfile);
      });
      expectMyPersonRequest();
      expectLegalRepresentativesRequest(myself.Id);
      expectApprenticeshipContractRequest(myself.Id);
      expectLoadStayPermitValueRequest();
      expectPersonsRequest(persons.map((person) => person.Id));
    });
  });

  function expectStudentRequest(id: number, response = student): void {
    const url = `https://eventotest.api/Students/${id}`;
    httpTestingController.expectOne(url).flush(Student.encode(response));
  }

  function expectMyPersonRequest(response = myself): void {
    const url = 'https://eventotest.api/Persons/me';
    httpTestingController.expectOne(url).flush(Person.encode(response));
  }

  function expectLegalRepresentativesRequest(
    id: number,
    response = legalRepresentatives
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

  function expectPersonsRequest(personIds: number[], response = persons): void {
    const url = `https://eventotest.api/Persons/?filter.Id=;${personIds.join(
      ';'
    )}`;

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(Person).encode(response));
  }

  function expectLoadStayPermitValueRequest(response = dropDownItems): void {
    const url = 'https://eventotest.api/DropDownItems/StayPermits';
    httpTestingController
      .expectOne(url)
      .flush(t.array(DropDownItem).encode(response));
  }
});
