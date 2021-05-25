import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';
import { CONFIRM_ABSENCES_SERVICE } from 'src/app/shared/tokens/confirm-absences-service';
import { STUDENT_PROFILE_BACKLINK } from 'src/app/shared/tokens/student-profile-backlink';

@Component({
  selector: 'erz-evaluate-absences',
  templateUrl: './evaluate-absences.component.html',
  styleUrls: ['./evaluate-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EvaluateAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EvaluateAbsencesStateService,
    },
    { provide: STUDENT_PROFILE_BACKLINK, useValue: '/evaluate-absences' },
  ],
})
export class EvaluateAbsencesComponent implements OnInit {
  constructor(public state: EvaluateAbsencesStateService) {}

  ngOnInit(): void {}
}
