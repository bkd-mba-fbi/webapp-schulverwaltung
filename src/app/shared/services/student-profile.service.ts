import { HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, combineLatest, of } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { ApprenticeshipContract } from "src/app/shared/models/apprenticeship-contract.model";
import { ApprenticeshipManager } from "src/app/shared/models/apprenticeship-manager.model";
import { JobTrainer } from "src/app/shared/models/job-trainer.model";
import { LegalRepresentative } from "src/app/shared/models/legal-representative.model";
import { Person } from "src/app/shared/models/person.model";
import { Student } from "src/app/shared/models/student.model";
import { ApprenticeshipManagersRestService } from "src/app/shared/services/apprenticeship-managers-rest.service";
import { JobTrainersRestService } from "src/app/shared/services/job-trainers-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { spread } from "src/app/shared/utils/function";
import { catch404 } from "src/app/shared/utils/observable";
import { RestErrorInterceptorOptions } from "../interceptors/rest-error.interceptor";
import { notNull } from "../utils/filter";
import { isAdult } from "../utils/persons";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { StorageService } from "./storage.service";

export interface Profile<T extends Student | Person> {
  student: T;
  stayPermitValue?: string;
  legalRepresentativePersons: ReadonlyArray<Person>;
  apprenticeshipCompanies: ReadonlyArray<ApprenticeshipCompany>;
}

export interface ApprenticeshipCompany {
  apprenticeshipContract: ApprenticeshipContract;
  jobTrainer: Option<JobTrainer>;
  apprenticeshipManager: Option<ApprenticeshipManager>;
}

@Injectable({
  providedIn: "root",
})
export class StudentProfileService {
  loading$ = this.loadingService.loading$;

