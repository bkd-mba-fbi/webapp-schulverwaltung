import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';
import { CONFIRM_ABSENCES_SERVICE } from 'src/app/shared/tokens/confirm-absences-service';

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
  ],
})
export class EvaluateAbsencesComponent {
  constructor(public state: EvaluateAbsencesStateService) {}
}
