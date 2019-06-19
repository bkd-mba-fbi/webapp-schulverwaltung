import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApprenticeshipContract } from 'src/app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from 'src/app/shared/models/legal-representative.model';
import { Person } from 'src/app/shared/models/person.model';
import { Student } from 'src/app/shared/models/student.model';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { spreadTriplet } from 'src/app/shared/utils/function';
import { catch404AsNull } from 'src/app/shared/utils/observable';
import { withConfig } from 'src/app/rest-error-interceptor';

export interface Profile {
  student: Student;
  legalRepresentativePersons: ReadonlyArray<Person>;
  apprenticeshipContract: Option<ApprenticeshipContract>;
  jobTrainerPerson: Option<Person>;
  apprenticeshipManagerPerson: Option<Person>;
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
        this.loadApprenticeshipContract(studentId)
      ).pipe(switchMap(spreadTriplet(this.mapToProfile.bind(this))))
    );
  }

  private loadStudent(id: number): Observable<Option<Student>> {
    return this.studentService
      .get(id, withConfig({ disableErrorHandlingForStatus: [404] }))
      .pipe(catch404AsNull());
  }

  private loadLegalRepresentatives(
    id: number
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.studentService.getLegalRepresentatives(id);
  }

  private loadApprenticeshipContract(
    id: number
  ): Observable<Option<ApprenticeshipContract>> {
    return this.studentService
      .getCurrentApprenticeshipContract(
        id,
        withConfig({ disableErrorHandlingForStatus: [404] })
      )
      .pipe(catch404AsNull());
  }

  private mapToProfile(
    student: Option<Student>,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: Option<ApprenticeshipContract>
  ): Observable<Option<Profile>> {
    if (!student) {
      return of(null);
    }
    return this.loadPersons(legalRepresentatives, apprenticeshipContract).pipe(
      map(persons =>
        this.createProfile(
          student,
          legalRepresentatives,
          apprenticeshipContract,
          persons
        )
      )
    );
  }

  private loadPersons(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: Option<ApprenticeshipContract>
  ): Observable<ReadonlyArray<Person>> {
    return this.personsService.getListForIds(
      this.getPersonIds(legalRepresentatives, apprenticeshipContract)
    );
  }

  private getPersonIds(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: Option<ApprenticeshipContract>
  ): ReadonlyArray<number> {
    const personIds = legalRepresentatives.map(
      legalRepresentative => legalRepresentative.RepresentativeRef.Id
    );
    if (apprenticeshipContract) {
      personIds.push(apprenticeshipContract.JobTrainerRef.Id);
      personIds.push(apprenticeshipContract.ApprenticeshipManagerId);
    }
    return personIds;
  }

  private createProfile(
    student: Student,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: Option<ApprenticeshipContract>,
    persons: ReadonlyArray<Person>
  ): Profile {
    let profile: Profile = {
      student,
      legalRepresentativePersons: legalRepresentatives.map(
        legalRepresentative =>
          this.findPerson(legalRepresentative.RepresentativeRef.Id, persons)
      ),
      apprenticeshipContract: null,
      jobTrainerPerson: null,
      apprenticeshipManagerPerson: null
    };

    if (apprenticeshipContract) {
      profile = {
        ...profile,
        apprenticeshipContract,
        jobTrainerPerson: this.findPerson(
          apprenticeshipContract.JobTrainerRef.Id,
          persons
        ),
        apprenticeshipManagerPerson: this.findPerson(
          apprenticeshipContract.ApprenticeshipManagerId,
          persons
        )
      };
    }

    return profile;
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
