import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, pluck, takeUntil } from 'rxjs/operators';

import { parseQueryString } from '../../utils/url';
import {
  STUDENT_PROFILE_BACKLINK,
  StudentProfileBacklink,
} from '../../tokens/student-profile-backlink';
import { StudentProfileService } from '../../services/student-profile.service';
import { PresenceTypesService } from '../../services/presence-types.service';
import { StudentProfileAbsencesService } from '../../services/student-profile-absences.service';
import { ConfirmAbsencesSelectionService } from '../../services/confirm-absences-selection.service';

@Component({
  selector: 'erz-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  providers: [StudentProfileAbsencesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  profile$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getProfile(id))
  );

  halfDayActive$ = this.presenceTypesService.halfDayActive$;

  backlinkQueryParams$ = this.route.queryParams.pipe(
    pluck('returnparams'),
    map(parseQueryString)
  );

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public profileService: StudentProfileService,
    private presenceTypesService: PresenceTypesService,
    @Inject(STUDENT_PROFILE_BACKLINK)
    public backlink: StudentProfileBacklink,
    public absencesService: StudentProfileAbsencesService,
    public absencesSelectionService: ConfirmAbsencesSelectionService
  ) {}

  ngOnInit(): void {
    this.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((studentId) => this.absencesService.setStudentId(studentId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
