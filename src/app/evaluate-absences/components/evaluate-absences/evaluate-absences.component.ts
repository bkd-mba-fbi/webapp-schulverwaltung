import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';

@Component({
  selector: 'erz-evaluate-absences',
  templateUrl: './evaluate-absences.component.html',
  styleUrls: ['./evaluate-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EvaluateAbsencesStateService]
})
export class EvaluateAbsencesComponent implements OnInit {
  constructor(public state: EvaluateAbsencesStateService) {}

  ngOnInit(): void {}
}