  constructor(
    private studentService: StudentsRestService,
    private personsService: PersonsRestService,
    private apprenticeshipManagersService: ApprenticeshipManagersRestService,
    private jobTrainersService: JobTrainersRestService,
    private loadingService: LoadingService,
    private dropDownItemsService: DropDownItemsRestService,
    private storageService: StorageService,
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
      ]).pipe(switchMap(spread(this.mapToProfile.bind(this)))),
    );
  }

  /**
   * Returns the profile of the current user.
   */
  getMyProfile(): Observable<Profile<Person>> {
    const roles = this.storageService.getPayload()?.roles?.split(";") ?? [];
    const isStudent = roles.includes("StudentRole");
    return this.loadingService.load(
      this.personsService
        .getMyself({
          context: new HttpContext().set(RestErrorInterceptorOptions, {
            disableErrorHandlingForStatus: [403],
          }),
        })
        .pipe(
          switchMap((person) =>
            combineLatest([
              of(person),
              isStudent ? this.loadLegalRepresentatives(person.Id) : of([]),
              isStudent ? this.loadApprenticeshipContracts(person.Id) : of([]),
              this.loadStayPermitValue(person.StayPermit),
            ]),
          ),
        )
        .pipe(
          switchMap(spread(this.mapToProfile.bind(this))),
          filter(notNull), // For (type-)safety, should never be null
        ),
    );
  }

  private loadStudent(id: number): Observable<Option<Student>> {
    return this.studentService
      .get(id, {
        context: new HttpContext().set(RestErrorInterceptorOptions, {
          disableErrorHandlingForStatus: [404],
        }),
      })
      .pipe(catch404());
  }

  private loadLegalRepresentatives(
    id: number,
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.studentService.getLegalRepresentatives(id);
  }

  private loadApprenticeshipContracts(
    id: number,
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.studentService
      .getCurrentApprenticeshipContracts(id, {
        context: new HttpContext().set(RestErrorInterceptorOptions, {
          disableErrorHandlingForStatus: [404],
        }),
      })
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
    stayPermitValue: Option<string> = null,
  ): Observable<Option<Profile<T>>> {
    if (!student) {
      return of(null);
    }

    legalRepresentatives = this.getRelevantLegalRepresentatives(
      student,
      legalRepresentatives,
    );

    return combineLatest([
      this.loadLegalRepresentativPersons(legalRepresentatives),
      this.loadJobTrainers(apprenticeshipContracts),
      this.loadApprenticeshipManagers(apprenticeshipContracts),
    ]).pipe(
      map(([persons, trainers, managers]) =>
        this.createProfile(
          student,
          stayPermitValue,
          legalRepresentatives,
          persons,
          apprenticeshipContracts,
          managers,
          trainers,
        ),
      ),
    );
  }

  private loadLegalRepresentativPersons(
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
  ): Observable<ReadonlyArray<Person>> {
    if (legalRepresentatives.length === 0) {
      return of([]);
    }

    return this.personsService.getListForIds(
      legalRepresentatives.map((r) => r.RepresentativeId),
    );
  }

  private loadJobTrainers(
    contracts: ReadonlyArray<ApprenticeshipContract>,
  ): Observable<ReadonlyArray<JobTrainer>> {
    const ids = contracts
      .map((contract) => contract.JobTrainer)
      .filter((id): id is number => typeof id === "number");

    if (ids.length === 0) {
      return of([]);
    }

    return combineLatest(ids.map((id) => this.jobTrainersService.get(id)));
  }

  private loadApprenticeshipManagers(
    contracts: ReadonlyArray<ApprenticeshipContract>,
  ): Observable<ReadonlyArray<ApprenticeshipManager>> {
    const ids = contracts.map((contract) => contract.ApprenticeshipManagerId);

    if (ids.length === 0) {
      return of([]);
    }

    return combineLatest(
      ids.map((id) => this.apprenticeshipManagersService.get(id)),
    );
  }

  private createProfile<T extends Student | Person>(
    student: T,
    stayPermitValue: Option<string>,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
    legalRepresentativePersons: ReadonlyArray<Person>,
    apprenticeshipContracts: ReadonlyArray<ApprenticeshipContract>,
    apprenticeshipManagers: ReadonlyArray<ApprenticeshipManager>,
    jobTrainers: ReadonlyArray<JobTrainer>,
  ): Profile<T> {
    const profile: Profile<T> = {
      student,
      stayPermitValue: stayPermitValue || undefined,
      legalRepresentativePersons: legalRepresentatives
        .map((legalRepresentative) =>
          this.findPerson(
            legalRepresentative.RepresentativeId,
            legalRepresentativePersons,
          ),
        )
        .filter(notNull),
      apprenticeshipCompanies: apprenticeshipContracts.map((contract) =>
        this.createApprenticeshipCompany(
          contract,
          apprenticeshipManagers,
          jobTrainers,
        ),
      ),
    };
    return profile;
  }

  private getRelevantLegalRepresentatives<T extends Student | Person>(
    person: T,
    legalRepresentatives: ReadonlyArray<LegalRepresentative>,
  ): ReadonlyArray<LegalRepresentative> {
    const adult = isAdult(person);
    return legalRepresentatives.filter(
      (representative) => !adult || representative.RepresentativeAfterMajority,
    );
  }

  private createApprenticeshipCompany(
    contract: ApprenticeshipContract,
    managers: ReadonlyArray<ApprenticeshipManager>,
    trainers: ReadonlyArray<JobTrainer>,
  ): ApprenticeshipCompany {
    const apprenticeshipCompany: ApprenticeshipCompany = {
      apprenticeshipContract: contract,
      jobTrainer: this.findPerson(contract.JobTrainer, trainers),
      apprenticeshipManager: this.findPerson(
        contract.ApprenticeshipManagerId,
        managers,
      ),
    };
    return apprenticeshipCompany;
  }

  private findPerson<T extends { Id: number }>(
    id: Maybe<number>,
    persons: ReadonlyArray<T>,
  ): Option<T> {
    return id ? persons.find((p) => p.Id === id) || null : null;
  }
}
