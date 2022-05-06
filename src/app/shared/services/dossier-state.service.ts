import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, pluck, shareReplay, switchMap } from 'rxjs';
import { parseQueryString } from '../utils/url';
import { StudentProfileService } from './student-profile.service';

type DossierPage = 'overview' | 'addresses' | 'absences' | 'grades';
@Injectable()
export class DossierStateService {
  isOverview$ = new BehaviorSubject<boolean>(true);
  currentDossier$ = new BehaviorSubject<DossierPage>('overview');

  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  profile$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getProfile(id)),
    shareReplay(1)
  );

  returnParams$ = this.route.queryParams.pipe(pluck('returnparams'));
  backlinkQueryParams$ = this.returnParams$.pipe(map(parseQueryString));

  loading$ = this.profileService.loading$;

  constructor(
    public profileService: StudentProfileService,
    private route: ActivatedRoute
  ) {}
}
