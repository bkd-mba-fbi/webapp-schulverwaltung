import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, switchMap, pluck } from 'rxjs/operators';

import { parseQueryString } from '../../utils/url';
import {
  STUDENT_PROFILE_BACKLINK,
  StudentProfileBacklink,
} from '../../tokens/student-profile-backlink';
import { StudentProfileService } from '../../services/student-profile.service';

@Component({
  selector: 'erz-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
})
export class StudentProfileComponent implements OnInit {
  studentId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );
  profile$ = this.studentId$.pipe(
    switchMap((id) => this.profileService.getProfile(id))
  );
  backlinkQueryParams$ = this.route.queryParams.pipe(
    pluck('returnparams'),
    map(parseQueryString)
  );

  constructor(
    private route: ActivatedRoute,
    public profileService: StudentProfileService,
    @Inject(STUDENT_PROFILE_BACKLINK)
    public backlink: StudentProfileBacklink
  ) {}

  ngOnInit(): void {}
}
