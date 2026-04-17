import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs";
import { parseQueryString } from "../utils/url";
import { StorageService } from "./storage.service";
import { StudentProfileService } from "./student-profile.service";

@Injectable()
export class StudentStateService {
  private profileService = inject(StudentProfileService);
  private storageService = inject(StorageService);
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

  studentId$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const id = this.findRouteParam("id");
      // Fall back to current user if no id param is present (for my-dossier)
      return Number(id ?? this.storageService.getPayload()?.id_person);
    }),
    distinctUntilChanged(),
    shareReplay(1),
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

  private findRouteParam(name: string): Option<string> {
    let current: Option<ActivatedRoute> = this.router.routerState.root;
    while (current) {
      const value = current.snapshot.paramMap.get(name);
      if (value != null) return value;
      current = current.firstChild;
    }
    return null;
  }
}
