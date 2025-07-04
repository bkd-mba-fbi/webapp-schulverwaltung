import { HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, combineLatest, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ApprenticeshipContract } from "src/app/shared/models/apprenticeship-contract.model";
import { ApprenticeshipManager } from "src/app/shared/models/apprenticeship-manager.model";
import { JobTrainer } from "src/app/shared/models/job-trainer.model";
import { LegalRepresentative } from "src/app/shared/models/legal-representative.model";
import { Person } from "src/app/shared/models/person.model";
import { Student } from "src/app/shared/models/student.model";
import { ApprenticeshipManagersRestService } from "src/app/shared/services/apprenticeship-managers-rest.service";
import { JobTrainersRestService } from "src/app/shared/services/job-trainers-rest.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { catch404 } from "src/app/shared/utils/observable";
import { RestErrorInterceptorOptions } from "../interceptors/rest-error.interceptor";
import { notNull } from "../utils/filter";
import { isAdult } from "../utils/persons";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { LoadingService } from "./loading-service";

export interface Apprenticeship {
  apprenticeshipContract: ApprenticeshipContract;
  jobTrainer: Option<JobTrainer>;
  apprenticeshipManager: Option<ApprenticeshipManager>;
}

const DOSSIER_MYSELF_CONTEXT = "dossier-myself";
const DOSSIER_STUDENT_CONTEXT = "dossier-student";
const DOSSIER_LEGAL_REPS_CONTEXT = "dossier-legal-reps";
const DOSSIER_APPRENTICESHIPS_CONTEXT = "dossier-apprenticeships";
const DOSSIER_STAY_PERMIT_CONTEXT = "dossier-stay-permit";

@Injectable({
  providedIn: "root",
})
export class StudentProfileService {
  private studentService = inject(StudentsRestService);
  private personsService = inject(PersonsRestService);
  private apprenticeshipManagersService = inject(
    ApprenticeshipManagersRestService,
  );
  private jobTrainersService = inject(JobTrainersRestService);
  private dropDownItemsService = inject(DropDownItemsRestService);
  private loadingService = inject(LoadingService);

  private readonly IGNORE_404_CONTEXT = new HttpContext().set(
    RestErrorInterceptorOptions,
    {
      disableErrorHandlingForStatus: [404],
    },
  );

  loadingStudent$ = this.loadingService.loading(DOSSIER_STUDENT_CONTEXT);
  loadingMyself$ = this.loadingService.loading(DOSSIER_MYSELF_CONTEXT);
  loadingLegalRepresentatives$ = this.loadingService.loading(
    DOSSIER_LEGAL_REPS_CONTEXT,
  );
  loadingApprenticeships$ = this.loadingService.loading(
    DOSSIER_APPRENTICESHIPS_CONTEXT,
  );
  loadingStayPermit$ = this.loadingService.loading(DOSSIER_STAY_PERMIT_CONTEXT);

  getStudent(studentId: number): Observable<Option<Student>> {
    return this.loadingService.load(
      this.personsService
        .get(studentId, { context: this.IGNORE_404_CONTEXT })
        .pipe(
          map((person) => this.createStudentFromPerson(person)),
          catch404(),
        ),
      DOSSIER_STUDENT_CONTEXT,
    );
  }

  private createStudentFromPerson(person: Person): Student {
    return {
      Id: person.Id,
      AddressLine1: person.AddressLine1,
      AddressLine2: person.AddressLine2,
      Birthdate: person.Birthdate,
      DisplayEmail: person.DisplayEmail,
      FirstName: person.FirstName ?? "",
      FullName: person.FullName ?? "",
      Gender: person.Gender ?? "X",
      LastName: person.LastName ?? "",
      Location: person.Location,
      PhoneMobile: person.PhoneMobile,
      PhonePrivate: person.PhonePrivate,
      PostalCode: person.Zip,
    } as Student;
  }

