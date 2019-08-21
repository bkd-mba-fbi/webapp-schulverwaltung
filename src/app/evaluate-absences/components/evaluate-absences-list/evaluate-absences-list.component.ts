import { Component, OnInit } from '@angular/core';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';

@Component({
  selector: 'erz-evaluate-absences-list',
  templateUrl: './evaluate-absences-list.component.html',
  styleUrls: ['./evaluate-absences-list.component.scss']
})
export class EvaluateAbsencesListComponent implements OnInit {
  constructor(public state: EvaluateAbsencesStateService) {}

  ngOnInit(): void {}
}
