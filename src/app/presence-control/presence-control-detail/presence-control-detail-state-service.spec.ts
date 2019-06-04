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
  buildStudent
} from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  PresenceControlDetailStateService,
  Profile
} from './presence-control-detail-state-service';

describe('PresenceControlDetailStateService', () => {
  let httpTestingController: HttpTestingController;
  let service: PresenceControlDetailStateService;

  let student: Student;
  let legalRepresentatives: LegalRepresentative[];
  let apprenticeshipContract: ApprenticeshipContract;
  let jobTrainer: Person;
  let apprenticeshipManager: Person;
  let legalRepresentative1: Person;
  let legalRepresentative2: Person;
  let persons: Person[];
  let profile: Profile;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(PresenceControlDetailStateService);

    student = buildStudent(39405);
    legalRepresentatives = [
      buildLegalRepresentative(56248, 22080),
      buildLegalRepresentative(56249, 39403)
    ];
    apprenticeshipContract = buildApprenticeshipContract(
      student.Id,
      35468,
      38223
    );

    legalRepresentative1 = buildPerson(
      legalRepresentatives[0].RepresentativeRef.Id
    );
    legalRepresentative2 = buildPerson(
      legalRepresentatives[1].RepresentativeRef.Id
    );
    jobTrainer = buildPerson(apprenticeshipContract.JobTrainerRef.Id);
    apprenticeshipManager = buildPerson(
      apprenticeshipContract.ApprenticeshipManagerId
    );
    persons = [
      legalRepresentative1,
      legalRepresentative2,
      jobTrainer,
      apprenticeshipManager
    ];

    profile = {
      student,
      legalRepresentativePersons: [legalRepresentative1, legalRepresentative2],
      apprenticeshipContract,
      jobTrainerPerson: jobTrainer,
      apprenticeshipManagerPerson: apprenticeshipManager
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('.getProfile', () => {
    it('gets the profile for the given student', () => {
      service.getProfile(student.Id).subscribe((result: Profile) => {
        expect(result).toEqual(profile);
      });
      expectStudentRequest(student.Id);
      expectLegalRepresentativesRequest(student.Id);
      expectApprenticeshipContractRequest(student.Id);
      expectPersonsRequest(persons.map(person => person.Id));
    });
  });

  function expectStudentRequest(id: number, response = student): void {
    const url = `https://eventotest.api/Students/${id}`;
    httpTestingController.expectOne(url).flush(Student.encode(response));
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
    httpTestingController.expectOne(url).flush(apprenticeshipContract);
  }

  function expectPersonsRequest(personIds: number[], response = persons): void {
    // const url = `https://eventotest.api/Persons?filter.Id=;${personIds.join(
    //   ';'
    // )}`;
    httpTestingController
      .expectOne(req => req.url === 'https://eventotest.api/Persons')
      .flush(t.array(Person).encode(response));

    // TODO url with params?
    // httpTestingController
    //   .expectOne(req => req.urlWithParams === url, url)
    //   .flush(t.array(Person).encode(response));
  }
});
