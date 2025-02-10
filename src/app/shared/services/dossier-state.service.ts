import { Injectable, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, map, shareReplay, switchMap } from "rxjs";
import { parseQueryString } from "../utils/url";
import { StudentProfileService } from "./student-profile.service";

export const DOSSIER_PAGES = ["contact", "absences", "grades"] as const;
export type DossierPage = (typeof DOSSIER_PAGES)[number];

@Injectable()
export class DossierStateService {
  profileService = inject(StudentProfileService);
  private route = inject(ActivatedRoute);

  dossierPage$ = new BehaviorSubject<DossierPage>(DOSSIER_PAGES[0]);

  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
  );

  profile$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getProfile(id)),
    shareReplay(1),
  );

  returnParams$ = this.route.queryParams.pipe(
    map(({ returnparams }) => returnparams as string),
  );
  backlinkQueryParams$ = this.returnParams$.pipe(map(parseQueryString));

  loading$ = this.profileService.loading$;
}
