import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY } from "rxjs";
import { shareReplay, switchMap } from "rxjs/operators";
import { StudentProfileService } from "src/app/shared/services/student-profile.service";
import { StorageService } from "../../shared/services/storage.service";

@Injectable()
export class MyProfileService {
  private reset$ = new BehaviorSubject<void>(undefined);
  profile$ = this.reset$.pipe(
    switchMap(() =>
      !this.substitutionActive() ? this.profileService.getMyProfile() : EMPTY,
    ),
    shareReplay(1),
  );
  loading$ = this.profileService.loading$;

  constructor(
    private profileService: StudentProfileService,
    private storageService: StorageService,
  ) {}

  reset(): void {
    this.reset$.next();
  }

  substitutionActive(): boolean {
    return !!this.storageService.getPayload()?.substitution_id;
  }
}