  getMyself(): Observable<Person> {
    return this.loadingService.load(
      this.personsService.getMyself({
        context: new HttpContext().set(RestErrorInterceptorOptions, {
          disableErrorHandlingForStatus: [403],
        }),
      }),
      DOSSIER_MYSELF_CONTEXT,
    );
  }

  getLegalRepresentatives(
    student: Student | Person,
  ): Observable<ReadonlyArray<Person>> {
    return this.loadingService.load(
      this.loadLegalRepresentatives(student).pipe(
        switchMap((representatives) =>
          this.loadLegalRepresentativePersons(representatives).pipe(
            map((persons) =>
              representatives
                .map((representative) =>
                  this.findPerson(representative.RepresentativeId, persons),
                )
                .filter(notNull),
            ),
          ),
        ),
      ),
      DOSSIER_LEGAL_REPS_CONTEXT,
    );
  }

  getApprenticeships(
    studentId: number,
  ): Observable<ReadonlyArray<Apprenticeship>> {
    return this.loadingService.load(
      this.loadApprenticeshipContracts(studentId).pipe(
        switchMap((contracts) =>
          combineLatest([
            this.loadApprenticeshipManagers(contracts),
            this.loadJobTrainers(contracts),
          ]).pipe(
            map(([managers, trainers]) =>
              contracts.map((contract) =>
                this.createApprenticeshipCompany(contract, managers, trainers),
              ),
            ),
          ),
        ),
      ),
      DOSSIER_APPRENTICESHIPS_CONTEXT,
    );
  }

  getStayPermitValue(stayPermit: Option<number>): Observable<Option<string>> {
    return this.loadingService.load(
      this.dropDownItemsService
        .getStayPermits()
        .pipe(
          map(
            (items) => items.find((i) => i.Key === stayPermit)?.Value || null,
          ),
        ),
      DOSSIER_STAY_PERMIT_CONTEXT,
    );
  }

  private loadLegalRepresentatives(
    person: Person | Student,
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.studentService.getLegalRepresentatives(person.Id).pipe(
      map((legalReps) => {
        const adult = isAdult(person);
        return legalReps.filter(
          (legalRep) => !adult || legalRep.RepresentativeAfterMajority,
        );
      }),
    );
  }

  private loadLegalRepresentativePersons(
    representatives: ReadonlyArray<LegalRepresentative>,
  ): Observable<ReadonlyArray<Person>> {
    if (representatives.length === 0) {
      return of([]);
    }

    return this.personsService.getListForIds(
      representatives.map((r) => r.RepresentativeId),
    );
  }

  private loadApprenticeshipContracts(
    personId: number,
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.studentService
      .getCurrentApprenticeshipContracts(personId, {
        context: this.IGNORE_404_CONTEXT,
      })
      .pipe(catch404([]));
  }

  private loadJobTrainers(
    contracts: ReadonlyArray<ApprenticeshipContract>,
  ): Observable<ReadonlyArray<JobTrainer>> {
    const ids = contracts
      .map((contract) => contract.JobTrainer)
      .filter((id): id is number => typeof id === "number");

    return ids.length === 0
      ? of([])
      : combineLatest(ids.map((id) => this.jobTrainersService.get(id)));
  }

  private loadApprenticeshipManagers(
    contracts: ReadonlyArray<ApprenticeshipContract>,
  ): Observable<ReadonlyArray<ApprenticeshipManager>> {
    const ids = contracts.map((contract) => contract.ApprenticeshipManagerId);

    return ids.length === 0
      ? of([])
      : combineLatest(
          ids.map((id) => this.apprenticeshipManagersService.get(id)),
        );
  }

  private createApprenticeshipCompany(
    contract: ApprenticeshipContract,
    managers: ReadonlyArray<ApprenticeshipManager>,
    trainers: ReadonlyArray<JobTrainer>,
  ): Apprenticeship {
    const apprenticeshipCompany: Apprenticeship = {
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
