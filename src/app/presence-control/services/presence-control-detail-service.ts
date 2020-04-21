import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { withConfig } from 'src/app/rest-error-interceptor';
import { ApprenticeshipContract } from 'src/app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from 'src/app/shared/models/legal-representative.model';
import { Person } from 'src/app/shared/models/person.model';
import { Student } from 'src/app/shared/models/student.model';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { spreadTriplet } from 'src/app/shared/utils/function';
import { catch404 } from 'src/app/shared/utils/observable';

export interface Profile {
  student: Student;
  legalRepresentativePersons: ReadonlyArray<Person>;
  apprenticeshipCompanies: ReadonlyArray<ApprenticeshipCompany>;
}

export interface ApprenticeshipCompany {
  apprenticeshipContract: ApprenticeshipContract;
  jobTrainerPerson: Option<Person>;
  apprenticeshipManagerPerson: Person;
}

@Injectable({
  providedIn: 'root'
})
export class PresenceControlDetailService {
  loading$ = this.loadingService.loading$;

  constructor(
    private studentService: StudentsRestService,
    private personsService: PersonsRestService,
    private loadingService: LoadingService
  ) {}

  getProfile(studentId: number): Observable<Option<Profile>> {
    return this.loadingService.load(
      combineLatest(
        this.loadStudent(studentId),
        this.loadLegalRepresentatives(studentId),
        this.loadApprenticeshipContracts(studentId)
      ).pipe(switchMap(spreadTriplet(this.mapToProfile.bind(this))))
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

  private mapToProfile(
    student: Option<Student>,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>
  ): Observable<Option<Profile>> {
    if (!student) {
      return of(null);
    }
    return this.loadPersons(legalRepresentatives, apprenticeshipContracts).pipe(
      map(persons =>
        this.createProfile(
          student,
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
        legalRepresentative => legalRepresentative.RepresentativeId
      ),
      ...apprenticeshipContracts
        .map(contract => contract.JobTrainer)
        .filter((id): id is number => typeof id === 'number'),
      ...apprenticeshipContracts.map(
        contract => contract.ApprenticeshipManagerId
      )
    ];
  }

  private createProfile(
    student: Student,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>,
    persons: ReadonlyArray<Person>
  ): Profile {
    const profile: Profile = {
      student,
      legalRepresentativePersons: legalRepresentatives.map(
        legalRepresentative =>
          this.findPerson(legalRepresentative.RepresentativeId, persons)
      ),
      apprenticeshipCompanies: apprenticeshipContracts.map(contract =>
        this.createApprenticeshipCompany(contract, persons)
      )
    };
    return profile;
  }

  private createApprenticeshipCompany(
    contract: ApprenticeshipContract,
    persons: ReadonlyArray<Person>
  ): ApprenticeshipCompany {
    const apprenticeshipCompany: ApprenticeshipCompany = {
      apprenticeshipContract: contract,
      jobTrainerPerson: contract.JobTrainer
        ? this.findPerson(contract.JobTrainer, persons)
        : null,
      apprenticeshipManagerPerson: this.findPerson(
        contract.ApprenticeshipManagerId,
        persons
      )
    };
    return apprenticeshipCompany;
  }

  private findPerson(id: number, persons: ReadonlyArray<Person>): Person {
    const person = persons.find(p => p.Id === id);
    if (person) {
      return person;
    } else {
      throw new Error('person not found in list');
    }
  }
}
