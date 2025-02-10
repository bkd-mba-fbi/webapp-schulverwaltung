import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, shareReplay, switchMap } from "rxjs/operators";
import {
  Profile,
  StudentProfileService,
} from "src/app/shared/services/student-profile.service";
import { Person } from "../../shared/models/person.model";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const NO_ACCESS = "no_access" as const;

@Injectable()
export class MyProfileService {
  private profileService = inject(StudentProfileService);

  private reset$ = new BehaviorSubject<void>(undefined);

  private rawProfile$ = this.reset$.pipe(
    switchMap(() => this.loadProfile()),
    shareReplay(1),
  );
  profile$ = this.rawProfile$.pipe(map((p) => (p === NO_ACCESS ? null : p)));
  noAccess$ = this.rawProfile$.pipe(map((p) => p === NO_ACCESS));
  loading$ = this.profileService.loading$;

  reset(): void {
    this.reset$.next();
  }

  private loadProfile(): Observable<Profile<Person> | typeof NO_ACCESS> {
    return this.profileService.getMyProfile().pipe(
      catchError((error) => {
        if (error.status === 403) {
          return of(NO_ACCESS);
        }
        return throwError(() => error);
      }),
    );
  }
}
