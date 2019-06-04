import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApprenticeshipContract } from 'src/app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from 'src/app/shared/models/legal-representative.model';
import { Person } from 'src/app/shared/models/person.model';
import { Student } from 'src/app/shared/models/student.model';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { spreadTriplet } from 'src/app/shared/utils/function';

export interface Profile {
  student: Student;
  legalRepresentativePersons: ReadonlyArray<Person>;
  apprenticeshipContract: ApprenticeshipContract;
  jobTrainerPerson: Person;
  apprenticeshipManagerPerson: Person;
}

@Injectable({
  providedIn: 'root'
})
export class PresenceControlDetailStateService {
  constructor(
    private studentService: StudentsRestService,
    private personsService: PersonsRestService
  ) {}

  // TODO catch errors (404) else throw error

  getProfile(studentId: number): Observable<Profile> {
    return combineLatest(
      this.loadStudent(studentId),
      this.loadLegalRepresentatives(studentId),
      this.loadApprenticeshipContract(studentId)
    ).pipe(switchMap(spreadTriplet(this.mapToProfile.bind(this))));
  }

  private loadStudent(id: number): Observable<Student> {
    return this.studentService.get(id);
  }

  private loadLegalRepresentatives(
    id: number
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.studentService.getLegalRepresentatives(id);
  }

  private loadApprenticeshipContract(
    id: number
  ): Observable<ApprenticeshipContract> {
    return this.studentService.getCurrentApprenticeshipContract(id);
  }

  private mapToProfile(
    student: Student,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: ApprenticeshipContract
  ): Observable<Profile> {
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
    apprenticeshipContract: ApprenticeshipContract
  ): Observable<ReadonlyArray<Person>> {
    return this.personsService.getListForIds(
      this.getPersonIds(legalRepresentatives, apprenticeshipContract)
    );
  }

  private getPersonIds(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: ApprenticeshipContract
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

  // TODO create class profile?
  private createProfile(
    student: Student,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    apprenticeshipContract: ApprenticeshipContract,
    persons: ReadonlyArray<Person>
  ): Profile {
    return {
      student,
      legalRepresentativePersons: legalRepresentatives.map(
        legalRepresentative =>
          this.findPerson(legalRepresentative.RepresentativeRef.Id, persons)
      ),
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

  private findPerson(id: number, persons: ReadonlyArray<Person>): Person {
    return persons.filter(person => person.Id === id)[0];
  }
}
