import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';

@Component({
  selector: 'erz-evaluate-absences-list',
  templateUrl: './evaluate-absences-list.component.html',
  styleUrls: ['./evaluate-absences-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluateAbsencesListComponent implements OnInit {
  constructor(public state: EvaluateAbsencesStateService) {}

  ngOnInit(): void {}

  onScroll(): void {
    this.state.nextPage();
  }
}
