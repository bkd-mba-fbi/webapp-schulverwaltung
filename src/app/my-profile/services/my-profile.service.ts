import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, shareReplay, switchMap } from "rxjs/operators";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentProfileService } from "src/app/shared/services/student-profile.service";
import { Person } from "../../shared/models/person.model";

@Injectable()
export class MyProfileService {
  private storageService = inject(StorageService);
  private profileService = inject(StudentProfileService);

  private reloadStudent$ = new BehaviorSubject<void>(undefined);

  person$ = this.reloadStudent$.pipe(
    switchMap(() => this.loadPerson()),
    shareReplay(1),
  );
  loadingPerson$ = this.profileService.loadingMyself$;

  legalRepresentatives$ = this.person$.pipe(
    switchMap((person) =>
      person && this.isStudent()
        ? this.profileService.getLegalRepresentatives(person)
        : of(null),
    ),
    shareReplay(1),
  );
  loadingLegalRepresentatives$ =
    this.profileService.loadingLegalRepresentatives$;

  apprenticeships$ = this.person$.pipe(
    switchMap((person) =>
      person && this.isStudent()
        ? this.profileService.getApprenticeships(person.Id)
        : of(null),
    ),
    shareReplay(1),
  );
  loadingApprenticeships$ = this.profileService.loadingApprenticeships$;

  stayPermit$ = this.person$.pipe(
    switchMap((person) =>
      person
        ? this.profileService.getStayPermitValue(person.StayPermit)
        : of(null),
    ),
  );
  loadingStayPermit$ = this.profileService.loadingStayPermit$;

  reloadStudent(): void {
    this.reloadStudent$.next();
  }

  private loadPerson(): Observable<Option<Person>> {
    return this.profileService.getMyself().pipe(
      catchError((error) => {
        if (error.status === 403) {
          // No access
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }

  private isStudent(): boolean {
    const roles = this.storageService.getPayload()?.roles?.split(";") ?? [];
    return roles.includes("StudentRole");
  }
}
