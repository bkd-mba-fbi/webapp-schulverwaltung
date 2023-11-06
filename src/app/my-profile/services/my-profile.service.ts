import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { shareReplay, switchMap } from "rxjs/operators";
import { StudentProfileService } from "src/app/shared/services/student-profile.service";

@Injectable()
export class MyProfileService {
  private reset$ = new BehaviorSubject<void>(undefined);
  profile$ = this.reset$.pipe(
    switchMap(() => this.profileService.getMyProfile()),
    shareReplay(1),
  );
  loading$ = this.profileService.loading$;

  constructor(private profileService: StudentProfileService) {}

  reset(): void {
    this.reset$.next();
  }
}
