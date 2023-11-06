import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, throwError } from "rxjs";
import { catchError, shareReplay, switchMap } from "rxjs/operators";
import {
  Profile,
  StudentProfileService,
} from "src/app/shared/services/student-profile.service";
import { Person } from "../../shared/models/person.model";

@Injectable()
export class MyProfileService {
  private reset$ = new BehaviorSubject<void>(undefined);

  activeSubstitution$ = new BehaviorSubject<boolean>(false);
  profile$ = this.reset$.pipe(
    switchMap(() => this.loadProfile()),
    shareReplay(1),
  );
  loading$ = this.profileService.loading$;

  constructor(private profileService: StudentProfileService) {}

  reset(): void {
    this.reset$.next();
  }

  private loadProfile(): Observable<Profile<Person>> {
    return this.profileService.getMyProfile().pipe(
      catchError((error) => {
        if (error.status === "403") {
          this.activeSubstitution$.next(true);
          return EMPTY;
        }
        return throwError(() => error);
      }),
    );
  }
}
