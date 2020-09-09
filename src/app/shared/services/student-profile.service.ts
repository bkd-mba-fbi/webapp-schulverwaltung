import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

import { withConfig } from 'src/app/rest-error-interceptor';
import { ApprenticeshipContract } from 'src/app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from 'src/app/shared/models/legal-representative.model';
import { Person } from 'src/app/shared/models/person.model';
import { Student } from 'src/app/shared/models/student.model';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { DropDownItemsRestService } from './drop-down-items-rest.service';
import { spreadTriplet, spreadQuadruplet } from 'src/app/shared/utils/function';
import { catch404 } from 'src/app/shared/utils/observable';
import { notNull } from '../utils/filter';
import { isAdult } from '../utils/persons';

export interface Profile<T extends Student | Person> {
  student: T;
  stayPermitValue?: string;
  legalRepresentativePersons: ReadonlyArray<Person>;
  apprenticeshipCompanies: ReadonlyArray<ApprenticeshipCompany>;
}

export interface ApprenticeshipCompany {
  apprenticeshipContract: ApprenticeshipContract;
  jobTrainerPerson: Option<Person>;
  apprenticeshipManagerPerson: Option<Person>;
}

@Injectable({
  providedIn: 'root',
})
export class StudentProfileService {
  loading$ = this.loadingService.loading$;

  constructor(
    private studentService: StudentsRestService,
    private personsService: PersonsRestService,
    private loadingService: LoadingService,
    private dropDownItemsService: DropDownItemsRestService
  ) {}

  /**
   * Returns the profile of the student with the given id.
   */
  getProfile(studentId: number): Observable<Option<Profile<Student>>> {
    return this.loadingService.load(
      combineLatest([
        this.loadStudent(studentId),
        this.loadLegalRepresentatives(studentId),
        this.loadApprenticeshipContracts(studentId),
      ]).pipe(switchMap(spreadTriplet(this.mapToProfile.bind(this))))
    );
  }

  /**
   * Returns the profile of the current user.
   */
  getMyProfile(): Observable<Profile<Person>> {
    return this.loadingService.load(
      this.personsService
        .getMyself()
        .pipe(
          switchMap((person) =>
            combineLatest(
              of(person),
              this.loadLegalRepresentatives(person.Id),
              this.loadApprenticeshipContracts(person.Id),
              this.loadStayPermitValue(person.StayPermit)
            )
          )
        )
        .pipe(
          switchMap(spreadQuadruplet(this.mapToProfile.bind(this))),
          filter(notNull) // For (type-)safety, should never be null
        )
    );
  }

  private loadStudent(id: number): Observable<Option<Student>> {
    return this.studentService
      .get(id, { params: withConfig({ disableErrorHandlingForStatus: [404] }) })
      .pipe(catch404());
  }

  private loadLegalRepresentatives(
    id: number
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.studentService.getLegalRepresentatives(id);
  }

  private loadApprenticeshipContracts(
    id: number
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.studentService
      .getCurrentApprenticeshipContracts(
        id,
        withConfig({ disableErrorHandlingForStatus: [404] })
      )
      .pipe(catch404([]));
  }

  private loadStayPermitValue(id: Option<number>): Observable<Option<string>> {
    return this.dropDownItemsService
      .getStayPermits()
      .pipe(map((items) => items.find((i) => i.Key === id)?.Value || null));
  }

  private mapToProfile<T extends Student | Person>(
    student: Option<T>,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>,
    stayPermitValue: Option<string> = null
  ): Observable<Option<Profile<T>>> {
    if (!student) {
      return of(null);
    }
    return this.loadPersons(legalRepresentatives, apprenticeshipContracts).pipe(
      map((persons) =>
        this.createProfile(
          student,
          stayPermitValue,
          legalRepresentatives,
          apprenticeshipContracts,
          persons
        )
      )
    );
  }

  private loadPersons(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>
  ): Observable<ReadonlyArray<Person>> {
    if ([...legalRepresentatives, ...apprenticeshipContracts].length === 0) {
      return of([]);
    }
    return this.personsService.getListForIds(
      this.getPersonIds(legalRepresentatives, apprenticeshipContracts)
    );
  }

  private getPersonIds(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>
  ): ReadonlyArray<number> {
    return [
      ...legalRepresentatives.map(
        (legalRepresentative) => legalRepresentative.RepresentativeId
      ),
      ...apprenticeshipContracts
        .map((contract) => contract.JobTrainer)
        .filter((id): id is number => typeof id === 'number'),
      ...apprenticeshipContracts.map(
        (contract) => contract.ApprenticeshipManagerId
      ),
    ];
  }

  private createProfile<T extends Student | Person>(
    student: T,
    stayPermitValue: Option<string>,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>,
    persons: ReadonlyArray<Person>
  ): Profile<T> {
    const profile: Profile<T> = {
      student,
      stayPermitValue: stayPermitValue || undefined,
      legalRepresentativePersons: this.getRelevantLegalRepresentatives(
        student,
        legalRepresentatives
      )
        .map((legalRepresentative) =>
          this.findPerson(legalRepresentative.RepresentativeId, persons)
        )
        .filter(notNull),
      apprenticeshipCompanies: apprenticeshipContracts.map((contract) =>
        this.createApprenticeshipCompany(contract, persons)
      ),
    };
    return profile;
  }

  private getRelevantLegalRepresentatives<T extends Student | Person>(
    person: T,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>
  ): ReadonlyArray<LegalRepresentative> {
    const adult = isAdult(person);
    return legalRepresentatives.filter(
      (representative) => !adult || representative.RepresentativeAfterMajority
    );
  }

  private createApprenticeshipCompany(
    contract: ApprenticeshipContract,
    persons: ReadonlyArray<Person>
  ): ApprenticeshipCompany {
    const apprenticeshipCompany: ApprenticeshipCompany = {
      apprenticeshipContract: contract,
      jobTrainerPerson: this.findPerson(contract.JobTrainer, persons),
      apprenticeshipManagerPerson: this.findPerson(
        contract.ApprenticeshipManagerId,
        persons
      ),
    };
    return apprenticeshipCompany;
  }

  private findPerson(
    id: Maybe<number>,
    persons: ReadonlyArray<Person>
  ): Option<Person> {
    return id ? persons.find((p) => p.Id === id) || null : null;
  }
}
