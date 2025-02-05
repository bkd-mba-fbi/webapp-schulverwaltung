import { Injectable, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, map, shareReplay, switchMap } from "rxjs";
import { parseQueryString } from "../utils/url";
import { StudentProfileService } from "./student-profile.service";

export type DossierPage = "addresses" | "absences" | "grades";
@Injectable()
export class DossierStateService {
  profileService = inject(StudentProfileService);
  private route = inject(ActivatedRoute);

  currentDossier$ = new BehaviorSubject<DossierPage>("addresses");

  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
  );

  profile$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getProfile(id)),
    shareReplay(1),
  );

  returnParams$ = this.route.queryParams.pipe(
    map(({ returnparams }) => returnparams),
  );
  backlinkQueryParams$ = this.returnParams$.pipe(map(parseQueryString));

  loading$ = this.profileService.loading$;
}
