import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, of, shareReplay, startWith, switchMap } from "rxjs";
import { parseQueryString } from "../utils/url";
import { StudentProfileService } from "./student-profile.service";

@Injectable()
export class DossierStateService {
  private profileService = inject(StudentProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  dossierPage = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(({ url }) => url),
      startWith(this.router.url),
      map(this.getPageFromUrl.bind(this)),
    ),
    { requireSync: true },
  );

  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
  );

  student$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getStudent(id)),
    shareReplay(1),
  );
  loadingStudent$ = this.profileService.loadingStudent$;

  legalRepresentatives$ = this.student$.pipe(
    switchMap((student) =>
      student ? this.profileService.getLegalRepresentatives(student) : of(null),
    ),
    shareReplay(1),
  );
  loadingLegalRepresentatives$ =
    this.profileService.loadingLegalRepresentatives$;

  apprenticeships$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getApprenticeships(id)),
    shareReplay(1),
  );
  loadingApprenticeships$ = this.profileService.loadingApprenticeships$;

  returnParams$ = this.route.queryParams.pipe(
    map(({ returnparams }) => returnparams as string),
  );
  backlinkQueryParams$ = this.returnParams$.pipe(map(parseQueryString));

  private getPageFromUrl(url: string): string {
    const { pathname } = new URL(url, window.location.origin);
    const parts = pathname.split("/");
    const page = parts[parts.length - 1];
    return page;
  }
}
